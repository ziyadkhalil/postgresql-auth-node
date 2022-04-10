import { Router } from "express";
import { makeStudentStore } from "../models";

export const studentRouter = Router();

const studentStore = makeStudentStore();

studentRouter.get("/", async (_, res) => {
  try {
    const students = await studentStore.index();
    res.json(students);
  } catch (e) {
    res.status(404).send("Failed to fetch students");
  }
});

studentRouter.get("/:studentId", async (req, res) => {
  try {
    const student = await studentStore.get(Number(req.params.studentId));
    res.json(student);
  } catch (e) {
    res.status(401).send("Failed to load student");
  }
});
