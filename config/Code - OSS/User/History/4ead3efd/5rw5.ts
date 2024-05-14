import { Router } from "express";
const ermRouter = Router();
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
import UserPasswordsModel from "../models/UserPasswords";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth, isConsumer } from "../middleware/Auth";

ermRouter.get("/", Auth, isConsumer, async (req, res, next) => {});

export { ermRouter };
