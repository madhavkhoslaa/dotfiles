import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserPasswordsModel from "../models/UserPasswords";
import UserModel from "../models/User";
import { Roles } from "../types/roles";
import { IResponse } from "../types/response";

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add regex over token to see if it is actially jwt
    // aDD ERROR HANDLING FOR INVALID JWTS
    // ADD RANDOM JWT FROM JWT.IO
    let token = req.headers.authorization as string;
    if (token === undefined) {
      return res.send("Token not found");
    }
    console.log(token);
    const isVerified = await jwt.verify(token, "JWT_SECRET");
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
  } catch (err) {
    console.log(err);
    return res.send(500);
  }
};

export const isPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Roles.PUBLISHER == (await req.body.authMiddleware.user.getRole())) {
    next();
  } else {
    let response: IResponse<String> = {
      message: "Unauthorized",
      status: false,
      data: "Unauthorized",
    };
    return res.status(401).send({});
  }
};

export const isConsumer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Roles.CONSUMER == (await req.body.authMiddleware.user.getRole())) {
    next();
  } else {
    let response: IResponse<String> = {
      message: "Unauthorized",
      status: false,
      data: "Unauthorized",
    };
    return res.status(401).send({});
  }
};
