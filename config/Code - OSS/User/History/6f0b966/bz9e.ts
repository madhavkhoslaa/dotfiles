import { ObjectId } from "mongoose";
import Exercise, { ExerciseDocument } from "../models/Exercises";
import CoachingModel from "../models/Coaching";
import { ProgramMetricsDocument } from "../models/ProgramMetrics";

export class ProgramService {
  static async markDayAsCompleted(
    week: String,
    day: String,
    athleteId: ObjectId
  ): Promise<Boolean> {
    try {
      let coaching = await CoachingModel.findOne({ athleteId: athleteId });
      if (coaching === null) {
        throw new Error("Coachng not found for athlete");
      }
      await Exercise.updateMany(
        { week: week, dayNo: day, coachingId: coaching.id },
        { isCompleted: true, date: Date.now() }
      );
      // backoff set is calculated based off currentWeight
      return true;
    } catch (ex) {
      console.log("Error while updating day for athlete" + athleteId);
      return false;
    }
  }
  static async submitExerciseResponse(
    actualRPE: String,
    actualWeight: String,
    actualReps: String,
    exerciseId: String
  ): Promise<Boolean> {
    try {
      let updated = await Exercise.findOneAndUpdate(
        { _id: exerciseId, isCompleted: true },
        {
          actualWeight: actualWeight,
          actualRPE: actualRPE,
          actualreps: actualReps,
        }
      );
      // calculate 1erm here
      // approximateBackoffSetWeight for next set
      return true;
    } catch (ex) {
      return false;
    }
  }
  static async getProgramByWeekAndDay(
    week: String,
    dayNo: String
  ): Promise<ExerciseDocument[]> {
    try {
      return await Exercise.find({ week, dayNo });
    } catch (ex) {
      return [];
    }
  }

  static async getProgramMetaByAthleteId(
    athleteId: ObjectId
  ): Promise<ProgramMetricsDocument> {
    try {
      return await CoachingModel.findOne({
        athleteId,
      });
    } catch (ex) {
      return null;
    }
  }
}
