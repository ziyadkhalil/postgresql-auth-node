import {
  BaseCourse,
  makeCourseStore,
  makeCourseStudentStore,
} from "../../models";
import { makeAuthService } from "../../services/auth";

const courseStudentStore = makeCourseStudentStore();
const courseStore = makeCourseStore();
const authService = makeAuthService();

describe("Course Student Model Suite", () => {
  let course: BaseCourse;
  let student: { id: number };
  let instructor: { id: number; username: string };

  beforeAll(async () => {
    instructor = await authService.createAccount(
      "course-student-instructor",
      "pass123",
      "Mr Instructor",
      "instructor"
    );
    student = await authService.createAccount(
      "course-student-instructor",
      "pass123",
      "Mr Instructor",
      "student"
    );

    course = await courseStore.add({
      name: "Maths",
      instructor_id: instructor.id,
    });
  });

  it("Adds a student to a course", async () => {
    const courseStudent = await courseStudentStore.add({
      courseId: course.id,
      studentId: student.id,
    });

    expect(courseStudent.courseId).toBe(course.id);
    expect(courseStudent.studentId).toBe(student.id);
  });

  it("Updates a student grade", async () => {
    const courseStudent = await courseStudentStore.updateGrade({
      courseId: course.id,
      studentId: student.id,
      grade: "C",
    });

    expect(courseStudent.grade).toBe("C");
  });

  it("Removes a student from a course", async () => {
    await courseStudentStore.remove({
      courseId: course.id,
      studentId: student.id,
    });
  });
});
