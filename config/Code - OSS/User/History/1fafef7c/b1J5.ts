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
import { ObjectId } from "mongodb";
import {
  E1RMFormula,
  OneRepMaxCalculator,
} from "../services/AutoRqgulation/e1rmCalculator";
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
    let coachingId = await CoachingModel.findOne({
      athleteId: req.body.authMiddleware.userId,
    });
    let pMetric = await ProgramMetric.findOne({ coachingId: coachingId._id });
    console.log(
      (pMetric.e1rmStrat as unknown as E1RMFormula) === E1RMFormula.Epley
    );

    let rmcalc = new OneRepMaxCalculator(
      parseFloat(weight),
      parseInt(actualReps),
      pMetric.e1rmStrat as unknown as E1RMFormula
    );
    let orm = rmcalc.calculate1RM();
    let ormData = new e1rmModel({
      value: orm,
      units: pMetric.units,
      athleteId: req.body.authMiddleware.userId,
      coachingId: coachingId._id,
      exerciseName: updated.name,
      exerciseID: new ObjectId(exerciseId),
    });
    await ormData.save();
    res.send(updated);
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
