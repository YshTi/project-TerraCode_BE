import createHttpError from "http-errors";
import { StoryModel } from "../../models/story.js";

export const getStoryById = async (req, res) => {
  const { storyId } = req.params;
  const story = await StoryModel.findOne({ _id: storyId, ownerId: req.ownerId });

  if (!story) {
    throw createHttpError(404, "Story not found");
  }

  res.status(200).json(story);
};
