import { Router } from "express";

import { authController as ctrl } from "../controllers/index.js";
import { registerUserValidation } from "../validations/index.js";

const authRouter = Router();

authRouter.post("/register", registerUserValidation, ctrl.registerUser);

export default authRouter;
