import CoachingModel, {
  CoachingAttributes,
  CoachingDocument,
} from "../models/Coaching";

export class CoachingService {
  static async createCoaching(
    coachingDetails: CoachingAttributes
  ): Promise<CoachingDocument> {
    try {
      return new CoachingModel(coachingDetails);
    } catch (ex) {
      return null;
    }
  }
}
