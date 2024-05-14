import CoachingModel, {
  CoachingAttributes,
  CoachingDocument,
} from "../models/Coaching";
import ProgramMetrics, {
  ProgramMetricsDocument,
} from "../models/ProgramMetrics";

export class CoachingService {
  static async createCoaching(
    coachingDetails: CoachingAttributes
  ): Promise<CoachingDocument> {
    try {
      //    TODO: check if coaching already exists
      return new CoachingModel(coachingDetails);
    } catch (ex) {
      return null;
    }
  }

  static async addCoachingDetails(
    body: ProgramMetricsDocument
  ): Promise<ProgramMetricsDocument> {
    try {
      let metrics = new ProgramMetrics(body);
      await metrics.save();
      return metrics;
    } catch (ex) {}
  }
}
