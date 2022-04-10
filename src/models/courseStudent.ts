import { PoolClient } from "pg";
import client from "../database";

type CourseStudent = {
  studentId: number;
  courseId: number;
  grade: string;
};

async function add(
  courseStudent: Omit<CourseStudent, "grade">
): Promise<CourseStudent> {
  const connection = await client.connect();
  const result = await connection.query<CourseStudent>(
    "INSERT INTO course_student (student_id, course_id) VALUES ($1, $2) RETURNING *;",
    [courseStudent.studentId, courseStudent.courseId]
  );
  connection.release();
  return result.rows[0];
}

async function updateGrade(
  courseStudent: CourseStudent
): Promise<CourseStudent> {
  let connection: PoolClient | undefined = undefined;
  try {
    connection = await client.connect();
    const result = await connection.query<CourseStudent>(
      "UPDATE course_student SET grade = $1 WHERE course_id = $2 AND student_id = $3 RETURNING *;",
      [courseStudent.grade, courseStudent.courseId, courseStudent.studentId]
    );

    return result.rows[0];
  } finally {
    connection?.release();
  }
}

async function remove(
  courseStudent: Omit<CourseStudent, "grade">
): Promise<void> {
  const connection = await client.connect();
  await connection.query(
    "DELETE FROM course WHERE course_id = $1 AND student_id = $2",
    [courseStudent.courseId, courseStudent.studentId]
  );
  return;
}

export function makeCourseStudentStore() {
  return {
    add,
    remove,
    updateGrade,
  };
}
