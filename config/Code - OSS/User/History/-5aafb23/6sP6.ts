import { Router } from "express";
import Athletemetrics, { IAthleteMetrics } from "../models/AthleteMetrics";
import { IResponse } from "../types/response";
const metricsRouter = Router();

metricsRouter.post("/", async (req, res, next) => {
  try {
    console.log("Revieved Request for coaching creation", req.body);
    // Add validation and 400 Errors
    let metricsInitialization: IAthleteMetrics = req.body;
    let metrics = new Athletemetrics(metricsInitialization);
    await metrics.save();
    let response: IResponse<IAthleteMetrics> = {
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

metricsRouter.patch("/:id", async (req, res, next) => {
  try {
    let metricsInitialization: IAthleteMetrics = req.body;
    console.log(req.params, req.body);
    let updatedMetric = await Athletemetrics.findOneAndUpdate(
      { _id: req.params.id },
      metricsInitialization,
      { upsert: true, new: true }
    );
    let response = {
      status: true,
      message: "metrics updates",
      data: updatedMetric,
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

export { metricsRouter };
