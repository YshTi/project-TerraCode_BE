import { Router } from "express";
import { celebrate } from "celebrate";

import { storyIdSchema } from "../validations/index.js";
import { getStoryById } from "../controllers/stories/getStoryById.js";

const storiesRouter = Router();

storiesRouter.get("/:storyId", celebrate(storyIdSchema), getStoryById);

export default storiesRouter;
