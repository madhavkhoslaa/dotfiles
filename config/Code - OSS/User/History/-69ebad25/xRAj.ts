import { Schema, model, Document } from "mongoose";

export interface CoachingAttributes {
  coachId: Schema.Types.ObjectId;
  athleteId: Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  validTill: Date;
}

export interface CoachingDocument extends CoachingAttributes, Document {}

const CoachingSchema = new Schema<CoachingDocument>({
  coachId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  athleteId: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "user",
    },
  ],
  isActive: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  validTill: {
    type: Date,
    required: false,
  },
});

const CoachingModel = model<CoachingDocument>("coaching", CoachingSchema);

export default CoachingModel;
