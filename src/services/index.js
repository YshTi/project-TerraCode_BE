import {
  registerUser,
  loginUser,
  createSessionToken,
  formatUser,
} from "./authService.js";

import { getCurrentUserStories } from "./userService.js";

export const authService = {
  registerUser,
  loginUser,
  createSessionToken,
  formatUser,
};

export const userService = {
  getCurrentUserStories,
};
