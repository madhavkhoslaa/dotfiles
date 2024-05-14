import { Router } from "express";
import UserModel, { User } from "../models/User";
import { IResponse } from "../types/response";
const userRouter = Router();

userRouter.post("/", async (req, res, next) => {
  try {
    console.log("Revieved Request for user creation", req.body);
    // Add validation and 400 Errors
    let userInitialization: User = req.body;
    let user = new UserModel(userInitialization);
    await user.save();
    let response: IResponse<User> = {
      status: true,
      message: "User Saved",
      data: userInitialization,
    };
    res.send(response).status(200);
  } catch (err) {
    console.log(err);
    let response: IResponse<String> = {
      status: false,
      message: "User Not Saved",
      data: "Internal Server Error",
    };
    res.send(response).status(500);
  } finally {
    next();
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    console.log("Revieved Request for user creation", req.body);
    // Add validation and 400 Errors
    let user = UserModel.findById(req.params.id);
    let response = {
      status: true,
      message: "User Saved",
      data: user,
    };
    res.send(response).status(200);
  } catch (err) {
    console.log(err);
    let response: IResponse<String> = {
      status: false,
      message: "User Not Valid",
      data: "Internal Server Error",
    };
    res.send(response).status(500);
  } finally {
    next();
  }
});

export { userRouter };
