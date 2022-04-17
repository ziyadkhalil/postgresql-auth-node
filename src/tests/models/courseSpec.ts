import { BaseCourse, makeCourseStore } from "../../models";
import { makeAuthService } from "../../services/auth";

const courseStore = makeCourseStore();
const authService = makeAuthService();

describe("Course Model Suite", () => {
  let instructor: { id: number; username: string };
  let course: BaseCourse;
  beforeAll(async () => {
    instructor = await authService.createAccount(
      "course-instructor",
      "pass123",
      "Mr World",
      "instructor"
    );
  });
  it("Creates a course", async () => {
    course = await courseStore.add({
      name: "History",
      instructor_id: instructor.id,
    });
    expect(course.name).toBe("History");
  });

  it("Gets a course", async () => {
    const getCourse = await courseStore.get(course.id);
    expect(getCourse.instructor_id).toBe(instructor.id);
  });

  it("Lists courses", async () => {
    const courses = await courseStore.index();

    expect(courses.length).toBeGreaterThanOrEqual(1);
  });

  it("Updates a course", async () => {
    const updatedCourse = await courseStore.update({
      id: course.id,
      name: "History II",
    });
    expect(updatedCourse.name).toBe("History II");
  });

  it("Deletes a course", async () => {
    await courseStore.remove(course.id);
  });
});
