import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const Auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization as string;
    const isVerified = jwt.verify(token, "JWT_SECRET");
  } catch {
    return res.send(500);
  } finally {
    next();
  }
};
