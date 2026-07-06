import { isValidObjectId } from "mongoose";

// Валідація для objectId

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message("Invalid id format") : value;
};