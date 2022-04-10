import client from "../database";

async function getUser(username: string): Promise<{
  id: number;
  username: string;
  password: string;
}> {
  const connection = await client.connect();

  const result = await connection.query(
    'SELECT id, username, password FROM "user" WHERE username = $1',
    [username]
  );

  connection.release();

  if (result.rowCount === 0) {
    throw new Error("Cant find user");
  }

  return result.rows[0];
}

async function createUser(
  username: string,
  password: string
): Promise<{ id: number; username: string }> {
  const connection = await client.connect();

  const result = await connection.query(
    'INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, password]
  );

  connection.release();

  return result.rows[0];
}

export function makeUserStore() {
  return {
    getUser,
    createUser,
  };
}
