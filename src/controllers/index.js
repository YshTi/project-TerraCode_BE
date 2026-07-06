import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { checkSession } from "./auth/checkSession.js";
import { getCategories } from "./categories/getCategories.js";
import { getCurrentUserStories } from "./users/getCurrentUserStories.js";
import { addSavedStory, removeSavedStory } from "./users/savedStories.js";
import { getCurrentUser } from "./users/getCurrentUser.js";
import { updateCurrentUser, verifyEmailChange } from "./users/updateCurrentUser.js";

export const authController = {
  registerUser,
  loginUser,
  checkSession,
};

export const categoriesController = {
  getCategories,
};

export const usersController = {
  getCurrentUser,
  getCurrentUserStories,
  addSavedStory,
  removeSavedStory,
  updateCurrentUser,
  verifyEmailChange,
};
