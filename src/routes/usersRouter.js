import { Router } from "express";
import { usersController as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { getCurrentUserStoriesValidation } from "../validations/index.js";

const usersRouter = Router();

usersRouter.get(
  "/me",
  authenticate,
  ctrl.getCurrentUser
);

usersRouter.get(
  "/me/stories",
  authenticate,
  getCurrentUserStoriesValidation,
  ctrl.getCurrentUserStories,
);

usersRouter.get(
  "/me/saved",
  authenticate,
  getCurrentUserStoriesValidation,
  ctrl.getSavedStoriesController,
);

export default usersRouter;
