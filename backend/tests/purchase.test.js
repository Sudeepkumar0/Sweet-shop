const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Sweet = require("../../models/Sweet");

let sweetId;

describe("Purchase Route", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/sweetshop_test");
    await Sweet.deleteMany({});
    const sweet = new Sweet({
      name: "Barfi",
      price: 30,
      quantity: 5,
      category: "Indian",
    });
    await sweet.save();
    sweetId = sweet._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should purchase sweet if enough quantity", async () => {
    const res = await request(app)
      .post("/api/inventory/purchase")
      .send({ sweetId, quantity: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Purchase successful");
    expect(res.body.sweet.quantity).toBe(3);
  });

  it("should return error if not enough quantity", async () => {
    const res = await request(app)
      .post("/api/inventory/purchase")
      .send({ sweetId, quantity: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Out of stock");
  });
});
