import {
  addStoryToSaved,
  removeStoryFromSaved,
} from "../../services/userService.js";

export const addSavedStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const user = await addStoryToSaved({ userId, storyId });

    res.status(200).json({
      message: "Story added to saved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const user = await removeStoryFromSaved({ userId, storyId });

    res.status(200).json({
      message: "Story removed from saved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
