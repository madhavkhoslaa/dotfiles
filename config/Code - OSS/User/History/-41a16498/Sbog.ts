import mongoose, { Document, Schema } from "mongoose";
import { Roles } from "../types/roles";

export interface User extends Document {
  name: string;
  getUserRole: () => String;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
});

const UserModel = mongoose.model<User>("user", userSchema);

export default UserModel;
