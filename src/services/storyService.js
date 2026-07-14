import mongoose, { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import createError from "http-errors";

import {
  CategoryModel,
  StoryModel,
  UserModel,
} from "../models/index.js";

export const getRecommendedStories = async ({
  category,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const categoryId = new mongoose.Types.ObjectId(category);

  const aggregationSteps = [
    {
      $unwind: "$savedArticles",
    },
    {
      $group: {
        _id: "$savedArticles",
        savesCount: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "stories",
        localField: "_id",
        foreignField: "_id",
        as: "story",
      },
    },
    {
      $unwind: "$story",
    },
    {
      $match: {
        "story.category": categoryId,
      },
    },
    {
      $sort: {
        savesCount: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
    {
      $project: {
        _id: "$story._id",
        img: "$story.img",
        title: "$story.title",
        article: "$story.article",
        category: "$story.category",
        rate: "$story.rate",
        ownerId: "$story.ownerId",
        date: "$story.date",
        savesCount: 1,
      },
    },
  ];

  return UserModel.aggregate(aggregationSteps);
};

export const getStories = async ({
  page = 1,
  limit = 10,
  category,
  type,
}) => {
  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage;

  const filter = {};

  if (category) {
    if (!isValidObjectId(category)) {
      throw createHttpError(404, "Category not found");
    }

    const categoryExists = await CategoryModel.exists({
      _id: category,
    });

    if (!categoryExists) {
      throw createError(404, "Category not found");
    }

    filter.category = category;
  }

  const sort =
    type === "popular"
      ? {
          rate: -1,
          date: -1,
          _id: -1,
        }
      : {
          date: -1,
          _id: -1,
        };

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

export const updateStory = async ({
  storyId,
  userId,
  updates,
}) => {
  const story = await StoryModel.findById(storyId);

  if (!story) {
    throw createError(404, "Story not found");
  }

  const storyOwnerId = story.ownerId.toString();
  const authenticatedUserId = userId.toString();

  if (storyOwnerId !== authenticatedUserId) {
    throw createError(
      403,
      "You can update only your own stories",
    );
  }

  if (updates.category !== undefined) {
    if (!isValidObjectId(updates.category)) {
      throw createHttpError(400, "Invalid category id");
    }

    const categoryExists = await CategoryModel.exists({
      _id: updates.category,
    });

    if (!categoryExists) {
      throw createError(404, "Category not found");
    }
  }

  const allowedUpdates = {};

  if (updates.title !== undefined) {
    allowedUpdates.title = updates.title;
  }

  if (updates.article !== undefined) {
    allowedUpdates.article = updates.article;
  }

  if (updates.category !== undefined) {
    allowedUpdates.category = updates.category;
  }

  Object.assign(story, allowedUpdates);

  await story.save();

  await story.populate("category");
  await story.populate("ownerId", "name avatarUrl");

  return {
    status: 200,
    message: "Story updated successfully",
    data: story,
  };
};

export const deleteStory = async ({
  storyId,
  userId,
}) => {
  const story = await StoryModel.findById(storyId);

  if (!story) {
    throw createError(404, "Story not found");
  }

  const storyOwnerId = story.ownerId.toString();
  const authenticatedUserId = userId.toString();

  if (storyOwnerId !== authenticatedUserId) {
    throw createError(
      403,
      "You can delete only your own stories",
    );
  }

  await StoryModel.deleteOne({
    _id: storyId,
  });

  await UserModel.updateMany(
    {
      savedArticles: storyId,
    },
    {
      $pull: {
        savedArticles: storyId,
      },
    },
  );

  await UserModel.updateOne(
    {
      _id: userId,
      articlesAmount: {
        $gt: 0,
      },
    },
    {
      $inc: {
        articlesAmount: -1,
      },
    },
  );

  return {
    status: 200,
    message: "Story deleted successfully",
  };
};