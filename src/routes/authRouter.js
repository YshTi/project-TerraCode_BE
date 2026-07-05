import { Router } from "express";

import { authController as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { registerUserValidation } from "../validations/index.js";

const authRouter = Router();

authRouter.post("/register", registerUserValidation, ctrl.registerUser);
authRouter.get("/session", authenticate, ctrl.checkSession);

export default authRouter;
