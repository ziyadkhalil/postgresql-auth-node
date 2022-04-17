import {
  makeInstructorStore,
  makeStudentStore,
  makeUserStore,
} from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userStore = makeUserStore();
const studentStore = makeStudentStore();
const instructorStore = makeInstructorStore();

const {
  TOKEN_SECRET: tokenSecret,
  BCRYPT_PASSWORD: pepper,
  SALT_ROUNDS: saltRounds,
} = process.env;

async function login(
  username: string,
  password: string
): Promise<{ username: string; token: string }> {
  if (!tokenSecret || !pepper) throw new Error("Missing env variables");

  const storedUser = await userStore.getUser(username);

  const storedUserHash = storedUser.password;

  const isValid = await bcrypt.compare(password + pepper, storedUserHash);

  if (!isValid) throw new Error("Invalid login");

  const token = jwt.sign(
    { id: storedUser.id, username: storedUser.username },
    tokenSecret
  );

  return {
    username: storedUser.username,
    token,
  };
}

async function createAccount(
  username: string,
  password: string,
  name: string,
  role: "instructor" | "student"
) {
  if (!saltRounds || !tokenSecret) throw new Error("Missing env variable");

  const hashedPassword = await bcrypt.hash(
    password + pepper,
    Number(saltRounds)
  );

  const createdUser = await userStore.createUser(username, hashedPassword);

  if (role === "instructor") {
    await instructorStore.add({ id: createdUser.id, name });
  } else {
    await studentStore.add({ id: createdUser.id, name });
  }

  const token = jwt.sign(
    { id: createdUser.id, username: createdUser.username },
    tokenSecret
  );

  return {
    id: createdUser.id,
    username: createdUser.username,
    token,
  };
}

function verify(token: string) {
  if (!tokenSecret) throw new Error("Missing env variables");
  return jwt.verify(token, tokenSecret);
}

export function makeAuthService() {
  return {
    login,
    createAccount,
    verify,
  };
}
