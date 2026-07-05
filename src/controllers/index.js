import { registerUser } from './auth/registerUser.js';
import { checkSession } from './auth/checkSession.js';
import { getCategories } from './categories/getCategories.js';
import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { getCategories } from "./categories/getCategories.js";
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { addSavedStory, removeSavedStory } from "./users/savedStories.js";
import { getCurrentUser } from "./users/getCurrentUser.js";

export const authController = {
  registerUser,
  checkSession,
  loginUser,
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
