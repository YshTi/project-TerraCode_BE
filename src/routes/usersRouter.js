import { Router } from "express";

import { usersController as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { getUserProfileController } from "../controllers/users/getUserProfileControllers.js";
import {
  getCurrentUserStoriesValidation,
  updateCurrentUserValidation,
  verifyEmailChangeValidation,
} from "../validations/index.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, ctrl.getCurrentUser);

usersRouter.patch(
  "/me",
  authenticate,
  updateCurrentUserValidation,
  ctrl.updateCurrentUser,
);

usersRouter.get(
  "/me/verify-email",
  verifyEmailChangeValidation,
  ctrl.verifyEmailChange,
);

usersRouter.get(
  "/me/stories",
  authenticate,
  getCurrentUserStoriesValidation,
  ctrl.getCurrentUserStories,
);

usersRouter.patch("/me/saved/:storyId", authenticate, ctrl.addSavedStory);

usersRouter.get(
  "/me/saved",
  authenticate,
  getCurrentUserStoriesValidation,
  ctrl.getSavedStoriesController,
);

usersRouter.patch("/me/saved/:storyId", authenticate, ctrl.addSavedStory);

usersRouter.delete("/me/saved/:storyId", authenticate, ctrl.removeSavedStory);

usersRouter.get("/:id", getUserProfileController);

export default usersRouter;
