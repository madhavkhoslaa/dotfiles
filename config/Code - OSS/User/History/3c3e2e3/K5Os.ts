import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserPasswordsModel from "../models/UserPasswords";
import UserModel from "../models/User";

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization as string;
    if (token === undefined) {
      return res.send("Token not found");
    }
    console.log(token);
    const isVerified = jwt.verify(token, "JWT_SECRET");
    console.log(isVerified);
    let userPassword = await UserPasswordsModel.findOne({ token });
    if (!isVerified || userPassword === null) {
      return res.send("Not authenticated");
    }
    if (isVerified) {
      let user = await UserModel.findById(userPassword.userId);
      req.body.authMiddleware = {
        userId: userPassword.userId,
        user,
      };
      next();
    }
  } catch {
    return res.send(500);
  }
};
