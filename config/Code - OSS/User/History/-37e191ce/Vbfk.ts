import { Router } from "express";
import CoachingModel, { CoachingAttributes } from "../models/Coaching";
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
const coachingRouter = Router();

coachingRouter.post("/", async (req, res, next) => {
  try {
    console.log("Revieved Request for coaching creation", req.body);
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

/**
 * TODO
 * FIX TIMEEEEEE OF VALIDATION !!!!!!!!
 * Add Endpoints to cancelCoaching
 * Add expiry
 */
export { coachingRouter };
