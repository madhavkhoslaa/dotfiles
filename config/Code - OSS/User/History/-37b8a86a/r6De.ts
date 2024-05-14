import mongoose, { Document, Schema } from "mongoose";

export interface Progress extends Document {
  coachingId: Schema.Types.ObjectId;
  exercise: string;
  e1rm: Number;
}

const unitSchema = new Schema<Progress>({
  coachingId: {  type: Schema.Types.ObjectId, required: true },
  exercise: { type: String, required: true },
});

const UserModel = mongoose.model<Progress>("Progress", unitSchema);

export default UserModel;

   ,
