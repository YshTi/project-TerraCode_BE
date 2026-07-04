import { registerUser } from './auth/registerUser.js';

import { getCategories } from './categories/getCategories.js';

import { getStories } from './stories/getStories.js';

export const authController = {
  registerUser,
};

export const categoriesController = {
  getCategories,
};

export const storiesController = {
  getStories,
};
