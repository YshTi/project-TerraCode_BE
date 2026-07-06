import { CategoryModel } from "../../models/index.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ category: 1 });

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};