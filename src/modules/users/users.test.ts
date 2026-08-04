import request from "supertest";
import app from "../../app.ts";
import {
  email as emailRegex,
  url as urlRegex,
  uuid as uuidRegex,
} from "./util/regex.ts";
import "jest-extended";

// TODO
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

// TODO
describe.skip("PUT /users/:username", () => {});

// TODO
describe.skip("DELETE /users/:username", () => {});
