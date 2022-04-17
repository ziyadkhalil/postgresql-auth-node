import supertest from "supertest";
import { app } from "../..";
import { makeAuthService } from "../../services/auth";

const request = supertest(app);

const authService = makeAuthService();

describe("Instructor Route Suite", () => {
  let token: string;
  let instructor: { id: number; token: string };
  beforeAll(async () => {
    instructor = await authService.createAccount(
      "instructor1",
      "pass123",
      "Mr Khaled",
      "instructor"
    );
    token = instructor.token;
  });

  it("Gets instructors", async () => {
    const res = await request
      .get("/api/instructor")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("Gets an instructor", async () => {
    const res = await request
      .get(`/api/instructor/${instructor.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("Fails to get instructor if token is missing", async () => {
    const res = await request.get(`/api/instructor/${instructor.id}`);
    expect(res.status).toBe(401);
  });
});
