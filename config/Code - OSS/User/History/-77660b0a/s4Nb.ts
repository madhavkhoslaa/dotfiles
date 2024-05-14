import UserModel from "../models/User";
import User from "../models/User";
import UserPasswordsModel from "../models/UserPasswords";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  static async userLogIn(email: String, password: string): Promise<String> {
    let user = await UserModel.findOne({
      email: email,
    });
    let user_password = await UserPasswordsModel.findOne({
      userId: user?.id,
    });
    let isPasswordSame = await bcrypt.compare(
      password,
      user_password?.password as string
    );
    if (isPasswordSame) {
      const syncToken = jwt.sign({ role: user_password?.role }, "JWT_SECRET");
      return syncToken;
    } else {
      return "BAD_PASSWORD";
    }
  }
}
