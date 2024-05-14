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
    let user = await UserPasswordsModel.findOne({ token });
    if (!isVerified || user === null) {
      return res.send("Not authenticated");
    }
    if (isVerified) {
      let userDetails = UserModel.findById(user.userId);
      req.body.authMiddleware = { userId: user.userId };
      next();
    }
  } catch {
    return res.send(500);
  }
};
