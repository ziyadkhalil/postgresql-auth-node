import { Router } from "express";
import { makeInstructorStore } from "../models";

export const instructorRouter = Router();

const instructorStore = makeInstructorStore();

instructorRouter.get("/", async (_, res) => {
  try {
    const instrucrors = await instructorStore.index();
    res.json(instrucrors);
  } catch (e) {
    res.status(404).send("Failed to fetch instructors");
  }
});

instructorRouter.get("/:instructorId", async (req, res) => {
  try {
    const instructor = await instructorStore.get(
      Number(req.params.instructorId)
    );
    res.json(instructor);
  } catch (e) {
    res.status(401).send("Failed to load instructor");
  }
});
