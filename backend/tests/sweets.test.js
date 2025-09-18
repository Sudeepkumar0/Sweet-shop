const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Sweet = require("../../models/Sweet");
const User = require("../../models/User");
let adminToken;
let sweetId;

describe("Sweets CRUD", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/sweetshop_test");
    await Sweet.deleteMany({});
    await User.deleteMany({});
    // Create admin user
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "admin",
        email: "admin@example.com",
        password: "adminpass",
      });
    await User.updateOne(
      { email: "admin@example.com" },
      { $set: { role: "admin" } }
    );
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "adminpass" });
    adminToken = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Ladoo")
      .field("price", 50)
      .field("quantity", 100)
      .field("category", "Indian");
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Ladoo");
    sweetId = res.body._id;
  });

  it("should list all sweets", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a sweet by id", async () => {
    const res = await request(app).get(`/api/sweets/${sweetId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(sweetId);
  });

  it("should update a sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("price", 60);
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(60);
  });

  it("should delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sweet deleted");
  });
});
