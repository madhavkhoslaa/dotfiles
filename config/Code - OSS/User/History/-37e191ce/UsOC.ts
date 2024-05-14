import { Router } from "express";
import CoachingModel, { CoachingAttributes } from "../models/Coaching";
import { IResponse } from "../types/response";
import { Auth } from "../middleware/Auth";
const coachingRouter = Router();

coachingRouter.post("/", Auth, async (req, res, next) => {
  try {
  } catch (err) {}
});

export { coachingRouter };
