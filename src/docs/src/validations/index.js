import { celebrate, Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

const NAME_PATTERN =
  /^[A-Za-zА-Яа-яІіЇїЄєҐґ]+(?:[ '’-][A-Za-zА-Яа-яІіЇїЄєҐґ]+)*$/u;

const PASSWORD_WHITESPACE_PATTERN = /\s/;
const PASSWORD_SPECIAL_CHARACTER_PATTERN = /[\p{P}\p{S}]/u;

export const registerUserValidation = celebrate(
  {
    [Segments.BODY]: Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(32)
        .pattern(NAME_PATTERN)
        .required()
        .messages({
          "string.base": "Name must be a string",
          "string.empty": "Name is required",
          "string.min": "Name must be at least 2 characters long",
          "string.max": "Name must be at most 32 characters long",
          "string.pattern.base":
            "Name can contain only English or Ukrainian letters, spaces, hyphens and apostrophes",
          "any.required": "Name is required",
        }),

      email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(64)
        .required()
        .messages({
          "string.base": "Email must be a string",
          "string.empty": "Email is required",
          "string.email": "Email must be a valid email",
          "string.max": "Email must be at most 64 characters long",
          "any.required": "Email is required",
        }),

      password: Joi.string()
        .min(8)
        .max(128)
        .pattern(PASSWORD_WHITESPACE_PATTERN, {
          invert: true,
          name: "whitespace",
        })
        .pattern(PASSWORD_SPECIAL_CHARACTER_PATTERN, {
          name: "specialCharacter",
        })
        .required()
        .messages({
          "string.base": "Password must be a string",
          "string.empty": "Password is required",
          "string.min": "Password must be at least 8 characters long",
          "string.max": "Password must be at most 128 characters long",
          "string.pattern.invert.name":
            "Password must not contain whitespace characters",
          "string.pattern.name":
            "Password must contain at least one special character",
          "any.required": "Password is required",
        }),
    }).unknown(false),
  },
  {
    abortEarly: false,
  },
);

// Валідація для objectId

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const storyIdSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const loginUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
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


export const recommendedStoriesQuerySchema = {
  [Segments.QUERY]: Joi.object({
    category: Joi.string().custom(objectIdValidator).required(), 
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
};

export const storiesQuerySchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string().custom(objectIdValidator),
    type: Joi.string().valid("popular"),
  }),
};
