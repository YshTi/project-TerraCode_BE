import { Router } from "express";
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
