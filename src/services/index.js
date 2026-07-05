import { registerUser } from "./authService.js";
import { getCurrentUserStories } from "./userService.js";
import { getStories } from "./storyService.js";

export const authService = {
  registerUser,
};

export const userService = {
  getCurrentUserStories,
};

export const storyService = {
  getStories,
};
