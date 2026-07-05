import { registerUser, loginUser } from "./authService.js";
import { getCurrentUserStories } from "./userService.js";

export const authService = {
  registerUser,
  loginUser,
};

export const userService = {
  getCurrentUserStories,
};