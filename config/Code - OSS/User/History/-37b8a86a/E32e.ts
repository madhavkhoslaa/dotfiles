import mongoose, { Document, Schema } from "mongoose";

export interface Progress extends Document {
  coachingId: string;
  exercise: string;
  e1rm: Number;
}

const unitSchema = new Schema<Progress>({
  measures: {     type: Schema.Types.ObjectId,
, required: true },
  units: { type: [String], required: true },
});

const UserModel = mongoose.model<Progress>("Progress", unitSchema);

export default UserModel;
