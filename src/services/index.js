import { registerUser, createSessionToken, formatUser } from "./authService.js";
import { registerUser, loginUser } from "./authService.js";
import { getCurrentUserStories } from "./userService.js";

export const authService = {
  registerUser,
  createSessionToken,
  formatUser,
  loginUser,
};

export const userService = {
  getCurrentUserStories,
};