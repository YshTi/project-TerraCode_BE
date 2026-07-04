import { Router } from "express";

import { authController as ctrl } from "../controllers/index.js";
import {
  registerUserValidation,
  loginUserValidation,
} from "../validations/index.js";

const authRouter = Router();

authRouter.post("/register", registerUserValidation, ctrl.registerUser);
authRouter.post("/login", loginUserValidation, ctrl.loginUser);

export default authRouter;