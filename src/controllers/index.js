import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { logoutUser } from "./auth/logoutUser.js";

import { getCategories } from "./categories/getCategories.js";

import { getCurrentUser } from "./users/getCurrentUser.js";
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { addSavedStory, removeSavedStory } from "./users/savedStories.js";

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUser,
  getCurrentUserStories,
  addSavedStory,
  removeSavedStory,
};
