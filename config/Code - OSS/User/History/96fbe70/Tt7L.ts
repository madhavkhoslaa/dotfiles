import { Schema, model, Document } from "mongoose";

// Define the possible values for the 'unit' field
type WeightUnit = "kg" | "pounds" | "cms" | "m";

export interface IAthleteMetrics {
  athleteId: Schema.Types.ObjectId;
  unit: WeightUnit;
  metric: string;
  video?: string; // Optional field for S3 URL
  value: Number;
  createdAt: Date;
}

interface AthleteMetricsDocument extends IAthleteMetrics, Document {}

const AthleteMetricsSchema = new Schema<AthleteMetricsDocument>({
  athleteId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "pounds", "cms", "m"],
    required: true,
  },
  metric: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: false,
  },
  value: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

AthleteMetricsSchema.index(
  { metric: 1, athleteId: 1, createdAt: 1 },
  { unique: true }
);

const Athletemetrics = model<AthleteMetricsDocument>(
  "athlete_metrics",
  AthleteMetricsSchema
);

export default Athletemetrics;

/**
 * athleteID: objectId
 * unit: enum of kg or pounds
 * exercise: string
 * video: s3url optional
 * weight: boolean
 */
