import { Router } from "express";
import Exercise, { IExercise } from "../models/Exercises";
import ProgramMetrics, {
  ProgramMetricsDocument,
} from "../models/ProgramMetrics";
import { IResponse } from "../types/response";
import { Auth, isPublisher } from "../middleware/Auth";
import { Roles } from "../types/roles";
const coachProgram = Router();

coachProgram.post("/meta-data", Auth, isPublisher, async (req, res, next) => {
  try {
    console.log("Revieved Request for coaching creation", req.body);
    // Add validation and 400 Errors
    let metricsInitialization: ProgramMetricsDocument = req.body;
    let metrics = new ProgramMetrics(metricsInitialization);
    await metrics.save();
    let response: IResponse<ProgramMetricsDocument> = {
      status: true,
      message: "metrics saves",
      data: metricsInitialization._id,
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

coachProgram.patch(
  "/meta-data/:id",
  Auth,
  isPublisher,
  async (req, res, next) => {
    try {
      if (Roles.CONSUMER == (await req.body.authMiddleware.user.getRole())) {
        let response: IResponse<String> = {
          status: false,
          message: "Unauthorized",
          data: "Unauthorized",
        };
        return res.status(401).send(response);
      }
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

coachProgram.post("/exercise/", Auth, isPublisher, async (req, res, next) => {
  try {
    console.log("Revieved Request for coaching creation", req.body);
    // Add validation and 400 Errors
    // Add errors for same orderId
    let metricsInitialization: IExercise = req.body;
    let metrics = new Exercise(metricsInitialization);
    await metrics.save();
    let response: IResponse<IExercise> = {
      status: true,
      message: "metrics saves",
      data: metricsInitialization,
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

coachProgram.patch(
  "/exercise/:id",
  Auth,
  isPublisher,
  async (req, res, next) => {
    try {
      console.log("Revieved Request for coaching creation", req.body);
      // Add validation and 400 Errors
      // change orderId for edited patch if orderId is changed
      let metricsInitialization: IExercise = req.body;
      const result = await Exercise.findOneAndUpdate(
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
