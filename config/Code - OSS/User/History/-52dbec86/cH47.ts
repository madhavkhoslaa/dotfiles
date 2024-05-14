// Create exercise

import { Router } from "express";
import Exercise from "../models/Exercises";
import { IExerciseChart } from "../models/Exercise";
import exp from "constants";

const exerciseChartRouter = Router();

exerciseChartRouter.post("/exercises", async (req, res, next) => {
  try {
    const newExercise: IExerciseChart = req.body;
    const exercise = new Exercise(newExercise);
    await exercise.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

// Get all exercises
exerciseChartRouter.get("/exercises", async (req, res, next) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).send();
  }
});

// Get an exercise by ID
exerciseChartRouter.get("/exercises/:id", async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).send();
  }
});

// Update an exercise
exerciseChartRouter.put("/exercises/:id", async (req, res, next) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!exercise) {
      return res.status(404).send();
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).send();
  }
});

// Delete an exercise
exerciseChartRouter.delete("/exercises/:id", async (req, res, next) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).send();
    }
    res.json({ message: "Exercise deleted" });
  } catch (error) {
    res.status(500).send();
  }
});

export { exerciseChartRouter };
