import mongoose, { Document, Schema } from "mongoose";

type WeightUnit = "kg" | "pounds";

export interface E1rm extends Document {
  value: Number;
  units: WeightUnit;
  athleteId: Schema.Types.ObjectId;
  coachingId: Schema.Types.ObjectId;
  exerciseName: String;
  exerciseID: Schema.Types.ObjectId;
}

const E1rmSchema: Schema = new Schema(
  {
    value: { type: Number, required: true },
    units: { type: String, required: true },
    athleteId: { type: Schema.Types.ObjectId, required: true },
    coachingId: { type: Schema.Types.ObjectId, required: true },
    exerciseName: { type: String, required: true },
    exerciseID: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
const e1rmModel = mongoose.model<E1rm>("athlete_e1rm", E1rmSchema);

export default e1rmModel;
