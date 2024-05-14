import { Schema, model, Document } from "mongoose";

export interface IExercise {
  name: string;
  weight: number;
  coachRPE: number;
  actualRPE: number;
  date: Date;
  blockNumber: number;
  week: number;
  reps: string;
  coachingId: Schema.Types.ObjectId;
  exerciseOrder: Number;
  setOrder: Number;
  actualreps: string;
  dayNo: Number;
  approximateBackoffSetWeight: Number;
  isEditable: Boolean;
  actualWeight: number;
}

interface ExerciseDocument extends IExercise, Document {}

const TrainingDataSchema = new Schema<ExerciseDocument>({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  exerciseOrder: {
    type: Number,
    required: true,
  },
  setOrder: {
    type: Number,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: false,
  },
  coachRPE: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  actualRPE: {
    type: Number,
    required: false,
    min: 0,
    max: 10,
  },
  date: {
    type: Date,
    required: true,
  },
  reps: {
    type: String,
    required: true,
  },
  actualreps: {
    type: String,
    required: false,
  },
  dayNo: {
    type: Number,
    required: true,
  },
  approximateBackoffSetWeight: {
    type: Number,
    required: false,
  },
  coachingId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isEditable: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Exercise = model<ExerciseDocument>("exercise", TrainingDataSchema);

export default Exercise;
