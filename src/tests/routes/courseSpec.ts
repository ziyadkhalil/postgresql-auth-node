import supertest from "supertest";
import { app } from "../..";

import { makeAuthService } from "../../services/auth";

const request = supertest(app);
const authService = makeAuthService();
describe("Course Route Suite", () => {
  let instructor: { id: number };
  let courseId: number;

  beforeAll(async () => {
    instructor = await authService.createAccount(
      "instructor2",
      "password123",
      "Mr Ayman",
      "instructor"
    );
  });

  it("Creates a course", async () => {
    const res = await request
      .post("/api/course/create")
      .send({ instructor_id: instructor.id, name: "Test Course" });

    courseId = res.body.id;
    expect(res.status).toBe(200);
  });

  it("Gets all courses", async () => {
    const res = await request.get("/api/course");

    expect(res.status).toBe(200);
  });

  it("Gets a course", async () => {
    const res = await request.get(`/api/course/${courseId}`);

    expect(res.status).toBe(200);
  });
});
