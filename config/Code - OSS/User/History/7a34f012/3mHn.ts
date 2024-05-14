import { Router } from "express";
const loginRouter = Router();
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
import UserPasswordsModel from "../models/UserPasswords";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../middleware/Auth";

loginRouter.post("/signin", async (req, res, next) => {
  let user: User | null = await UserModel.findOne({
    email: req.body.email,
  });
  let user_password = await UserPasswordsModel.findOne({
    userId: user?.id,
  });
  let isPasswordSame = await bcrypt.compare(
    req.body.password,
    user_password?.password as string
  );
  const syncToken = jwt.sign({ role: user_password?.role }, "JWT_SECRET");
  return res.send(syncToken);
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
  if (isPasswordSame) user_password!.token = null;
  await user_password.save();
  const syncToken = jwt.sign({ role: user_password?.role }, "JWT_SECRET");
  return res.send(syncToken);
});

export { loginRouter };
