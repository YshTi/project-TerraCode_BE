import { Router } from "express";
import { validationErrorHandler } from "../middleware/validationErrorHandler.js";
import { authController as ctrl } from "../controllers/index.js";
import { registerUserValidation } from "../validations/index.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerUserValidation,
  ctrl.registerUser,
  validationErrorHandler,
);

export default authRouter;
