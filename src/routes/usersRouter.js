import { Router } from "express";

import { usersController as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { getUserProfileController } from "../controllers/users/getUserProfileControllers.js";
import { upload } from "../middleware/multer.js";
import {
  getCurrentUserStoriesValidation,
  updateCurrentUserValidation,
  verifyEmailChangeValidation,
  userIdValidation, 
  changeCurrentUserPasswordValidation,
} from "../validations/index.js";
import { getUsers } from "../controllers/users/getUsers.js";

const usersRouter = Router();

usersRouter.get("/me", authenticate, ctrl.getCurrentUser);

usersRouter.patch(
  "/me",
  authenticate,
  updateCurrentUserValidation,
  ctrl.updateCurrentUser,
);

usersRouter.patch(
  "/me/password",
  authenticate,
  changeCurrentUserPasswordValidation,
  ctrl.changeCurrentUserPassword,
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

usersRouter.get(
  "/me/saved",
  authenticate,
  getCurrentUserStoriesValidation,
  ctrl.getSavedStoriesController,
);

usersRouter.post(
  "/me/saved/:storyId",
  authenticate,
  ctrl.addSavedStory,
);

usersRouter.delete(
  "/me/saved/:storyId",
  authenticate,
  ctrl.removeSavedStory,
);

usersRouter.get("/", getUsers);

usersRouter.get("/:id", userIdValidation, getUserProfileController);

usersRouter.patch(
  "/me/updateAvatar",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar,
);

export default usersRouter;
