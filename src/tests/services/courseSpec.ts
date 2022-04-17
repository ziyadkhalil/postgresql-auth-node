import { makeAuthService } from "../../services/auth";
import { Course, makeCourseService } from "../../services/course";

const courseService = makeCourseService();
const authService = makeAuthService();

describe("Course Service Suite", () => {
  let course: Course;

  it("Creates a course", async () => {
    const instructor = await authService.createAccount(
      "course-test-instructor",
      "pass123",
      "Mr Ahmed",
      "instructor"
    );
    course = await courseService.createCourse({
      name: "Test Course",
      instructor_id: instructor.id,
    });
  });

  it("Fails to create a course with no instructor", async () => {
    await expectAsync(
      courseService.createCourse({
        name: "Test Course",
        instructor_id: 99,
      })
    ).toBeRejected();
  });

  it("Gets a course", async () => {
    const _course = await courseService.get(course.id);
    expect(_course.id).toBe(course.id);
    expect(_course.students.length).toBeDefined();
  });

  it("Lists all courses", async () => {
    const courses = await courseService.index();
    expect(courses.length).toBeGreaterThanOrEqual(1);
  });

  it("Gets course students", async () => {
    const students = await courseService.getCourseStudenets(course.id);
    expect(students.length).toBe(0);
  });
});
