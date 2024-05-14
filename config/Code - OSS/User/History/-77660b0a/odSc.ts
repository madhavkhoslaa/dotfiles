import UserModel from "../models/User";
import User from "../models/User";

export class AuthService {
  static async userLogIn(email: String, password: String): Promise<String> {
    let user = await UserModel.findOne({
      email: email,
    });
    let user_password = await UserPasswordsModel.findOne({
      userId: user?.id,
    });
  }
}
