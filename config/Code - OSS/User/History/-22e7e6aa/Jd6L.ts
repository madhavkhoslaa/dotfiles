import CoachingModel, { CoachingAttributes } from "../models/Coaching";

export class CoachingService {
  async createCoaching(coachingDetails: CoachingAttributes) {
    try {
      return new CoachingModel(coachingDetails);
    } catch (ex) {
      return null;
    }
  }
}
