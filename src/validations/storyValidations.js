import { celebrate, Joi, Segments } from "celebrate";
import { objectIdValidator } from "./common.js";

export const storyIdSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const recommendedStoriesQuerySchema = {
  [Segments.QUERY]: Joi.object({
    category: Joi.string().custom(objectIdValidator).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
};

export const createStoryValidation = celebrate(
  {
    [Segments.BODY]: Joi.object({
      img: Joi.string().trim().uri().required().messages({
        "string.base": "Image must be a string",
        "string.empty": "Image URL is required",
        "string.uri": "Image must be a valid URL",
        "any.required": "Image is required",
      }),

      title: Joi.string().trim().min(3).max(120).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters",
        "string.max": "Title must be at most 120 characters",
        "any.required": "Title is required",
      }),

      article: Joi.string().trim().min(10).required().messages({
        "string.base": "Article must be a string",
        "string.empty": "Article is required",
        "string.min": "Article must be at least 10 characters",
        "any.required": "Article is required",
      }),

      category: Joi.string().custom(objectIdValidator).required().messages({
        "string.base": "Category must be a string",
        "string.empty": "Category ID is required",
        "any.required": "Category ID is required",
      }),

      date: Joi.string()
        .trim()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
          "string.base": "Date must be a string",
          "string.empty": "Date is required",
          "string.pattern.base": "Date must be in YYYY-MM-DD format",
          "any.required": "Date is required",
        }),
    }).unknown(false),
  },
  {
    abortEarly: false,
  },
);

export const storiesQuerySchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string().custom(objectIdValidator),
    type: Joi.string().valid("popular"),
  }),
};
