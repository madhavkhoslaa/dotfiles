import { ObjectId } from "mongoose";
import Exercise from "../models/Exercises";
import CoachingModel from "../models/Coaching";

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
      let updated = await Exercise.updateMany(
        { week: week, dayNo: day, coachingId: coaching.id },
        { isCompleted: true, date: Date.now() }
      );
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
    exerciseId: ObjectId
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
      return true;
    } catch (ex) {
      return false;
    }
  }
}
