import jwt from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";

import { UserModel } from "../models/index.js";

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const authParts = authorization.split(" ");

  if (
    authParts.length !== 2 ||
    authParts[0] !== "Bearer" ||
    !authParts[1]
  ) {
    throw createError(401, "Not authorized");
  }

  const token = authParts[1];

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

  if (!user) {
    throw createError(401, "Not authorized");
  }

  req.user = user;

  next();
};
