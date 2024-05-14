import mongoose, { Document, Schema } from "mongoose";
import { Roles } from "../types/roles";

export interface User extends Document {
  getRole(): unknown;
  name: string;
  dob: Date;
  bio: string;
  photo: string; // Assuming S3 URL is a string
  sport: string;
  years: number;
  isCoach: boolean;
  email: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  bio: { type: String, required: false },
  photo: { type: String, required: false },
  sport: { type: String, required: true },
  years: { type: Number, required: true },
  isCoach: { type: Boolean, required: true },
  email: { type: String, required: true },
});

userSchema.methods.getRole = async function () {
  if (this.isCoach) {
    return Roles.PUBLISHER;
  }
  return Roles.CONSUMER;
};
const UserModel = mongoose.model<User>("user", userSchema);

export default UserModel;
