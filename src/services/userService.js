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
      .sort({ createdAt: -1 })
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
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

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { savedArticles: storyId } },
    { new: true },
  ).select("-password");

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
};

export const removeStoryFromSaved = async ({ userId, storyId }) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw createError(400, "Invalid story id format");
  }

  const story = await StoryModel.findById(storyId);

  if (!story) {
    throw createError(404, "Story not found");
  }

  const user = await UserModel.findById(userId).select("savedArticles");

  if (!user) {
    throw createError(404, "User not found");
  }

  const isSaved = user.savedArticles.some(
    (savedStoryId) => savedStoryId.toString() === storyId,
  );

  if (!isSaved) {
    throw createError(404, "Story is not in saved stories");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { savedArticles: storyId } },
    { new: true },
  ).select("-password");

  return updatedUser;
};
