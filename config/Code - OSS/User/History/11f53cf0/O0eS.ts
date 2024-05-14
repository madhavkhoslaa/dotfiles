import { Router } from "express";
import Exercise, { IExercise } from "../models/Exercises";
import ProgramMetrics, {
  ProgramMetricsDocument,
} from "../models/ProgramMetrics";
import { IResponse } from "../types/response";
import { Auth, isPublisher } from "../middleware/Auth";
import { Roles } from "../types/roles";
import { CoachingService } from "../services/CoachingService";
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
    try {
      let metricsInitialization: ProgramMetricsDocument = req.body;
      const result = await ProgramMetrics.findOneAndUpdate(
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

export { coachProgram };
