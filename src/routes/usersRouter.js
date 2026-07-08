import { Router } from "express";

import { usersController as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { getCurrentUserStoriesValidation, userIdValidation } from "../validations/index.js";
import { getUserProfileController } from "../controllers/users/getUserProfileControllers.js";
import { getUsers } from "../controllers/users/getUsers.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, ctrl.getCurrentUser);

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

usersRouter.patch("/me/saved/:storyId", authenticate, ctrl.addSavedStory);

usersRouter.delete("/me/saved/:storyId", authenticate, ctrl.removeSavedStory);

usersRouter.get("/", getUsers);

usersRouter.get("/:id", userIdValidation, getUserProfileController);

export default usersRouter;
