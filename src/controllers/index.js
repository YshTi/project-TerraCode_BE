import { registerUser } from './auth/registerUser.js';
import { checkSession } from './auth/checkSession.js';
import { getCategories } from './categories/getCategories.js';
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { getCurrentUser } from "./users/getCurrentUser.js";
export const authController = {
  registerUser,
  checkSession,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUserStories,
  getCurrentUser,
};