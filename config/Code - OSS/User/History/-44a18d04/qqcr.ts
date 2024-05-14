import mongoose, { Document, Schema } from "mongoose";

export interface Unit extends Document {
  measures: string;
  units: [string];
  getUserRole: () => String;
}

const unitSchema = new Schema<Unit>({
  measures: { type: String, required: true },
  units: { type: [String], required: true },
});

const UserModel = mongoose.model<Unit>("unit", unitSchema);

export default UserModel;
