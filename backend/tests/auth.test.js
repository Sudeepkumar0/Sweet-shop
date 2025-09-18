const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/User");

describe("Auth: Register and Login", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/sweetshop_test");
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpass",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should login and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "testpass" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
