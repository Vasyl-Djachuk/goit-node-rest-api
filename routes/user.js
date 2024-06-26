import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  userRegisterSchema,
  subscriptionSchema,
} from "../schemas/userSchema.js";
import ctrl from "../controllers/userControllers.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const userRoter = express.Router();

userRoter.post(
  "/register",
  validateBody(userRegisterSchema),
  ctrl.userRegister
);
userRoter.post("/login", validateBody(userRegisterSchema), ctrl.userLogin);
export default userRoter;

userRoter.post("/logout", auth, ctrl.userLogout);
userRoter.get("/current", auth, ctrl.currentUser);
userRoter.patch(
  "/",
  auth,
  validateBody(subscriptionSchema),
  ctrl.updateSubscription
);
userRoter.patch("/avatars", auth, upload.single("avatar"), ctrl.uploadAvatars);
userRoter.get("/avatars", auth, ctrl.getAvatar);
