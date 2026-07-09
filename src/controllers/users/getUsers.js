import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";

const parsePositiveIntegerQuery = (value, defaultValue, fieldName, maxValue = null) => {
  if (value === undefined) {
    return defaultValue;
  }

  const number = Number(value);

  if (!Number.isInteger(number)) {
    throw createHttpError(400, `${fieldName} must be an integer`);
  }

  if (number < 1) {
    throw createHttpError(400, `${fieldName} must be at least 1`);
  }

  if (maxValue !== null && number > maxValue) {
    throw createHttpError(400, `${fieldName} must be at most ${maxValue}`);
  }

  return number;
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parsePositiveIntegerQuery(req.query.page, 1, "Page");
    const limit = parsePositiveIntegerQuery(req.query.limit, 10, "Limit", 100);

    const skip = (page - 1) * limit;
    const filter = { articlesAmount: { $gt: 0 } };

    const total = await UserModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw createHttpError(404, "Page not found");
    }

    const users = await UserModel.find(filter)
      .select("name avatarUrl articlesAmount")
      .skip(skip)
      .limit(limit)
      .sort({ articlesAmount: -1, name: 1 });

    res.status(200).json({
      status: 200,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};