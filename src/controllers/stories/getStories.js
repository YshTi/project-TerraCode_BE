import { getStories as getStoriesService } from "../../services/storyService.js";

export const getStories = async (req, res, next) => {
  try {
    const result = await getStoriesService({
      page: req.query.page,
      limit: req.query.limit,
      category: req.query.category,
      type: req.query.type,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};