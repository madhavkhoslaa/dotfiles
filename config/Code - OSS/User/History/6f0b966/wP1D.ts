import Exercise from "../models/Exercises";

class ProgramService {
  constructor() {}
  async markDayAsCompleted(week: number, day: number): boolean {
    try{   
         let updated = await Exercise.updateMany(
      { week: week, dayNo: day },
      { isCompleted: true, date: Date.now() }
    );
    return true;}
        catch(){
            return false
        }
  }
}
