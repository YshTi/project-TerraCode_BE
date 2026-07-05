import { registerUser } from "./auth/registerUser.js";
import { getCategories } from "./categories/getCategories.js";
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { addSavedStory, removeSavedStory } from "./users/savedStories.js";
import { getCurrentUser } from "./users/getCurrentUser.js";

export const authController = {
  registerUser,
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
