import { Router } from "express";
import { celebrate } from "celebrate";

import { getRecommendedStories } from "../controllers/stories/storyController.js";
import { recommendedStoriesQuerySchema } from "../validations/index.js";

import { storyIdSchema } from "../validations/index.js";
import { getStoryById } from "../controllers/stories/getStoryById.js";

import { usersController } from "../controllers/index.js";
import { createStoryValidation } from "../validations/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { getStories } from "../controllers/stories/getStories.js";
import { storiesQuerySchema } from "../validations/index.js";

const storiesRouter = Router();

storiesRouter.get(
  "/recommended",
  celebrate(recommendedStoriesQuerySchema),
  getRecommendedStories,
);

storiesRouter.get("/", celebrate(storiesQuerySchema), getStories);

storiesRouter.get("/:storyId", celebrate(storyIdSchema), getStoryById);

storiesRouter.post("/", authenticate, createStoryValidation, usersController.createStoryController);




export default storiesRouter;



