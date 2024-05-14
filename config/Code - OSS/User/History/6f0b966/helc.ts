import Exercise from "../models/Exercises";

class ProgramService {
  constructor() {}
  markDayAsCompleted(week: number, day: number): boolean {
    let updated = await Exercise.updateMany(
      { week: req.params.week, dayNo: req.params.day },
      { isCompleted: true, date: Date.now() }
    );
  }
}
