// Be able to get program in a json
// input exercise weight
// be able to create 1erm
// be able to see weight changes
// be able to upload set videos
// be able to search coaches on platform

import { Router } from "express";
import CoachingModel, { CoachingAttributes } from "../models/Coaching";
import ProgramMetric from "../models/ProgramMetrics";
import { Auth, isConsumer } from "../middleware/Auth";
import Exercise from "../models/Exercises";
import e1rmModel from "../models/e1rm";
import { E1RMFormula } from "../services/AutoRqgulation/e1rmCalculator";
const athleteRouter = Router();

athleteRouter.get("/meta", Auth, isConsumer, async (req, res) => {
  // TODO : fix krow
  let meta = await ProgramMetric.find({
    athleteId: req.body.authMiddleware.userId,
  });
  res.send(meta);
});
athleteRouter.get("/byWeekAndDay/:week/:day", async (req, res) => {
  let weekNo = req.params.week;
  let day = req.params.day;
  let exercise = await Exercise.find({ week: weekNo, dayNo: day });
  res.send(exercise);
});
athleteRouter.post(
  "/submit/:exerciseId/:actualRPE/:weight/:actualReps",
  Auth,
  isConsumer,
  async (req, res) => {
    let actualRPE = req.params.actualRPE;
    let weight = req.params.weight;
    let exerciseId = req.params.exerciseId;
    let actualReps = req.params.actualReps;
    let updated = await Exercise.findOneAndUpdate(
      { _id: exerciseId, isCompleted: true },
      { actualWeight: weight, actualRPE: actualRPE, actualreps: actualReps }
    );
    res.send(updated);
    let coachingId = await CoachingModel.find({
      athleteId: req.body.authMiddleware.userId,
    });
    let 1rm = calculate1RM()
    // TODO:
    // 1. get coaching id
    // 1. get strat
    // 2. calculate e1rm
    // 3.store in db

    //4. create endpoint to fetch graph
    // calculate 1erm here
    // approximateBackoffSetWeight for next set
  }
);
athleteRouter.post(
  "/completion/:week/:day",
  Auth,
  isConsumer,
  async (req, res) => {
    let updated = await Exercise.updateMany(
      { week: req.params.week, dayNo: req.params.day },
      { isCompleted: true, date: Date.now() }
    );
    res.send(updated);
  }
  // backoff set is calculated based off currentWeight
);

export { athleteRouter };
