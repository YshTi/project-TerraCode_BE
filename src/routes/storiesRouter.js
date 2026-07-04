import { Router } from "express";
import { storiesController as ctrl } from "../controllers/index.js";
import { getStoriesValidation } from "../validations/index.js";

const storiesRouter = Router();

storiesRouter.get("/", getStoriesValidation, ctrl.getStories);

export default storiesRouter;
