import { Schema, model, Document } from "mongoose";

export interface IExerciseChart {
  name: string;
  bodyPart: string;
}

interface ExerciseChartDocument extends IExerciseChart, Document {}

const TrainingDataSchema = new Schema<ExerciseChartDocument>({
  name: {
    type: String,
    required: true,
  },
  bodyPart: {
    type: String,
    required: true,
  },
});

const Exercise = model<ExerciseChartDocument>(
  "exercise_chart",
  TrainingDataSchema
);

export default Exercise;
