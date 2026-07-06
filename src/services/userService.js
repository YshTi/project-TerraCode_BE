import jwt from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";

import { StoryModel, UserModel } from "../models/index.js";
import { sendEmailVerification } from "../utils/sendEmail.js";

const EMAIL_CHANGE_SECRET =
  process.env.EMAIL_CHANGE_SECRET || "dev-email-change-secret";

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
  const allowedFields = ["name", "avatarUrl"];
  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw createError(400, "No valid fields provided");
  }

  if (Object.prototype.hasOwnProperty.call(data, "email")) {
    const newEmail = String(data.email).trim().toLowerCase();

    if (!newEmail) {
      throw createError(400, "Email is required");
    }

    const existingUser = await UserModel.findOne({ email: newEmail });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw createError(409, "User with this email already exists");
    }

    const token = jwt.sign(
      { userId: user._id.toString(), newEmail },
      EMAIL_CHANGE_SECRET,
      { expiresIn: "1h" },
    );

    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email?token=${token}`;

    await sendEmailVerification({
      to: newEmail,
      verificationUrl,
    });

    return {
      requiresEmailVerification: true,
      message: "Verification email sent. Please confirm the new email address.",
      email: newEmail,
    };
  }

  const updatedUser = await UserModel.findByIdAndUpdate(user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw createError(404, "User not found");
  }

  return {
    message: "User updated successfully",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      articlesAmount: updatedUser.articlesAmount,
      savedArticles: updatedUser.savedArticles,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };
};

export const verifyEmailChange = async ({ token }) => {
  if (!token) {
    throw createError(400, "Verification token is required");
  }

  let payload;

  try {
    payload = jwt.verify(token, EMAIL_CHANGE_SECRET);
  } catch {
    throw createError(401, "Invalid or expired verification token");
  }

  const user = await UserModel.findById(payload.userId);

  if (!user) {
    throw createError(404, "User not found");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    payload.userId,
    { email: payload.newEmail },
    { new: true, runValidators: true },
  );

  return {
    message: "Email was updated successfully",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      articlesAmount: updatedUser.articlesAmount,
      savedArticles: updatedUser.savedArticles,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  };
};
