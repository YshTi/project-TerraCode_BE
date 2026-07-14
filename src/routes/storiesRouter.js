import { Router } from "express";
import { celebrate } from "celebrate";

import { getRecommendedStories } from "../controllers/stories/storyController.js";
import { recommendedStoriesQuerySchema } from "../validations/index.js";

import { storyIdSchema } from "../validations/index.js";
import { getStoryById } from "../controllers/stories/getStoryById.js";

import { usersController } from "../controllers/index.js";
import { createStoryValidation } from "../validations/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { uploadStoryImage, setStoryImageUrl } from "../middleware/uploadStoryImage.js";
import { deleteStoryImageOnError } from "../middleware/deleteStoryImageOnError.js";
import { getStories } from "../controllers/stories/getStories.js";
import { storiesQuerySchema } from "../validations/index.js";

import { updateStoryController } from "../controllers/stories/updateStory.js";
import { deleteStoryController } from "../controllers/stories/deleteStory.js";

import {
  storyIdParamsValidation,
  updateStoryValidation,
} from "../validations/manageStoryValidations.js";

const storiesRouter = Router();

const setStoryDate = (req, res, next) => {
  if (!req.body.date) {
    req.body.date = new Date().toISOString().slice(0, 10);
  }

  next();
};

storiesRouter.get(
  "/recommended",
  celebrate(recommendedStoriesQuerySchema),
  getRecommendedStories,
);

storiesRouter.get("/", celebrate(storiesQuerySchema), getStories);

storiesRouter.post(
  "/",
  authenticate,
  uploadStoryImage,
  setStoryImageUrl,
  setStoryDate,
  createStoryValidation,
  usersController.createStoryController,
  deleteStoryImageOnError,
);

storiesRouter.get("/:storyId", celebrate(storyIdSchema), getStoryById);

storiesRouter.patch(
  "/:storyId",
  authenticate,
  storyIdParamsValidation,
  updateStoryValidation,
  updateStoryController,
);

storiesRouter.delete(
  "/:storyId",
  authenticate,
  storyIdParamsValidation,
  deleteStoryController,
);

export default storiesRouter;