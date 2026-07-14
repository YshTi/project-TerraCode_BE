import { updateStory } from "../../services/storyService.js";

export const updateStoryController = async (
  req,
  res,
  next,
) => {
  try {
    const result = await updateStory({
      storyId: req.params.storyId,
      userId: req.user._id,
      updates: req.body,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};