import { Router } from "express";
const loginRouter = Router();
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
import UserPasswordsModel from "../models/UserPasswords";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../middleware/Auth";
import { AuthService } from "../services/AuthService";

loginRouter.post("/signin", async (req, res, next) => {
  let password = AuthService.userLogIn(req.body.email, req.body.password);
  } else {
    return res.send("bad auhth");
  }
});

loginRouter.post("/logout", Auth, async (req, res, next) => {
  let user: User | null = await UserModel.findOne({
    email: req.body.email,
  });
  let user_password = await UserPasswordsModel.findOne({
    userId: user?.id,
  });
  if (user_password === null) {
  }
  let isPasswordSame = await bcrypt.compare(
    req.body.password,
    user_password?.password as string
  );
  if (isPasswordSame) {
    user_password!.token = null;
    await user_password.save();
  }
  return res.send();
});

loginRouter.post("/signin", Auth, async (req, res, next) => {
  let user: User | null = await UserModel.findOne({
    email: req.body.email,
  });
  let user_password = await UserPasswordsModel.findOne({
    userId: user?.id,
  });
  if (user_password === null) {
  }
  let isPasswordSame = await bcrypt.compare(
    req.body.password,
    user_password?.password as string
  );
  if (isPasswordSame) {
    user_password.token = jwt.sign(
      { role: await req.body.authMiddleware.user.getRole() },
      "JWT_SECRET"
    );
    await user_password.save();
  }
  return res.send(user_password.token);
});

export { loginRouter };
