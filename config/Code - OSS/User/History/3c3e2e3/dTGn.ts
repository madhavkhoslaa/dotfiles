import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization as string;
    if (token === undefined) {
      return res.send("Token not found");
    }
    console.log(token);
    const isVerified = jwt.verify(token, "JWT_SECRET");
    console.log(isVerified);
    if (!isVerified) {
      return res.send("Not authenticated");
    }
    if (isVerified) {
      next();
    }
  } catch {
    return res.send(500);
  }
};
