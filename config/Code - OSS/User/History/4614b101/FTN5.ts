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
import CoachingModel from "../models/Coaching";
const coachViewRouter = Router();

coachViewRouter.get(
  "/profle/",
  Auth,
  isPublisher,
  async (req, res, next) => {}
);

coachViewRouter.get("/clients/", Auth, isPublisher, async (req, res, next) => {
  let Coaching = await CoachingModel.find({
    coachId: req.body.authMiddleware.userId,
  })
    .populate({ path: "athleteId", model: "user" })
    .populate({ path: "coachId", model: "user" });
  res.send(Coaching);
});

coachViewRouter.get("/views");

coachViewRouter.get("/program/:id");

coachViewRouter.get("progress/:clientId");

coachViewRouter.post("createPolicy/:exerciseId");

export { coachViewRouter };
