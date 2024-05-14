import { Router } from "express";
import CoachingModel, { CoachingAttributes } from "../models/Coaching";
import { IResponse } from "../types/response";
import { Auth } from "../middleware/Auth";
import { CoachingService } from "../services/CoachingService";
const coachingRouter = Router();

coachingRouter.post("/", Auth, async (req, res, next) => {
  let response: IResponse<CoachingAttributes>;
  try {
    let coachingDetails = CoachingService.createCoaching(req.body);
    {
      status: true,
      message: "Coaching Relationship Saved",
      data: coachingInitialization,
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
});

export { coachingRouter };
