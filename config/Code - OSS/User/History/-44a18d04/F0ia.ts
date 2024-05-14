import mongoose, { Document, Schema } from "mongoose";

type WeightUnit = "kg" | "pounds";

export interface E1rm extends Document {
  value: Number;
  units: WeightUnit;
  athleteId: Schema.Types.ObjectId;
  coachingId: Schema.Types.ObjectId;
}

const unitSchema = new Schema<E1rm>({
  measures: { type: String, required: true },
  units: { type: [String], required: true },
});

const UserModel = mongoose.model<E1rm>("unit", unitSchema);

export default UserModel;
