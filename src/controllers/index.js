import { registerUser } from "./auth/registerUser.js";
import { getCategories } from "./categories/getCategories.js";
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { getCurrentUser } from "./users/getCurrentUser.js";
import { logoutUser } from "./auth/logoutUser.js";
export const authController = {
  registerUser,
  logoutUser,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUserStories,
  getCurrentUser,
};
