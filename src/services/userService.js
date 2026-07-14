import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";

import { StoryModel, UserModel } from "../models/index.js";
import { sendEmailVerification, validateImageUrl } from "../utils/index.js";

const SALT_ROUNDS = 10;

const EMAIL_CHANGE_SECRET =
  process.env.EMAIL_CHANGE_SECRET || "dev-email-change-secret";

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  articlesAmount: user.articlesAmount,
  savedArticles: user.savedArticles,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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

export const addStoryToSaved = async ({ userId, storyId }) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw createError(400, "Invalid storyId");
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
    throw createError(400, "Invalid storyId");
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

export const updateCurrentUser = async ({ user, data }) => {
  const allowedFields = ["name", "avatarUrl"];
  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(updates, "avatarUrl") &&
    updates.avatarUrl
  ) {
    await validateImageUrl(updates.avatarUrl, "Avatar image");
  }

  if (Object.prototype.hasOwnProperty.call(data, "email")) {
    const newEmail = String(data.email).trim().toLowerCase();

    if (!newEmail) {
      throw createError(400, "Email is required");
    }

    if (newEmail === user.email) {
      if (Object.keys(updates).length === 0) {
        throw createError(
          400,
          "New email must be different from current email",
        );
      }
    } else {
      const existingUser = await UserModel.findOne({ email: newEmail });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        throw createError(409, "User with this email already exists");
      }

      const token = jwt.sign(
        { userId: user._id.toString(), newEmail },
        EMAIL_CHANGE_SECRET,
        { expiresIn: "1h" },
      );

      const backendUrl =
        process.env.DEPLOYED_SERVER_URL || "http://localhost:3000";

      const verificationUrl = `${backendUrl.replace(
        /\/$/,
        "",
      )}/api/users/me/verify-email?token=${encodeURIComponent(token)}`;

      await sendEmailVerification({
        to: newEmail,
        verificationUrl,
      });

      return {
        requiresEmailVerification: true,
        message:
          "Verification email sent. Please confirm the new email address.",
        email: newEmail,
      };
    }
  }

  if (Object.keys(updates).length === 0) {
    throw createError(400, "No valid fields provided");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw createError(404, "User not found");
  }

  return {
    message: "User updated successfully",
    user: formatUserResponse(updatedUser),
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

  const existingUser = await UserModel.findOne({ email: payload.newEmail });

  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    throw createError(409, "User with this email already exists");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    payload.userId,
    { email: payload.newEmail },
    { new: true, runValidators: true },
  ).select("-password");

  return {
    message: "Email was updated successfully",
    user: formatUserResponse(updatedUser),
  };
};

export const changeCurrentUserPassword = async ({
  user,
  currentPassword,
  newPassword,
}) => {
  const currentUser = await UserModel.findById(user._id);

  if (!currentUser) {
    throw createError(404, "User not found");
  }

  if (!currentUser.password) {
    throw createError(400, "User does not have a password");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    currentUser.password,
  );

  if (!isCurrentPasswordValid) {
    throw createError(401, "Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await UserModel.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  return {
    message: "Password updated successfully",
  };
};