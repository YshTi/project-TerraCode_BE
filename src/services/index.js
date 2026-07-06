import {
  registerUser,
  loginUser,
  logoutUser,
  createSessionToken,
  formatUser,
} from "./authService.js";

import {
  getCurrentUserStories,
  getSavedStories,
  updateCurrentUser,
  verifyEmailChange,
} from "./userService.js";

export const authService = {
  registerUser,
  loginUser,
  logoutUser,
  createSessionToken,
  formatUser,
};

export const userService = {
  getCurrentUserStories,
  getSavedStories,
  updateCurrentUser,
  verifyEmailChange,
};
