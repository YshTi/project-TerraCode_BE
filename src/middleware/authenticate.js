import jwt from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";

import { UserModel } from "../models/index.js";

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const tokenFromHeader = authorization.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : "";
  const tokenFromCookie = req.cookies?.accessToken || "";
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    throw createError(401, "Not authorized");
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createError(401, "Not authorized");
  }

  if (!mongoose.isObjectIdOrHexString(payload.id)) {
    throw createError(401, "Not authorized");
  }

  const user = await UserModel.findById(payload.id);

  if (!user || user.token !== token) {
    throw createError(401, "Not authorized");
  }

  req.user = user;

  next();
};
