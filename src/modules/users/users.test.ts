import request from "supertest";
import app from "../../app.ts";
import {
  email as emailRegex,
  url as urlRegex,
  uuid as uuidRegex,
} from "./util/regex.ts";
import "jest-extended";
import { prisma } from "../../lib/prisma.ts";
import bcrypt from "bcryptjs";

// Seeds necessary data for the tests on users routes
// beforeEach(async () => {
//   await prisma.$transaction([
//     prisma.user.deleteMany(),
//     prisma.user.upsert({
//       where: { username: "alice" },
//       update: {},
//       create: {
//         username: "alice",
//         firstName: "Alice",
//         lastName: "Chong",
//         email: "alice@gmail.com",
//         bio: "My parents dumped me so here I am",
//         icon: "https://alice.icon.png",
//         password: await bcrypt.hash("123456", 10),
//       },
//     }),
//     prisma.user.upsert({
//       where: { username: "bob" },
//       update: {},
//       create: {
//         username: "bob",
//         firstName: "Bob",
//         lastName: "Chan",
//         email: "bob@gmail.com",
//         bio: "I'm a proud SWE",
//         icon: "https://bob.icon.png",
//         password: await bcrypt.hash("password", 10),
//       },
//     }),
//   ]);
// });

describe.skip("GET /users/:username", () => {
  it("returns a user with a particular username", async () => {
    const response = await request(app)
      .get("/users/alice")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      id: expect.stringMatching(uuidRegex),
      username: "alice",
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.stringMatching(emailRegex),
      bio: expect.any(String),
      icon: expect.stringMatching(urlRegex),
    });

    expect(response).not.toContainKey("password");
  });

  it("returns a Not-Found error for trying to get non-existent users", async () => {
    const response = await request(app)
      .get("/users/nonexistentuser")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toMatchObject({
      error: expect.stringMatching(/nonexistentuser/i),
    });
  });
});

// describe.skip("POST /users", () => {
//   it("creates a user record in database", async () => {
//     const response = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Joe",
//         email: "zach.joe@example.com",
//         password: "HorseraddishLung312",
//         confirmPassword: "HorseraddishLung312",
//       })
//       .expect("Content-Type", /json/)
//       .expect(200);

//     // Should return the user just created
//     expect(response.body).toMatchObject({
//       id: expect.stringMatching(uuidRegex),
//       username: "zach",
//       firstName: "Zach",
//       lastName: "Joe",
//       email: "zach.joe@example.com",
//     });

//     // It goes without saying that password will not be returned!
//     expect(response.body).not.toContainKey("password");

//     // Check if that user is actually created in the DB
//     const createdUser = await prisma.user.findUnique({
//       where: { username: "zach" },
//     });

//     expect(createdUser).toMatchObject({
//       id: expect.stringMatching(uuidRegex),
//       username: "zach",
//       firstName: "Zach",
//       lastName: "Joe",
//       email: "zach.joe@example.com",
//     });

//     // And that the password is hashed and stored properly
//     const passwordMatches =
//       createdUser &&
//       (await bcrypt.compare("HorseraddishLung312", createdUser.password));
//     expect(passwordMatches).toBe(true);
//   });

//   it("does not create the user if some required name fields are missing", async () => {
//     // Missing everything!
//     const noUsernameResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({})
//       .expect("Content-Type", /json/)
//       .expect(400);

//     // Should return an error message that explains what went wrong
//     expect(noUsernameResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/username/i),
//           path: "username",
//           location: "body",
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/firstname/i),
//           path: "firstName",
//           location: "body",
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/lastname/i),
//           path: "lastName",
//           location: "body",
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/email/i),
//           path: "email",
//           location: "body",
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "password",
//           location: "body",
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/(?=.*confirm)(?=.*password).*/i),
//           path: "confirmPassword",
//           location: "body",
//         },
//       ]),
//     );
//   });

