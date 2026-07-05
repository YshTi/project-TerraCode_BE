import { registerUser, createSessionToken, formatUser } from "./authService.js";
import { getCurrentUserStories } from "./userService.js";

export const authService = {
  registerUser,
  createSessionToken,
  formatUser,
};

export const userService = {
  getCurrentUserStories,
};