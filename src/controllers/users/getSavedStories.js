import { getSavedStories } from "../../services/userService.js";

export const getSavedStoriesController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, limit } = req.query;

    const result = await getSavedStories({ userId, page, limit });

    res.status(200).json({
      message: "Saved stories fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
