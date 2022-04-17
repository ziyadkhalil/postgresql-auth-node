import { PoolClient } from "pg";
import client from "../database";

export type BaseCourse = {
  id: number;
  name: string;
  instructor_id: number;
};

async function index() {
  const connection = await client.connect();
  const result = await connection.query("SELECT * FROM course");
  connection.release();
  return result.rows;
}

async function add(course: Omit<BaseCourse, "id">): Promise<BaseCourse> {
  const connection = await client.connect();
  const result = await connection.query<BaseCourse>(
    "INSERT INTO course (name, instructor_id) VALUES ($1, $2) RETURNING *;",
    [course.name, course.instructor_id]
  );
  connection.release();
  return result.rows[0];
}

async function update(
  course: Partial<BaseCourse> & { id: number }
): Promise<BaseCourse> {
  if (!course.instructor_id && !course.name)
    throw new Error("Nothing to update");
  let connection: PoolClient | undefined = undefined;
  try {
    connection = await client.connect();
    const result = await connection.query<BaseCourse>(
      `UPDATE course SET 
    ${
      course.instructor_id ? `instructor_id = '${course.instructor_id}'` : ""
    } ${course.name ? `name = '${course.name}'` : ""}  RETURNING *;`
    );

    return result.rows[0];
  } finally {
    connection?.release();
  }
}

async function remove(id: number): Promise<void> {
  const connection = await client.connect();
  await connection.query("DELETE FROM course WHERE id = $1", [id]);
  return;
}

async function get(id: number): Promise<BaseCourse> {
  const connection = await client.connect();
  const result = await connection.query<BaseCourse>(
    "SELECT * FROM course WHERE id = $1",
    [id]
  );
  connection.release();
  if (result.rowCount === 0) throw new Error("BaseCourse not found");
  return result.rows[0];
}

export function makeCourseStore() {
  return {
    index,
    add,
    remove,
    update,
    get,
  };
}
