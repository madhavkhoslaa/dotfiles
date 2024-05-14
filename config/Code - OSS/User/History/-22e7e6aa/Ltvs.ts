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
    //    TODO: check if coaching already exists
    return new CoachingModel(coachingDetails);
  }

  static async addCoachingDetails(
    body: ProgramMetricsDocument
  ): Promise<ProgramMetricsDocument> {
    // check for rxisting coaching details or setup key on athlete id and coachid and month of start
    let metrics = new ProgramMetrics(body);
    await metrics.save();
    return metrics;
  }

  static async updateCoachingDetails(): Promise<CoachingDocument> {
    const result = await ProgramMetrics.findOneAndUpdate(
      { _id: req.params.id },
      metricsInitialization,
      { upsert: true, new: true }
    );
  }
}
