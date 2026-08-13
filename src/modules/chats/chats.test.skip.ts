// import request from "supertest";
// import app from "../../app.ts";

// const agent = request.agent(app);

// Create a new user to be used for all tests
// beforeAll(async () => {
//   await agent
//     .post("/api/auth/sign-up/email")
//     .set({ accept: "application/json" })
//     .send({
//       name: "Zach",
//       username: "zachjoe",
//       email: "zach@example.com",
//       password: "HorseraddishLung312",
//       confirmPassword: "HorseraddishLung312",
//     });
// });

// // Sign in before each test
// beforeEach(async () => {
//   await agent
//     .post("/api/auth/sign-in/username")
//     .set({ accept: "application/json" })
//     .send({
//       username: "zachjoe",
//       password: "HorseraddishLung312",
//     });
// });

// describe.skip("GET /chats", () => {
//   it("denies access when not signed in", async () => {
//     // Log out first
//     await agent.post("/api/auth/sign-out").set({
//       accept: "application/json",
//     });

//     await agent.get("/chats").expect("Content-Type", /json/).expect(401);
//   });

//   it("allows access after sign in", async () => {
//     await agent.get("/chats").expect("Content-Type", /json/).expect(200);
//   });
// });

// Sign out after the tests are all finished
// afterAll(async () => {
//   await agent.post("api/auth/sign-out").set({ accept: "application/json" });
// });
