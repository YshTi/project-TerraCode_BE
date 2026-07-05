import { registerUser, loginUser, logoutUser } from "./authService.js";
import { getCurrentUserStories } from "./userService.js";

export const authService = {
  registerUser,
  loginUser,
  logoutUser,
};

export const userService = {
  getCurrentUserStories,
};
