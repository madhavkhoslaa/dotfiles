import { Router } from "express";
const loginRouter = Router();
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
import UserPasswordsModel from "../models/UserPasswords";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../middleware/Auth";

loginRouter.post("/signup", async (req, res, next) => {
  try {
    if (req.body.password.length < 8) {
      return res.status(400).send("400");
    }
    let UserPassword = {
      role: req.body.role,
      userId: user_details.id,
      password: req.body.password,
      token: jwt.sign({ role: user_details.getRole() }, "JWT_SECRET"),
    };
    let password_model = new UserPasswordsModel(UserPassword);
    password_model.save();
    return res.send(password_model);
  } catch {}
});

loginRouter.post("/signin", Auth, async (req, res, next) => {
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

export { loginRouter };
