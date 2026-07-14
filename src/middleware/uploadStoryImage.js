import createHttpError from "http-errors";
import multer from "multer";

import { uploadBufferToCloudinary } from "../utils/uploadBufferToCloudinary.js";

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 1 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      cb(
        createHttpError(
          400,
          "Image must be JPG, PNG or WEBP",
        ),
      );
      return;
    }

    cb(null, true);
  },
});

export const uploadStoryImage = (
  req,
  res,
  next,
) => {
  upload.single("img")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(
          createHttpError(
            400,
            "Image size must be less than 1MB",
          ),
        );
        return;
      }

      next(createHttpError(400, error.message));
      return;
    }

    if (error) {
      next(error);
      return;
    }

    next();
  });
};

export const setStoryImageUrl = async (
  req,
  res,
  next,
) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      {
        folder: "terracode/stories",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
    );

    if (!result?.secure_url) {
      throw createHttpError(
        500,
        "Failed to upload story image",
      );
    }

    req.body.img = result.secure_url;
    req.storyImagePublicId = result.public_id;

    next();
  } catch (error) {
    next(
      createHttpError(
        500,
        error.message || "Failed to upload story image",
      ),
    );
  }
};