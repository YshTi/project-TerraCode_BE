import bcrypt from "bcrypt";
import createError from "http-errors";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/index.js";

const SALT_ROUNDS = 10;

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
