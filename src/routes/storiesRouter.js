import { Router } from "express";
backend/16-getStories
import { storiesController as ctrl } from "../controllers/index.js";
import { getStoriesValidation } from "../validations/index.js";

const storiesRouter = Router();

storiesRouter.get("/", getStoriesValidation, ctrl.getStories);

=======
import { celebrate } from "celebrate";

import { getRecommendedStories } from "../controllers/stories/storyController.js";
import { recommendedStoriesQuerySchema } from "../validations/index.js";

import { storyIdSchema } from "../validations/index.js";
import { getStoryById } from "../controllers/stories/getStoryById.js";

const storiesRouter = Router();

storiesRouter.get(
  "/recommended",
  celebrate(recommendedStoriesQuerySchema),
  getRecommendedStories,
);

storiesRouter.get("/:storyId", celebrate(storyIdSchema), getStoryById);

export default storiesRouter;
