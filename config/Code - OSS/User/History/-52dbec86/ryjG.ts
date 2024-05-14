// Create exercise

import e, { Router } from "express";
import ExerciseChart, { IExerciseChart } from "../models/ExerciseChart";
import exp from "constants";

const exerciseChartRouter = Router();

exerciseChartRouter.post("/exercises", async (req, res, next) => {
  try {
    const newExercise: IExerciseChart = req.body;
    const exercise = new ExerciseChart(newExercise);
    await exercise.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// Get all exercises
exerciseChartRouter.get("/exercises", async (req, res, next) => {
  try {
    const exercises = await ExerciseChart.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).send();
  }
});

exerciseChartRouter.get("/exercises/byName/:name", async (req, res, next) => {
  try {
    const exercises = await ExerciseChart.findOne({ name: req.params.name });
    res.json(exercises);
  } catch (error) {
    res.status(500).send();
  }
});

exerciseChartRouter.get("/exercises/byPart/:part", async (req, res, next) => {
  try {
    const exercises = await ExerciseChart.find({ name: req.params.part });
    res.json(exercises);
  } catch (error) {
    res.status(500).send();
  }
});

// Get an exercise by ID
exerciseChartRouter.get("/exercises/:id", async (req, res, next) => {
  try {
    const exercise = await ExerciseChart.findById(req.params.id);
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
    const exercise = await ExerciseChart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
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
    const exercise = await ExerciseChart.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).send();
    }
    res.json({ message: "Exercise deleted" });
  } catch (error) {
    res.status(500).send();
  }
});

export { exerciseChartRouter };
