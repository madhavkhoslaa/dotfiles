import { Request, Response, Router } from "express";
const loginRouter = Router();
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
import UserPasswordsModel from "../models/UserPasswords";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../middleware/Auth";
import { AuthService } from "../services/AuthService";

loginRouter.post("/signin", async (req: Request, res: Response) => {
  let response: IResponse<String>;
  try {
    let password = await AuthService.userLogIn(
      req.body.email,
      req.body.password
    );
    response = {
      status: true,
      message: "TOKEN_GENERATED",
      data: password,
    };
    res.send(response);
  } catch (ex) {
    response = {
      status: false,
      message: "TOKEN_NOT_GENERATED",
      data: null,
    };
    res.status(500).send(response);
  }
});

loginRouter.post("/logout", Auth, async (req, res, next) => {
  let response: IResponse<Boolean>;
  try {
    let password = await AuthService.logOut(req.body.email, req.body.password);
    response = {
      status: true,
      message: "USER_LOGGED_OUT",
      data: password,
    };
    res.send(response);
  } catch (ex) {
    response = {
      status: false,
      message: "USER_NOT_LOGGED_OUT",
      data: false,
    };
    res.status(500).send(response);
  }
});

export { loginRouter };
