import UserModel from "../models/User";
import User from "../models/User";
import UserPasswordsModel from "../models/UserPasswords";

export class AuthService {
  static async userLogIn(email: String, password: String): Promise<String> {
    let user = await UserModel.findOne({
      email: email,
    });
    let user_password = await UserPasswordsModel.findOne({
      userId: user?.id,
    });
    let isPasswordSame = await bcrypt.compare(
      req.body.password,
      user_password?.password as string
    );
  }
}
