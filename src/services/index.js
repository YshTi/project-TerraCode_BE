import {
  registerUser,
  loginUser,
  logoutUser,
  createSessionToken,
  formatUser,
  refreshUserToken,
} from "./authService.js";

import {
  getCurrentUserStories,
  getSavedStories,
  updateCurrentUser,
  verifyEmailChange,
  changeCurrentUserPassword,
} from "./userService.js";

export const authService = {
  registerUser,
  loginUser,
  logoutUser,
  createSessionToken,
  formatUser,
  refreshUserToken,
};

export const userService = {
  getCurrentUserStories,
  getSavedStories,
  updateCurrentUser,
  verifyEmailChange,
  changeCurrentUserPassword,
};