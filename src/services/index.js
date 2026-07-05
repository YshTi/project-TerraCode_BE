import { registerUser } from "./authService.js";
import { getCurrentUserStories } from "./userService.js";

export const authService = {
  registerUser,
};

export const userService = {
  getCurrentUserStories,
};

