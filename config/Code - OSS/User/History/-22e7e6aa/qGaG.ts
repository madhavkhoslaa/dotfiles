import { CoachingAttributes } from "../models/Coaching";

export class CoachingService {
  async createCoaching(coachingDetails: CoachingAttributes) {
    let response: IResponse<CoachingAttributes> = {
            let coaching = new CoachingModel(coachingInitialization);
      status: true,
      message: "Coaching Relationship Saved",
      data: coachingInitialization,
    };
        await coaching.save();

  }
}
