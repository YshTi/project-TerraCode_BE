import { Router } from "express";

import { authController as ctrl } from "../controllers/index.js";
import { registerUserValidation } from "../validations/index.js";

const authRouter = Router();

authRouter.post("/register", registerUserValidation, ctrl.registerUser);
authRouter.post("/logout", ctrl.logoutUser);
export default authRouter;
