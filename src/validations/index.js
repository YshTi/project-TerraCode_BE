import { celebrate, Joi, Segments } from "celebrate";

export const registerUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().max(32).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.max": "Name must be at most 32 characters",
      "any.required": "Name is required",
    }),

    email: Joi.string().trim().lowercase().email().max(64).required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "string.max": "Email must be at most 64 characters",
      "any.required": "Email is required",
    }),

    password: Joi.string().min(8).max(128).required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 128 characters",
      "any.required": "Password is required",
    }),
  }).unknown(false),
});

export const getCurrentUserStoriesValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
});
