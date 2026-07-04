import { registerUser } from "./authService.js";

import { getStories } from "./storyService.js";

export const authService = {
  registerUser,
};

export const storyService = {
  getStories,
};
