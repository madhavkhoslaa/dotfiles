import { Schema, model, Document } from "mongoose";

export interface ProgramMetrics {
  weeks: number;
  units: "kg" | "pounds";
  daysInWeek: number;
  coachingId: Schema.Types.ObjectId;
}

export interface ProgramMetricsDocument extends ProgramMetrics, Document {}

const WeekPlanSchema = new Schema<ProgramMetricsDocument>({
  weeks: {
    type: Number,
    required: true,
  },
  units: {
    type: String,
    enum: ["kg", "pounds"],
    required: true,
  },
  daysInWeek: {
    type: Number,
    required: true,
  },
  coachingId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const ProgramMetric = model<ProgramMetricsDocument>("WeekPlan", WeekPlanSchema);

export default ProgramMetric;

/**
 *  weeks: number
 *  units: kg or pounds
 *  daysinweek: number
 */
