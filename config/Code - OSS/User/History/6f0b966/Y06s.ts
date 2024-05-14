import { ObjectId } from "mongoose";
import Exercise from "../models/Exercises";

class ProgramService {
  static async markDayAsCompleted(
    week: number,
    day: number,
    athleteId: ObjectId
  ): Promise<Boolean> {
    try {
      let updated = await Exercise.updateMany(
        { week: week, dayNo: day, coachingId: coachingId },
        { isCompleted: true, date: Date.now() }
      );
      return true;
    } catch (ex) {
      return false;
    }
  }
}
