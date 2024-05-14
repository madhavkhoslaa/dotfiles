import { Router } from "express";
import CoachingModel, {
  CoachingAttributes,
  CoachingDocument,
} from "../models/Coaching";
import { IResponse } from "../types/response";
import { Auth } from "../middleware/Auth";
import { CoachingService } from "../services/CoachingService";
const coachingRouter = Router();

coachingRouter.post("/", Auth, async (req, res, next) => {
  let response: IResponse<CoachingDocument>;
  try {
    let coachingDetails = await CoachingService.createCoaching(req.body);
    response = {
      status: true,
      message: "Coaching Relationship Saved",
      data: coachingDetails,
    };
    res.send(response).status(200);
  } catch (err) {
    console.log(err);
    let response{
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
