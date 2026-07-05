backend/16-getStories
import { StoryModel } from "../models/index.js";
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
import { UserModel } from "../models/user.js";
import mongoose from "mongoose";

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
