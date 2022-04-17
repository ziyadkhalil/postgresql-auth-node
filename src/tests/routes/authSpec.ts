import supertest from "supertest";
import { app } from "../..";

const request = supertest(app);

describe("Auth Route Suite", () => {
  it("Creates an account", async () => {
    const res = await request.post("/api/auth/register").send({
      username: "test-route",
      password: "password123",
      role: "instructor",
      name: "Mr Aly",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Logs in", async () => {
    const res = await request.post("/api/auth/login").send({
      username: "test-route",
      password: "password123",
    });

    expect(res.status).toBe(200);
  });

  it("Fails to login", async () => {
    const res = await request.post("/api/auth/login").send({
      username: "test-route",
      password: "wrong password",
    });
    expect(res.status).toBe(404);
  });
});
