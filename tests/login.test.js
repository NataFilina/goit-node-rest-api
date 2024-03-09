import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";

mongoose.set("strictQuery", false);

describe("login", () => {
  it("should login user", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "test@test.com",
      password: "qwerty111",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.token).toBe(response.body.user.token);
    expect({
      user: {
        email: response.body.user.email,
        subscription: response.body.user.subscription,
      },
    }).toStrictEqual({
      user: {
        email: "test@test.com",
        subscription: "starter",
      },
    });
  });
});
