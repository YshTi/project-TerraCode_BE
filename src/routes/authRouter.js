import { Router } from "express";
import { validationErrorHandler } from "../middleware/validationErrorHandler.js";
import { authController as ctrl } from "../controllers/index.js";
import {
  registerUserValidation,
  loginUserValidation,
} from "../validations/index.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerUserValidation,
  ctrl.registerUser,
  validationErrorHandler
);

authRouter.post(
  "/login",
  loginUserValidation,
  ctrl.loginUser,
  validationErrorHandler
);

authRouter.post("/logout", ctrl.logoutUser);

export default authRouter;
