import { userService } from "../../services/index.js";

export const getSavedStoriesController = async (req, res, next) => {
  try {
    const result = await userService.getSavedStories({
      userId: req.user._id,
      page: req.query.page,
      limit: req.query.limit,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
