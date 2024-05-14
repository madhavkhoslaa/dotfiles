// Be able to get program in a json
// input exercise weight
// be able to create 1erm
// be able to see weight changes
// be able to upload set videos
// be able to search coaches on platform

import { Router } from "express";
import ProgramMetric, {
  ProgramMetrics,
  ProgramMetricsDocument,
} from "../models/ProgramMetrics";
import { Auth, isConsumer } from "../middleware/Auth";
import { ExerciseDocument } from "../models/Exercises";
import { ProgramService } from "../services/ProgramService";
import { IResponse } from "../types/response";
const athleteRouter = Router();

athleteRouter.get("/meta", Auth, isConsumer, async (req, res) => {
  let response: IResponse<ProgramMetricsDocument>;
  try {
    let programMetrics = await ProgramService.getProgramMetaByAthleteId(
      req.body.authMiddleware.userId
    );
    console.log(programMetrics);
    response = {
      status: true,
      message: "Program Metrics are found",
      data: programMetrics,
    };
    res.send(response);
  } catch (ex) {
    console.log("err");
    response = {
      status: false,
      message: "Internal Server Error",
      data: null,
    };
    res.status(500).send(response);
  }
});
athleteRouter.get("/byWeekAndDay/:week/:day", async (req, res) => {
  let program: ExerciseDocument[] = await ProgramService.getProgramByWeekAndDay(
    req.params.week,
    req.params.day
  );
  let Reponse: IResponse<ExerciseDocument[]> = {
    status: true,
    message: "Program Data Found for the week and day",
    data: program,
  };
});
athleteRouter.post(
  "/submit/:exerciseId/:actualRPE/:weight/:actualReps",
  Auth,
  isConsumer,
  async (req, res) => {
    let isSubmitted = await ProgramService.submitExerciseResponse(
      req.params.actualRPE,
      req.params.actualWeight,
      req.params.actualReps,
      req.params.exerciseId
    );
    let Reponse: IResponse<Boolean> = {
      status: true,
      message: "Updated Successfully",
      data: isSubmitted,
    };
    res.send(Reponse);
  }
);
athleteRouter.post(
  "/completion/:week/:day",
  Auth,
  isConsumer,
  async (req, res) => {
    let isCompleted = await ProgramService.markDayAsCompleted(
      req.params.week,
      req.params.day,
      req.body.authMiddleware.userId
    );
    let Reponse: IResponse<Boolean> = {
      status: true,
      message: "Updated Successfully",
      data: isCompleted,
    };
    res.send(Reponse);
  }
);

export { athleteRouter };
