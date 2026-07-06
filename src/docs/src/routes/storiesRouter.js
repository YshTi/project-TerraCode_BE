import { Router } from "express";
import { celebrate } from "celebrate";

import { getStories } from "../controllers/stories/getStories.js";
import { storiesQuerySchema } from "../validations/index.js";

import { getRecommendedStories } from "../controllers/stories/storyController.js";
import { recommendedStoriesQuerySchema } from "../validations/index.js";

import { storyIdSchema } from "../validations/index.js";
import { getStoryById } from "../controllers/stories/getStoryById.js";

const storiesRouter = Router();

storiesRouter.get("/", celebrate(storiesQuerySchema), getStories);

storiesRouter.get(
  "/recommended",
  celebrate(recommendedStoriesQuerySchema),
  getRecommendedStories,
);

storiesRouter.get("/:storyId", celebrate(storyIdSchema), getStoryById);

export default storiesRouter;
