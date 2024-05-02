import express from "express";
import validateBody from "../helpers/validateBody.js";
import { userRegisterSchema } from "../schemas/userSchema.js";
import * as ctrl from "../controllers/userControllers.js";

const userRoter = express.Router();

userRoter.post(
  "/register",
  validateBody(userRegisterSchema),
  ctrl.userRegister
);

export default userRoter;