//   it("does not create the user if any input is too long", async () => {
//     const response = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "toolongtoolongtoolongtoolongtoolongtoolongtoolong",
//         firstName: "toolongtoolongtoolongtoolongtoolongtoolongtoolong",
//         lastName: "toolongtoolongtoolongtoolongtoolongtoolongtoolong",
//         email: "toolongtoolongtoolongtoolongtoolongtoolongtoolong",
//         password: "toolongtoolongtoolongtoolongtoolongtoolongtoolong",
//         confirmPassword: "toolongtoolongtoolongtoolongtoolongtoolongtoolong",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(response.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/username/i),
//           path: "username",
//           location: "body",
//           value: expect.any(String),
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/firstname/i),
//           path: "firstName",
//           location: "body",
//           value: expect.any(String),
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/lastname/i),
//           path: "lastName",
//           location: "body",
//           value: expect.any(String),
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/email/i),
//           path: "email",
//           location: "body",
//           value: expect.any(String),
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "password",
//           location: "body",
//           value: expect.any(String),
//         },
//         {
//           type: "field",
//           msg: expect.stringMatching(/(?=.*confirm)(?=.*password).*/i),
//           path: "confirmPassword",
//           location: "body",
//           value: expect.any(String),
//         },
//       ]),
//     );
//   });

//   it("does not create the user with wrong email format", async () => {
//     const response = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Joe",
//         email: "Yo I'm a wrong email format so what?",
//         password: "verysecurepw",
//         confirmPassword: "verysecurepw",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(response.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/email/i),
//           path: "email",
//           location: "body",
//           value: expect.any(String),
//         },
//       ]),
//     );
//   });

//   it("does not create the user if certain unique fields already exist", async () => {
//     // Providing an username that's already in use
//     const usernameInUseResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "alice",
//         firstName: "AliceNumber2",
//         lastName: "Whatever",
//         email: "somerandomemail@example.com",
//         password: "verysecurepw",
//         confirmPassword: "verysecurepw",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(usernameInUseResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/username/i),
//           path: "username",
//           location: "body",
//           value: "alice",
//         },
//       ]),
//     );

//     // Providing an email address that's already in use
//     const emailInUseResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "foo",
//         firstName: "BobNumber2",
//         lastName: "Whatever",
//         email: "bob@gmail.com",
//         password: "verysecurepw",
//         confirmPassword: "verysecurepw",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(emailInUseResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/email/i),
//           path: "email",
//           location: "body",
//           value: "bob@gmail.com",
//         },
//       ]),
//     );
//   });

//   it("does not create the user if password doesn't meet requirement", async () => {
//     // Password must be at least 8 characters long
//     const tooShortResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Example",
//         email: "zach@example.com",
//         password: "123",
//         confirmPassword: "123",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(tooShortResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "password",
//           location: "body",
//           value: "123",
//         },
//       ]),
//     );

//     // Password must contain at least one lowercase letter
//     const noLowerCaseResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Example",
//         email: "zach@example.com",
//         password: "12345678A",
//         confirmPassword: "12345678A",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(noLowerCaseResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "password",
//           location: "body",
//           value: "12345678A",
//         },
//       ]),
//     );

//     // Password must contain at least one upper case letter
//     const noUpperCaseResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Example",
//         email: "zach@example.com",
//         password: "verysecurepw1",
//         confirmPassword: "verysecurepw1",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(noUpperCaseResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "password",
//           location: "body",
//           value: "verysecurepw1",
//         },
//       ]),
//     );

//     // Password must contain at least one number
//     const noNumberResponse = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Example",
//         email: "zach@example.com",
//         password: "verysecurepw",
//         confirmPassword: "verysecurepw",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(noNumberResponse.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "password",
//           location: "body",
//           value: "verysecurepw",
//         },
//       ]),
//     );
//   });

//   it("does not create the user if password confirmation does not match", async () => {
//     const response = await request(app)
//       .post("/users")
//       .set({ accept: "application/json" })
//       .send({
//         username: "zach",
//         firstName: "Zach",
//         lastName: "Smith",
//         email: "zach@example.com",
//         password: "VerySecurePw123",
//         confirmPassword: "VerySecurePw122",
//       })
//       .expect("Content-Type", /json/)
//       .expect(400);

//     expect(response.body.errors).toEqual(
//       expect.arrayContaining([
//         {
//           type: "field",
//           msg: expect.stringMatching(/password/i),
//           path: "confirmPassword",
//           location: "body",
//           value: "VerySecurePw122",
//         },
//       ]),
//     );
//   });
// });

describe("PUT /users/:username", () => {});

// TODO
describe("DELETE /users/:username", () => {});
