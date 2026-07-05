import { getRecommendedStories as getRecommendedStoriesService } from "../../services/storyService.js";

export const getRecommendedStories = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  const stories = await getRecommendedStoriesService({
    category,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({
    page: Number(page),
    limit: Number(limit),
    count: stories.length,
    stories,
  }

  );
};
