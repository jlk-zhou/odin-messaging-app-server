import request from "supertest";
import app from "../../app.ts";
import {
  email as emailRegex,
  url as urlRegex,
  uuid as uuidRegex,
} from "./util/regex.ts";
import "jest-extended";
import { prisma } from "../../lib/prisma.ts";
import { auth } from "../../lib/auth.ts";
import { test } from "../../tests/jest.setup.ts";

describe("GET /api/users/:username", () => {
  beforeEach(async () => {
    const alice = test.createUser({
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      username: "alice",
      password: "SecurePassword123",
    });
    await test.saveUser(alice);
  });

  afterEach(async () => {
    await test.deleteUser("1");
  });

  it("returns a user with a particular username", async () => {
    const response = await request(app)
      .get("/api/users/alice")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.stringMatching(emailRegex),
      username: "alice",
      bio: expect.toBeOneOf([String, null]),
    });

    expect(response).not.toContainKey("password");
  });

  it("returns a Not-Found error for trying to get non-existent users", async () => {
    const response = await request(app)
      .get("/api/users/nonexistentuser")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toMatchObject({
      error: expect.stringMatching(/nonexistentuser/i),
    });
  });
});

// TODO
describe.skip("PUT /api/users/:username", () => {});

// TODO
describe.skip("DELETE /api/users/:username", () => {});
