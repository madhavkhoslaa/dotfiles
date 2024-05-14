import { Schema, model, Document } from "mongoose";

export interface IExercise {
  name: string;
  weight: number;
  coachRPE: number;
  actualRPE: number;
  date: Date;
  reps: number | string;
  coachingId: Schema.Types.ObjectId;
  order: Number;
  actualreps: Number;
  isDone: Boolean;
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
  order: {
    type: Number,
    required: true,
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
    type: Number | String,
    required: true,
  },
  actualreps: {
    type: Number,
    required: false,
  },
  coachingId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Exercise = model<ExerciseDocument>("exercise", TrainingDataSchema);

export default Exercise;
