import { Router } from "express";
import { BaseCourse } from "../models";
import { makeCourseService } from "../services/course";

export const courseRouter = Router();
const courseService = makeCourseService();

courseRouter.get("/", async (_, res) => {
  try {
    const courses = await courseService.index();
    res.json(courses);
  } catch (error) {
    res.status(404).send("Failed to load courses");
  }
});

courseRouter.get("/:courseId", async (req, res) => {
  try {
    const courses = await courseService.get(Number(req.params.courseId));
    res.json(courses);
  } catch (error) {
    res.status(404).send("Failed to load course");
  }
});

courseRouter.post("/create", async (req, res) => {
  try {
    const courseParams = req.body as Omit<BaseCourse, "id">;
    if (!courseParams.instructor_id || !courseParams.name) {
      throw new Error("Invalid Params");
    }
    const course = await courseService.createCourse({
      name: courseParams.name,
      instructor_id: courseParams.instructor_id,
    });
    res.json(course);
  } catch (e) {
    res.status(404).send("Failed to load course");
  }
});
