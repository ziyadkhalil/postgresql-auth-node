import express, { json, urlencoded } from "express";
import { authMiddleware } from "./middleware/auth";
import {
  authRouter,
  courseRouter,
  instructorRouter,
  studentRouter,
} from "./routes";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api/course", courseRouter);
app.use("/api/instructor", authMiddleware, instructorRouter);
app.use("/api/student", studentRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("server up");
});
