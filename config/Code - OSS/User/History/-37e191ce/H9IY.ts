import { Router } from "express";
import CoachingModel, { CoachingAttributes } from "../models/Coaching";
import { IResponse } from "../types/response";
import { Auth } from "../middleware/Auth";
const coachingRouter = Router();

coachingRouter.post("/", Auth, async (req, res, next) => {
  try {
    CoachingService.createCoaching(req.body);
    // Add validation and 400 Errors
    let coachingInitialization: CoachingAttributes = req.body;
    let coaching = new CoachingModel(coachingInitialization);
    await coaching.save();
    let response: IResponse<CoachingAttributes> = {
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
