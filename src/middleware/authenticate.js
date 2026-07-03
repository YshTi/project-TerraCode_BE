import jwt from "jsonwebtoken";
import createError from "http-errors";
import { UserModel } from "../models/index.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authorization header is required");
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userId = payload.id || payload._id;

    if (!userId) {
      throw createError(401, "Invalid token payload");
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      throw createError(401, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(createError(401, "Invalid or expired token"));
    }

    next(error);
  }
};