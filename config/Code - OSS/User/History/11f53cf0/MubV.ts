import { Router } from "express";
import Exercise, { IExercise } from "../models/Exercises";
import ProgramMetrics, {
  ProgramMetricsDocument,
} from "../models/ProgramMetrics";
import { IResponse } from "../types/response";
import { Auth, isPublisher } from "../middleware/Auth";
import { Roles } from "../types/roles";
import { CoachingService } from "../services/CoachingService";
import { CoachingDocument } from "../models/Coaching";
const coachProgram = Router();

coachProgram.post("/meta-data", Auth, isPublisher, async (req, res, next) => {
  let response: IResponse<ProgramMetricsDocument>;
  try {
    console.log("Revieved Request for coaching creation", req.body);
    // Add validation and 400 Errors
    let result = await CoachingService.addCoachingDetails(req.body);
    response = {
      status: false,
      message: "Program metrics added",
      data: result,
    };
    res.send(response).status(200);
  } catch (err) {
    console.log(err);
    response = {
      status: false,
      message: "Coaching Not Saved",
      data: null,
    };
    res.send(response).status(500);
  } finally {
    next();
  }
});

coachProgram.patch(
  "/meta-data/:id",
  Auth,
  isPublisher,
  async (req, res, next) => {
    let response: IResponse<CoachingDocument>;
    try {
      let updatedData = await CoachingService.updateCoachingDetails(
        req.body,
        req.params.id
      );
      response = {
        status: true,
        message: "Program Details Updated",
        data: updatedData,
      };
      res.send(response).status(200);
    } catch (err) {
      console.log(err);
      response = {
        status: false,
        message: "Coaching details Not updated",
        data: null,
      };
      res.send(response).status(500);
    } finally {
      next();
    }
  }
);

export { coachProgram };
