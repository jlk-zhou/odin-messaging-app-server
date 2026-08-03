import request, { cookies } from "supertest";
import app from "../../app.ts";
import { prisma } from "../../lib/prisma.ts";

beforeEach(async () => {
  await prisma.user.deleteMany();
});

// Test signing up
describe("POST /api/auth/sign-up/email", () => {
  it("creates a user record in database for sign up", async () => {
    const response = await request(app)
      .post("/api/auth/sign-up/email")
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
        email: "zach@example.com",
        password: "HorseraddishLung312",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: expect.objectContaining({
        name: "Zach",
        email: "zach@example.com",
      }),
    });

    const createdUser = await prisma.user.findUnique({
      where: { email: "zach@example.com" },
    });

    expect(createdUser).toMatchObject({
      name: "Zach",
      email: "zach@example.com",
    });
  });
});

// Test signing in
describe("POST /api/auth/sign-in/email", () => {
  // Register a user first before using that to test sign in
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/sign-up/email")
      .set({ accept: "application/json" })
      .send({
        name: "Zach",
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
