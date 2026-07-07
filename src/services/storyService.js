import { UserModel } from "../models/user.js";
import { StoryModel } from "../models/index.js";
import mongoose, { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const getRecommendedStories = async ({
  category,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const categoryId = new mongoose.Types.ObjectId(category);

  const aggregationSteps = [
    // 1. Розгортєм масив збереженик історій користувача в окремі документи
    { $unwind: "$savedArticles" },

    // 2. Рахуємо, скільки разів кожна історія зустрічається
    {
      $group: {
        _id: "$savedArticles",
        savesCount: { $sum: 1 },
      },
    },

    //3. Підтягумо дані самої історїій
    {
      $lookup: {
        from: "stories",
        localField: "_id",
        foreignField: "_id",
        as: "story",
      },
    },
    { $unwind: "$story" },

    // 4. Фільтруємо за категорією
    {
      $match: {
        "story.category": categoryId,
      },
    },

    // 5. Сотруємо за популярністю (спадання)
    { $sort: { savesCount: -1 } },

    // 6. Пагінація
    { $skip: skip },
    { $limit: Number(limit) },

    // 7. Формуємо фінальний варіант відповіді
    {
      $project: {
        _id: "$story._id",
        img: "$story.img",
        title: "$story.title",
        article: "$story.article",
        category: "$story.category",
        rate: "$story.rate",
        date: "$story.date",
        savesCount: 1,
      },
    },
  ];

  const stories = await UserModel.aggregate(aggregationSteps);

  return stories;
};


// GET /api/stories
// Public endpoint: returns a paginated list of stories.
// Optional ?category=<categoryId> narrows the list down to one category.
// Optional ?type=popular sorts by rate instead of by date.
// Sorting always ends with _id as a tie-breaker so pagination stays stable
// even when several stories share the same `date`.
export const getStories = async ({ page = 1, limit = 10, category, type }) => {
  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage;

  const filter = {};

  if (category) {
    if (!isValidObjectId(category)) {
      throw createHttpError(404, "Category not found");
    }

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
