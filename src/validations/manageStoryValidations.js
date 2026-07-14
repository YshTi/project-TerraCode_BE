import {
  celebrate,
  Joi,
  Segments,
} from "celebrate";

import { objectIdValidator } from "./common.js";

export const storyIdParamsValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string()
      .custom(objectIdValidator)
      .required()
      .messages({
        "string.base": "Story id must be a string",
        "string.empty": "Story id is required",
        "any.required": "Story id is required",
        "any.invalid": "Story id is invalid",
      }),
  }),
});

export const updateStoryValidation = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string()
      .trim()
      .min(2)
      .max(40)
      .messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min":
          "Title must be at least 2 characters",
        "string.max":
          "Title must be at most 40 characters",
      }),

    article: Joi.string()
      .trim()
      .min(12)
      .max(3000)
      .messages({
        "string.base": "Article must be a string",
        "string.empty": "Article cannot be empty",
        "string.min":
          "Article must be at least 12 characters",
        "string.max":
          "Article must be at most 3000 characters",
      }),

    category: Joi.string()
      .custom(objectIdValidator)
      .messages({
        "string.base": "Category id must be a string",
        "string.empty": "Category id cannot be empty",
        "any.invalid": "Category id is invalid",
      }),
  })
    .min(1)
    .unknown(false)
    .messages({
      "object.min": "No valid fields provided",
      "object.unknown":
        "Unknown fields are not allowed",
    }),
});