// be able to see profile
// be able to see all clients
// be able to see $$ data
// be able to see profile views
// be able to edit programs
// be able to see client progress
// be able to create policies for autoregulation

// Be able to create exercises
// Be able to see exercises by bodyparts
import { Router } from "express";
import Athletemetrics, { IAthleteMetrics } from "../models/AthleteMetrics";
import { IResponse } from "../types/response";
import { Auth, isConsumer, isPublisher } from "../middleware/Auth";
import Exercise, { IExercise } from "../models/Exercises";
const coachViewRouter = Router();

coachViewRouter.post(
  "/exercise/",
  Auth,
  isPublisher,
  async (req, res, next) => {
    try {
      console.log("Revieved Request for coaching creation", req.body);
      // Add validation and 400 Errors
      // Add errors for same orderId
      let exerciseData: IExercise = req.body;
      let exercise = new Exercise(exerciseData);
      await exercise.save();
      let response: IResponse<IExercise> = {
        status: true,
        message: "metrics saves",
        data: exerciseData,
      };
      res.send(response).status(200);
    } catch (err) {
      console.log(err);
      let response: IResponse<String> = {
        status: false,
        message: "Coaching Not Saved",
        data: "Internal Server Error",
      };
      res.send(response).status(500);
    } finally {
      next();
    }
  }
);

coachViewRouter.patch(
  "/exercise/:id",
  Auth,
  isPublisher,
  async (req, res, next) => {
    try {
      console.log("Revieved Request for coaching creation", req.body);
      // Add validation and 400 Errors
      // change orderId for edited patch if orderId is changed
      let metricsInitialization: IExercise = req.body;
      const result = await Exercise.findOneAndUpdate(
        { _id: req.params.id },
        metricsInitialization,
        { upsert: true, new: true }
      );
      let response = { status: true, message: "metrics saves", data: result };
      res.send(response).status(200);
    } catch (err) {
      console.log(err);
      let response: IResponse<String> = {
        status: false,
        message: "Coaching Not Saved",
        data: "Internal Server Error",
      };
      res.send(response).status(500);
    } finally {
      next();
    }
  }
);

export { coachViewRouter as programRouter };
