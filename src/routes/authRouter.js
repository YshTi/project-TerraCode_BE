import { Router } from "express";
import { validationErrorHandler } from "../middleware/validationErrorHandler.js";
import { authController as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { registerUserValidation } from "../validations/index.js";

const authRouter = Router();

authRouter.post("/register", registerUserValidation, ctrl.registerUser);
authRouter.get("/session", authenticate, ctrl.checkSession);
import {
  registerUserValidation,
  loginUserValidation,
} from "../validations/index.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerUserValidation,
  ctrl.registerUser,
  validationErrorHandler,
);

authRouter.post(
  "/login",
  loginUserValidation,
  ctrl.loginUser,
  validationErrorHandler,
);

export default authRouter;
