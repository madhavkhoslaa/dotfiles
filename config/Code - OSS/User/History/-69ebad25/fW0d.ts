import { Schema, model, Document } from "mongoose";

export interface CoachingAttributes {
  coachId: Schema.Types.ObjectId;
  athleteId: Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  validTill: Date;
}

interface CoachingDocument extends CoachingAttributes, Document {}

const CoachingSchema = new Schema<CoachingDocument>({
  coachId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  athleteId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
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

/**
 * coachId: objectiD
 * athleteId: objectiD
 * isActive: boolean
 * createdAt: date
 * constraints: athleteId should be unique
 */
