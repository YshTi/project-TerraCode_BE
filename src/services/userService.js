import createError from "http-errors";
import mongoose from "mongoose";
import { StoryModel, UserModel } from "../models/index.js";

export const getCurrentUserStories = async ({
  userId,
  page = 1,
  limit = 10,
}) => {
  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage;

  const filter = { ownerId: userId };

  const [stories, total] = await Promise.all([
    StoryModel.find(filter)
      .sort({ date: -1, _id: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("category")
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

export const getSavedStories = async ({ userId, page = 1, limit = 10 }) => {
  const currentPage = Number(page);
  const perPage = Number(limit);
  const skip = (currentPage - 1) * perPage;

  const user = await UserModel.findById(userId).select("savedArticles");

  if (!user) {
    throw createError(404, "User not found");
  }

  const filter = { _id: { $in: user.savedArticles } };

  const [stories, total] = await Promise.all([
    StoryModel.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("category")
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

export const addStoryToSaved = async ({ userId, storyId }) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw createError(400, "Invalid story id format");
  }

  const story = await StoryModel.findById(storyId);

  if (!story) {
    throw createError(404, "Story not found");
  }

  const updateResult = await UserModel.updateOne(
    {
      _id: userId,
      savedArticles: { $ne: story._id },
    },
    { $addToSet: { savedArticles: story._id } },
  );

  if (updateResult.matchedCount === 0) {
    const userExists = await UserModel.exists({ _id: userId });

    if (!userExists) {
      throw createError(404, "User not found");
    }
  }

  if (updateResult.modifiedCount > 0) {
    await StoryModel.findByIdAndUpdate(story._id, {
      $inc: { rate: 1 },
    });
  }

  const updatedUser = await UserModel.findById(userId).select("-password");

  return updatedUser;
};

export const removeStoryFromSaved = async ({ userId, storyId }) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw createError(400, "Invalid story id format");
  }

  const story = await StoryModel.findById(storyId);

  if (!story) {
    throw createError(404, "Story not found");
  }

  const updateResult = await UserModel.updateOne(
    {
      _id: userId,
      savedArticles: story._id,
    },
    { $pull: { savedArticles: story._id } },
  );

  if (updateResult.matchedCount === 0) {
    const userExists = await UserModel.exists({ _id: userId });

    if (!userExists) {
      throw createError(404, "User not found");
    }

    throw createError(404, "Story is not in saved stories");
  }

  if (updateResult.modifiedCount > 0) {
    await StoryModel.findByIdAndUpdate(story._id, {
      $inc: { rate: -1 },
    });
  }

  const updatedUser = await UserModel.findById(userId).select("-password");

  return updatedUser;
};
