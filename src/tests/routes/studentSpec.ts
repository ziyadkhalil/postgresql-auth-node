import supertest from "supertest";
import { app } from "../..";

import { makeAuthService } from "../../services/auth";

const request = supertest(app);

const authService = makeAuthService();

describe("Student Route Suite", () => {
  let student: { id: number };
  beforeAll(async () => {
    student = await authService.createAccount(
      "student1",
      "pass123",
      "Ahmed",
      "student"
    );
  });
  it("Gets students", async () => {
    const res = await request.get("/api/student");

    expect(res.status).toBe(200);
  });

  it("Gets a student", async () => {
    const res = await request.get(`/api/student/${student.id}`);

    expect(res.status).toBe(200);
  });

  it("Fails to get student if id is invalid", async () => {
    const res = await request.get(`/api/student/999`);
    expect(res.status).toBe(401);
  });
});
