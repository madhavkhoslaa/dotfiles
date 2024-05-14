import mongoose, { Document, Schema } from "mongoose";

export interface Progress extends Document {
  coachingId: Schema.Types.ObjectId;
  exercise: string;
  e1rm: Number;
}

const unitSchema = new Schema<Progress>({
  coachingId: { type: Schema.Types.ObjectId, required: true, ref: "coaching" },
  exercise: { type: String, required: true },
  e1rm: { type: Number, required: true },
});

const progressModel = mongoose.model<Progress>("Progress", unitSchema);

export default progressModel;
