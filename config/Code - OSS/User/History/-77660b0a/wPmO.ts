export class AuthService {
  static async userLogIn(email: String, password: String): Promise<String> {
    let user: User | null = await UserModel.findOne({
      email: req.body.email,
    });
  }
}
