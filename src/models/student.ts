import { PoolClient } from "pg";
import client from "../database";

export type Student = {
  id: number;
  name: string;
  overallGrade: string;
};

async function index() {
  const connection = await client.connect();
  const result = await connection.query("SELECT * FROM student");
  connection.release();
  return result.rows;
}

async function add(student: Omit<Student, "overallGrade">): Promise<Student> {
  const connection = await client.connect();
  const result = await connection.query<Student>(
    'INSERT INTO student (id, name) VALUES ($1, $2) RETURNING id, name, overall_grade as "overallGrade";',
    [student.id, student.name]
  );
  connection.release();
  return result.rows[0];
}

async function update(
  student: Partial<Student> & { id: number }
): Promise<Student> {
  if (!(student.overallGrade || student.name))
    throw new Error("Nothing to update");
  let connection: PoolClient | undefined = undefined;
  try {
    connection = await client.connect();
    const result = await connection.query<Student>(
      `UPDATE student SET 
    ${
      student.overallGrade ? `overall_grade = '${student.overallGrade}',` : ""
    } ${
        student.name ? `name = '${student.name}'` : ""
      }  RETURNING id, name, overall_grade as "overallGrade";`
    );

    return result.rows[0];
  } finally {
    connection?.release();
  }
}

async function remove(id: number): Promise<void> {
  const connection = await client.connect();
  await connection.query("DELETE FROM student WHERE id = $1", [id]);
  return;
}

async function get(id: number): Promise<Student> {
  const connection = await client.connect();
  const result = await connection.query<Student>(
    'SELECT id, name, overall_grade as "overallGrade" FROM student WHERE id = $1',
    [id]
  );
  connection.release();
  if (result.rowCount === 0) throw new Error("Student not found");
  return result.rows[0];
}

export function makeStudentStore() {
  return {
    index,
    add,
    remove,
    update,
    get,
  };
}
