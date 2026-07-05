import {
  registerUser,
  loginUser,
  logoutUser,
  createSessionToken,
  formatUser,
} from "./authService.js";

import { getCurrentUserStories } from "./userService.js";
import { getStories } from "./storyService.js";

export const authService = {
  registerUser,
  loginUser,
  logoutUser,
  createSessionToken,
  formatUser,
};

export const userService = {
  getCurrentUserStories,
};
backend/16-getStories

export const storyService = {
  getStories,
};
