import { PoolClient } from "pg";
import client from "../database";

type Instructor = {
  id: number;
  name: string;
};

async function index() {
  const connection = await client.connect();
  const result = await connection.query("SELECT * FROM instructor");
  connection.release();
  return result.rows;
}

async function add(instructor: Instructor): Promise<Instructor> {
  const connection = await client.connect();
  const result = await connection.query<Instructor>(
    "INSERT INTO instructor (id, name) VALUES ($1, $2) RETURNING *;",
    [instructor.id, instructor.name]
  );
  connection.release();
  return result.rows[0];
}

async function update(
  instructor: Partial<Instructor> & { id: number }
): Promise<Instructor> {
  if (!instructor.name) throw new Error("Nothing to update");
  let connection: PoolClient | undefined;
  try {
    connection = await client.connect();
    const result = await connection.query<Instructor>(
      `UPDATE instructor SET name = $1 WHERE id = $2 RETURNING *`,
      [instructor.name, instructor.id]
    );

    return result.rows[0];
  } finally {
    connection?.release();
  }
}

async function remove(id: number): Promise<void> {
  let connection: PoolClient | undefined;
  try {
    connection = await client.connect();
    await connection.query("DELETE FROM instructor WHERE id = $1", [id]);
    return;
  } finally {
    connection?.release();
  }
}

async function get(id: number): Promise<Instructor> {
  const connection = await client.connect();
  const result = await connection.query<Instructor>(
    "SELECT * FROM instructor WHERE id = $1",
    [id]
  );
  connection.release();
  if (result.rowCount === 0) throw new Error("Instructor not found");
  return result.rows[0];
}

export function makeInstructorStore() {
  return {
    index,
    add,
    remove,
    update,
    get,
  };
}
