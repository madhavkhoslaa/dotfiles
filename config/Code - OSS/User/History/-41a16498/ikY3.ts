import mongoose, { Document, Schema } from "mongoose";
import { Roles } from "../types/roles";

export interface Unit extends Document {
  name: string;
  getUserRole: () => String;
}

const unitSchema = new Schema<Unit>({
  name: { type: String, required: true },
});

const UserModel = mongoose.model<Unit>("unit", unitSchema);

export default UserModel;
