import {
  registerUser,
  loginUser,
  createSessionToken,
  formatUser,
} from "./authService.js";
import {
  getCurrentUserStories,
  updateCurrentUser,
  verifyEmailChange,
} from "./userService.js";

export const authService = {
  registerUser,
  loginUser,
  createSessionToken,
  formatUser,
};

export const userService = {
  getCurrentUserStories,
  updateCurrentUser,
  verifyEmailChange,
};
