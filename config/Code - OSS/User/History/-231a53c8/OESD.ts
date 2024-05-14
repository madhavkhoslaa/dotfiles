import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  name: string;
  dob: Date;
  bio: string;
  photo: string; // Assuming S3 URL is a string
  sport: string;
  years: number;
  isCoach: boolean;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  bio: { type: String, required: false },
  photo: { type: String, required: false },
  sport: { type: String, required: true },
  years: { type: Number, required: true },
  isCoach: { type: Boolean, required: true },
});

const UserModel = mongoose.model<User>("user", userSchema);

export default UserModel;
