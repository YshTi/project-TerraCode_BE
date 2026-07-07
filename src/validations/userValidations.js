import { celebrate, Joi, Segments } from "celebrate";
import { objectIdValidator } from "./common.js";

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