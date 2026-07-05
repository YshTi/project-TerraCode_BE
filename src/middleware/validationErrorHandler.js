import { isCelebrateError } from "celebrate";

export const validationErrorHandler = (err, req, res, next) => {
  if (!isCelebrateError(err)) {
    return next(err);
  }

  const validationErrors = {};

  for (const [, joiError] of err.details) {
    for (const detail of joiError.details) {
      const field = detail.path[0];

      if (!validationErrors[field]) {
        validationErrors[field] = [];
      }

      validationErrors[field].push(detail.message);
    }
  }

  return res.status(400).json({
    message: "Validation failed",
    errors: validationErrors,
  });
};
