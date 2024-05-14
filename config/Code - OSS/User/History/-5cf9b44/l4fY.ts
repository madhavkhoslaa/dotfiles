import { Schema, model, Document } from "mongoose";

export interface IExercise {
  name: string;
  weight: number;
  coachRPE: number;
  actualRPE: number;
  date: Date;
  reps: string;
  coachingId: Schema.Types.ObjectId;
  exerciseOrder: Number;
  setOrder: Number;
  actualreps: string;
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
  coachingId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Exercise = model<ExerciseDocument>("exercise", TrainingDataSchema);

export default Exercise;
