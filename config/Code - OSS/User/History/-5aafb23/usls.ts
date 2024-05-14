import { Router } from "express";
import Athletemetrics, { IAthleteMetrics } from "../models/AthleteMaxes";
import { IResponse } from "../types/response";
const metricsRouter = Router();

metricsRouter.post('/', async (req, res, next) => {
    try{
        console.log("Revieved Request for coaching creation", req.body);
        // Add validation and 400 Errors
        let metricsInitialization: IAthleteMetrics = req.body;
        let metrics = new Athletemetrics(metricsInitialization);
        await metrics.save();
        let response: IResponse<IAthleteMetrics> = {status: true, message: "metrics saves", data: metricsInitialization}
        res.send(response).status(200);
    }
    catch(err){
        console.log(err)
        let response: IResponse<String> = {status: false, message: "Coaching Not Saved", data: "Internal Server Error"}
        res.send(response).status(500);
    }
    finally{
        next();
    }
})

metricsRouter.update('/')
// Add metric and date unique key and methods to update metric by id


export {metricsRouter}