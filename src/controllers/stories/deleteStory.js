import { deleteStory } from "../../services/storyService.js";

export const deleteStoryController = async (
  req,
  res,
  next,
) => {
  try {
    const result = await deleteStory({
      storyId: req.params.storyId,
      userId: req.user._id,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};