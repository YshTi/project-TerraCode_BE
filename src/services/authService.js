import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";

import { UserModel } from "../models/index.js";

const SALT_ROUNDS = 10;

export const createAccessToken = (user) => {
  return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
  );
};

export const createSessionToken = (user) => {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  articlesAmount: user.articlesAmount,
  savedArticles: user.savedArticles,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await UserModel.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await UserModel.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  return formatUser(user);
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  const user = await UserModel.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw createError(401, "Email or password is invalid");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createError(401, "Email or password is invalid");
  }

  const accessToken = createAccessToken(user);

  const refreshToken = createRefreshToken(user);

  user.token = accessToken;
  user.refreshToken = refreshToken;
  user.refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (refreshToken) => {

  if (!refreshToken) {
    throw createError(401, "Refresh token is missing");
  }

  let payload;

  try {

    payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

  } catch {

    throw createError(401, "Refresh token expired");
  }

  const user = await UserModel.findById(payload.id);

  if (!user) {
    throw createError(401);
  }

  if (user.refreshToken !== refreshToken) {
    throw createError(401, "Invalid refresh token");
  }

  if (user.refreshTokenExpiresAt < new Date()) {
    throw createError(401, "Refresh token expired");
  }

  const newAccessToken = createAccessToken(user);

  user.token = newAccessToken;

  await user.save();

  return newAccessToken;
};

export const logoutUser = async (userId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw createError(401, "Not authorized");
  }

  user.token = null;
  user.refreshToken = null;
  user.refreshTokenExpiresAt = null;
  await user.save();
};
