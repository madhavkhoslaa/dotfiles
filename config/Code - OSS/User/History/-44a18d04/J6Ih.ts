import mongoose, { Document, Schema } from "mongoose";

type WeightUnit = "kg" | "pounds";

export interface E1rm extends Document {
  value: Number;
  units: WeightUnit;
}

const unitSchema = new Schema<Unit>({
  measures: { type: String, required: true },
  units: { type: [String], required: true },
});

const UserModel = mongoose.model<Unit>("unit", unitSchema);

export default UserModel;
