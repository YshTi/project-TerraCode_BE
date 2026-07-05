import { registerUser } from './auth/registerUser.js';
import { getCategories } from './categories/getCategories.js';
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { getCurrentUser } from "./users/getCurrentUser.js";
import { getStories } from "./stories/getStories.js";

export const authController = {
  registerUser,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUserStories,
  getCurrentUser,
};

export const storiesController = {
  getStories,
};
