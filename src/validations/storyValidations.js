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

const MAX_IMAGE_SIZE = 1024 * 1024;

const imageSizeValidator = async (value, helpers) => {
  try {
    const response = await fetch(value, { method: "HEAD" });
    
    if (!response.ok) {
      return helpers.message("image.notFound");
    }

    const contentLength = response.headers.get("content-length");
    
    if (!contentLength) {
      return helpers.message("image.noSize");
    }

    if (Number(contentLength) > MAX_IMAGE_SIZE) {
      return helpers.message("any.custom");
    }
    return value; 
  } catch (error) {
    return helpers.message("image.notFound");
  }
};


export const createStoryValidation = celebrate(
  {
    [Segments.BODY]: Joi.object({
      img: Joi.string().trim().uri().custom(imageSizeValidator).required().messages({
        "string.base": "Image must be a string",
        "string.empty": "Image URL is required",
        "string.uri": "Image must be a valid URL",
        "any.custom": "Image size must be less than 1MB",
        "any.required": "Image is required",
        "image.notFound": "Image URL is not accessible or invalid",
        "image.noSize": "Unable to verify image size",
      }),

      title: Joi.string().trim().min(2).max(40).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title is required",
        "string.min": "Title must be at least 2 characters",
        "string.max": "Title must be at most 40 characters",
        "any.required": "Title is required",
      }),

      article: Joi.string().trim().min(12).max(3000).required().messages({
        "string.base": "Article must be a string",
        "string.empty": "Article is required",
        "string.min": "Article must be at least 12 characters",
        "string.max": "Article must be at most 3000 characters",
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
    // Note: category is intentionally NOT validated with objectIdValidator
    // here. An invalid/non-existent category id for this endpoint should
    // result in a 404 ("Category not found"), not a 400 validation error -
    // that check happens in storyService.getStories instead.
    category: Joi.string(),
    type: Joi.string().valid("popular"),
  }),
};
