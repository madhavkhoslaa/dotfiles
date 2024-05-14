import { Schema, Document, model, Types } from "mongoose";

interface IUserPasswords extends Document {
  userId: Types.ObjectId;
  password: string;
  role: string;
}

const UserPasswordsSchema = new Schema<IUserPasswords>({
  userId: {
    type: Types.ObjectId,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

const UserPasswordsModel = model<IUserPasswords>(
  "UserPasswords",
  UserPasswordsSchema
);

export default UserPasswordsModel;
