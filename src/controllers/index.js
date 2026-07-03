import { registerUser } from './auth/registerUser.js';

import { getCategories } from './categories/getCategories.js';

export const authController = {
  registerUser,
};

export const categoriesController = {
  getCategories,
};