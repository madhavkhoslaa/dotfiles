import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization as string;
    console.log(token);
    const isVerified = jwt.verify(token, "JWT_SECRET");
    if (!isVerified || token === null) {
      return res.send("BKL AUTH KAR!!!");
    }
  } catch {
    return res.send(500);
  } finally {
    next();
  }
};
