import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";

export const getUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1) {
      throw createHttpError(400, "Page must be at least 1");
    }

    if (limit < 1) {
      throw createHttpError(400, "Limit must be at least 1");
    }

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