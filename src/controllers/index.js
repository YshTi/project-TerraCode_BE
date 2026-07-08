import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { logoutUser } from "./auth/logoutUser.js";
import { checkSession } from "./auth/checkSession.js";
import { refreshUser } from "./auth/refreshUser.js";

import { getCategories } from "./categories/getCategories.js";

import { getCurrentUser } from "./users/getCurrentUser.js";
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { getSavedStoriesController } from "./users/getSavedStories.js";
import { addSavedStory, removeSavedStory } from "./users/savedStories.js";
import { createStoryController } from "./stories/createStoryController.js";
import { getUserProfileController } from "./users/getUserProfileControllers.js";

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  checkSession,
  refreshUser,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUser,
  getCurrentUserStories,
  getSavedStoriesController,
  getUserProfileController,
  addSavedStory,
  removeSavedStory,
  createStoryController,
  };
