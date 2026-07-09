import multer from "multer";
import createHttpError from "http-errors";

const MAX_AVATAR_SIZE = 1024 * 1024; // 1MB

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        createHttpError(
          400,
          "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        ),
      );
    }

    cb(null, true);
  },
});

const handleMulterError = (error, next) => {
  if (!error) {
    return next();
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(
        createHttpError(400, "Avatar file size must be less than 1MB"),
      );
    }

    return next(createHttpError(400, error.message));
  }

  next(error);
};

export const upload = {
  single: (fieldName) => (req, res, next) => {
    const uploadSingleFile = multerUpload.single(fieldName);

    uploadSingleFile(req, res, (error) => {
      handleMulterError(error, next);
    });
  },
};
