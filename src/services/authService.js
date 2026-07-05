import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";

import { UserModel } from "../models/index.js";

const SALT_ROUNDS = 10;

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

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    articlesAmount: user.articlesAmount,
    savedArticles: user.savedArticles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
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

  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  user.token = accessToken;
  await user.save();

  return {
    accessToken,
  };
};

export const logoutUser = async (userId) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw createError(401, "Not authorized");
  }

  user.token = null;
  await user.save();
};
