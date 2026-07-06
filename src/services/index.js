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
};
