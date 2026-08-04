import request, { cookies } from "supertest";
import app from "../../app.ts";
import { prisma } from "../../lib/prisma.ts";
import * as z from "zod";

beforeEach(async () => {
  await prisma.user.deleteMany();
});

// Test signing up
describe("POST /api/auth/sign-up/email", () => {
  const endpoint = "/api/auth/sign-up/email";

  it("creates a user record in database for sign up", async () => {
    const response = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        username: "zachjoe",
        email: "zach@example.com",
        password: "HorseraddishLung312",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: expect.objectContaining({
        name: "Zach",
        username: "zachjoe",
        email: "zach@example.com",
      }),
    });

    const createdUser = await prisma.user.findUnique({
      where: { email: "zach@example.com" },
    });

    expect(createdUser).toMatchObject({
      name: "Zach",
      username: "zachjoe",
      email: "zach@example.com",
    });
  });

  it("does not create the user if some required fields are missing", async () => {
    const response = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({})
      .expect("Content-Type", /json/)
      .expect(400);

    // Should include an error message for each field went wrong
    const errors: z.core.$ZodIssue[] = JSON.parse(response.body.message);
    expect(errors).toIncludeAllMembers([
      expect.objectContaining({
        path: expect.arrayContaining(["name"]),
        message: expect.any(String),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["username"]),
        message: expect.any(String),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["email"]),
        message: expect.any(String),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["password"]),
        message: expect.any(String),
      }),
    ]);
  });

  it("does not create the user if any user info input is too long", async () => {
    const response = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "toolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolong",
        username:
          "toolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolong",
        email:
          "toolongtoolongtoolongtoolongtoolongtoolongtoolong@toolongtoolongtoolongtoolong.com",
        // Long password will be caught by Better Auth instead of Zod
        password: "GoodPassword2456",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    const errors: z.core.$ZodIssue[] = JSON.parse(response.body.message);
    expect(errors).toIncludeAllMembers([
      expect.objectContaining({
        path: expect.arrayContaining(["name"]),
        message: expect.any(String),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["username"]),
        message: expect.any(String),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["email"]),
        message: expect.any(String),
      }),
    ]);
  });

  it("does not create the user if password is too long or too short", async () => {
    const longPasswordResponse = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Good Name",
        username: "goodusername",
        email: "goodemail@example.com",
        password:
          "Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456Toolongtoolong2456",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(longPasswordResponse.body).toMatchObject({
      message: expect.stringMatching(/password/i),
    });

    const shortPasswordResponse = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Good Name",
        username: "goodusername",
        email: "goodemail@example.com",
        password: "Short1",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(shortPasswordResponse.body).toMatchObject({
      message: expect.stringMatching(/password/i),
    });
  });

  it("does not create the user with wrong email format", async () => {
    const response = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        username: "zachjoe",
        email: "Yo I'm a wrong email format so what?",
        password: "Verysecurepw1",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    const errors: z.core.$ZodIssue[] = JSON.parse(response.body.message);
    expect(errors).toIncludeAllMembers([
      expect.objectContaining({
        path: expect.arrayContaining(["email"]),
        message: expect.any(String),
      }),
    ]);
  });

  it("does not create the user if certain unique fields already exist", async () => {
    await request(app).post(endpoint).set({ accept: "application/json" }).send({
      name: "Zach",
      username: "zachjoe",
      email: "zach@example.com",
      password: "SecurePw111",
    });

    const usernameTakenResponse = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        username: "zachjoe",
        email: "zachjoe@example.com",
        password: "SecurePw111",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(usernameTakenResponse.body).toMatchObject({
      message: expect.stringMatching(/username/i),
    });

    const emailTakenResponse = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        username: "zachjoel",
        email: "zach@example.com",
        password: "SecurePw111",
      })
      .expect("Content-Type", /json/)
      .expect(422);

    expect(emailTakenResponse.body).toMatchObject({
      message: expect.stringMatching(/email/i),
    });
  });

  it("does not create the user if password doesn't meet requirement", async () => {
    const response = await request(app)
      .post(endpoint)
      .set({ accept: "application/json" })
      .send({
        name: "Good Name",
        username: "goodusername",
        email: "goodemail@example.com",
        // Password meets no requirements: no letters and numbers
        password: "!!!!!!!!!",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    const errors: z.core.$ZodIssue[] = JSON.parse(response.body.message);
    expect(errors).toIncludeAllMembers([
      expect.objectContaining({
        path: expect.arrayContaining(["password"]),
        message: expect.stringMatching(/lower/i),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["password"]),
        message: expect.stringMatching(/upper/i),
      }),
      expect.objectContaining({
        path: expect.arrayContaining(["password"]),
        message: expect.stringMatching(/number/i),
      }),
    ]);
  });

  // TODO
  it.skip("does not create the user if password confirmation does not match", async () => {});
});

// Test signing in
describe("POST /api/auth/sign-in/*", () => {
  const endpoint = "/api/auth/sign-in/email";
  // Register a user first before using that to test sign in
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/sign-up/email")
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        username: "zachjoe",
        email: "zach@example.com",
        password: "HorseraddishLung312",
      });
  });

  it("logs user in for correct email-password combination", async () => {
    const response = await request(app)
      .post("/api/auth/sign-in/email")
      .set({ accept: "application/json" })
      .send({
        email: "zach@example.com",
        password: "HorseraddishLung312",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    // Successful login should return a token
    expect(response.body.token).toEqual(expect.any(String));

    // And the user
    expect(response.body.user).toMatchObject({
      name: "Zach",
      username: "zachjoe",
      email: "zach@example.com",
    });

    // Should attach session cookie to response header
    expect(cookies.set({ name: "session_token" }));
  });

  it("logs user in for correct username-password combination", async () => {
    const response = await request(app)
      .post("/api/auth/sign-in/username")
      .set({ accept: "application/json" })
      .send({
        username: "zachjoe",
        password: "HorseraddishLung312",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    // Successful login should return a token
    expect(response.body.token).toEqual(expect.any(String));

    // And the user
    expect(response.body.user).toMatchObject({
      name: "Zach",
      username: "zachjoe",
      email: "zach@example.com",
    });

    // Should attach session cookie to response header
    expect(cookies.set({ name: "session_token" }));
  });

  it("does not log user in for wrong email-password combination", async () => {
    await request(app)
      .post("/api/auth/sign-in/email")
      .set({ accept: "application/json" })
      .send({
        email: "zach@example.com",
        password: "12345678",
      })
      .expect("Content-Type", /json/)
      .expect(401);
  });

  it("does not log user in for wrong username-password combination", async () => {
    await request(app)
      .post("/api/auth/sign-in/username")
      .set({ accept: "application/json" })
      .send({
        username: "zachjoe",
        password: "12345678",
      })
      .expect("Content-Type", /json/)
      .expect(401);
  });
});

// Test signing out
describe("POST /api/auth/sign-out", () => {
  const agent = request.agent(app);

  beforeEach(async () => {
    await agent
      .post("/api/auth/sign-up/email")
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        email: "zach@example.com",
        password: "HorseraddishLung312",
      });

    // Log user in just in case
    await agent
      .post("/api/auth/sign-in/email")
      .set({ accept: "application/json" })
      .send({
        email: "zach@example.com",
        password: "HorseraddishLung312",
      });
  });

  it("logs user out successfully", async () => {
    await agent
      .post("/api/auth/sign-out")
      .set({ accept: "application/json" })
      .expect(200);
  });
});
