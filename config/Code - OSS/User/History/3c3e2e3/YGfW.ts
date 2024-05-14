import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserPasswordsModel from "../models/UserPasswords";

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
      req.headers. = { userId: user.userId };
      next();
    }
  } catch {
    return res.send(500);
  }
};
