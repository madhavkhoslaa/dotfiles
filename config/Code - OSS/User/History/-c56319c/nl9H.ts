import { Schema, model, Document, pluralize } from "mongoose";

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

WeekPlanSchema.methods.toJSON = async function () {
  return {
    weeks: this.weeks,
    units: this.units,
    daysInWeek: this.daysInWeek,
    coachingId: this.coachingId,
  };
};
const ProgramMetric = model<ProgramMetricsDocument>(
  "program_metric",
  WeekPlanSchema
);

export default ProgramMetric;
