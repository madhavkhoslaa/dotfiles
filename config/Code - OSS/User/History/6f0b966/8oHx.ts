import { ObjectId } from "mongoose";
import Exercise from "../models/Exercises";
import CoachingModel from "../models/Coaching";

class ProgramService {
  static async markDayAsCompleted(
    week: number,
    day: number,
    athleteId: ObjectId
  ): Promise<Boolean> {
    try {
      let coaching = await CoachingModel.findOne({ athleteId: athleteId });
      let updated = await Exercise.updateMany(
        { week: week, dayNo: day, coachingId: coaching.id },
        { isCompleted: true, date: Date.now() }
      );
      return true;
    } catch (ex) {
      return false;
    }
  }
}
