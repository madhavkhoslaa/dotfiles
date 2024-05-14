import { Schema, Document, model, Types } from "mongoose";
import bcrypt from "bcrypt";

interface IUserPasswords extends Document {
  userId: Types.ObjectId;
  password: string;
  role: string;
}

const UserPasswordsSchema = new Schema<IUserPasswords>({
  userId: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  JWTtoken: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

UserPasswordsSchema.pre<IUserPasswords>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return next();
  } catch (error) {
    return next();
  }
});
const UserPasswordsModel = model<IUserPasswords>(
  "user_password",
  UserPasswordsSchema
);

export default UserPasswordsModel;
