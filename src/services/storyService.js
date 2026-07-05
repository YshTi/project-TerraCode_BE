import { StoryModel } from "../models/index.js";

// GET /api/stories
// Public endpoint: returns a paginated list of stories.
// Optional ?category=<categoryId> narrows the list down to one category
// (used by the "Всі статті / Маршрути / Природа / ..." tabs on the frontend).
// Optional ?type=popular sorts stories by rate instead of by date.
//
// Sorting always ends with _id as a tie-breaker: `date` alone is not
// guaranteed to be unique across stories, and Mongo's default order for
// ties is unstable between separate find() calls. Without the tie-breaker,
// the same story could show up on two different pages.
export const getStories = async ({ page = 1, limit = 10, category, type }) => {
  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  const sort =
    type === "popular"
      ? { rate: -1, date: -1, _id: -1 }
      : { date: -1, _id: -1 };

  const [stories, total] = await Promise.all([
    StoryModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .populate("category")
      .populate("ownerId", "name avatarUrl")
      .lean(),

    StoryModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    stories,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};
