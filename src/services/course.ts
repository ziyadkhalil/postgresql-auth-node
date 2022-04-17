import client from "../database";
import {
  BaseCourse,
  Student,
  makeCourseStudentStore,
  makeCourseStore,
} from "../models";

const courseStudentStore = makeCourseStudentStore();
const courseStore = makeCourseStore();

export type Course = Omit<BaseCourse, "instructor_id"> & {
  instructor: {
    id: number;
    name: string;
  };
};

type CourseStudent = Omit<Student, "overallGrade"> & { grade: string };

async function index(): Promise<Course[]> {
  const connection = await client.connect();

  const result = await connection.query(
    'SELECT course.id, course.name, instructor.name as "instructorName", instructor.id as "instructorId" FROM course LEFT OUTER JOIN instructor ON course.instructor_id = instructor.id'
  );

  connection.release();

  const courses = result.rows.map((row) => {
    const courseId = row.id;
    return {
      id: courseId,
      name: row.name,
      instructor: { id: row.instructorId, name: row.instructorName },
    };
  });

  return courses;
}

async function get(
  courseId: number
): Promise<Course & { students: CourseStudent[] }> {
  const connection = await client.connect();
  const result = await connection.query(
    'SELECT course.id, course.name, instructor.name as "instructorName", instructor.id as "instructorId" FROM course LEFT OUTER JOIN instructor ON instructor.id = course.instructor_id WHERE course.id = $1',
    [courseId]
  );
  connection.release();
  if (result.rowCount === 0) throw `No course found with id ${courseId}`;
  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    instructor: {
      id: result.rows[0].instructorId,
      name: result.rows[0].instructorName,
    },
    students: await getCourseStudenets(courseId),
  };
}

async function getCourseStudenets(courseId: number): Promise<CourseStudent[]> {
  const connection = await client.connect();
  const result = await connection.query<CourseStudent>(
    "SELECT student.id, student.name, course_student.grade FROM student INNER JOIN course_student ON course_student.student_id = student.id WHERE course_student.course_id = $1",
    [courseId]
  );
  return result.rows;
}

async function createCourse(course: Omit<BaseCourse, "id">): Promise<Course> {
  const baseCourse = await courseStore.add({
    instructor_id: course.instructor_id,
    name: course.name,
  });
  const structuredCourse = await get(baseCourse.id);
  return structuredCourse;
}

export function makeCourseService() {
  return {
    index,
    get,
    getCourseStudenets,
    updateStudentGrade: courseStudentStore.updateGrade,
    removeStudent: courseStudentStore.remove,
    addStudent: courseStudentStore.add,
    createCourse,
    updateCourse: courseStore.update,
    removeCourse: courseStore.remove,
  };
}
