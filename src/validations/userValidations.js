import { celebrate, Joi, Segments } from "celebrate";
import { objectIdValidator } from "./common.js";

const NAME_PATTERN =
  /^[A-Za-zА-Яа-яІіЇїЄєҐґ]+(?:[ '’-][A-Za-zА-Яа-яІіЇїЄєҐґ]+)*$/u;

const PASSWORD_WHITESPACE_PATTERN = /\s/;
const PASSWORD_SPECIAL_CHARACTER_PATTERN = /[\p{P}\p{S}]/u;

export const getCurrentUserStoriesValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
});

export const userIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
});

export const updateCurrentUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(2).max(32).pattern(NAME_PATTERN).messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 32 characters",
      "string.pattern.base":
        "Name can contain only English or Ukrainian letters, spaces, hyphens and apostrophes",
    }),

    email: Joi.string().trim().lowercase().email().max(64).messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "string.max": "Email must be at most 64 characters",
    }),

    avatarUrl: Joi.string().trim().uri().allow("").messages({
      "string.base": "Avatar URL must be a string",
      "string.uri": "Avatar URL must be a valid URL",
    }),
  })
    .min(1)
    .unknown(false)
    .messages({
      "object.min": "No valid fields provided",
    }),
});

export const verifyEmailChangeValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    token: Joi.string().required().messages({
      "string.base": "Token must be a string",
      "string.empty": "Token is required",
      "any.required": "Token is required",
    }),
  }),
});

export const changeCurrentUserPasswordValidation = celebrate(
  {
    [Segments.BODY]: Joi.object({
      currentPassword: Joi.string().required().messages({
        "string.base": "Current password must be a string",
        "string.empty": "Current password is required",
        "any.required": "Current password is required",
      }),

      newPassword: Joi.string()
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
          "string.base": "New password must be a string",
          "string.empty": "New password is required",
          "string.min": "New password must be at least 8 characters",
          "string.max": "New password must be at most 128 characters",
          "string.pattern.invert.name":
            "New password must not contain whitespace characters",
          "string.pattern.name":
            "New password must contain at least one special character",
          "any.required": "New password is required",
        }),

      confirmNewPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
          "any.only": "Passwords must match",
          "string.empty": "Password confirmation is required",
          "any.required": "Password confirmation is required",
        }),
    }).unknown(false),
  },
  {
    abortEarly: false,
  },
);