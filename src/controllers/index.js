import { registerUser } from './auth/registerUser.js';
import { getCategories } from './categories/getCategories.js';
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";

export const authController = {
  registerUser,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUserStories,
};