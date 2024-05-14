import { Schema, model, Document } from "mongoose";

export interface IExercise {
  name: string;
  bodyPart: string;
}

interface ExerciseDocument extends IExercise, Document {}

const TrainingDataSchema = new Schema<ExerciseDocument>({
  name: {
    type: String,
    required: true,
  },
  bodyPart: {
    type: String,
    required: true,
  },
});

const Exercise = model<ExerciseDocument>("exercise_chart", TrainingDataSchema);

export default Exercise;
