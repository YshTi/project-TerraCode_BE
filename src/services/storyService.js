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
