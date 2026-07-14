import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import createHttpError from "http-errors";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "uploads", "stories");

fs.mkdirSync(uploadDir, { recursive: true });

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      cb(createHttpError(400, "Image must be JPG, PNG or WEBP"));
      return;
    }

    cb(null, true);
  },
});

export const uploadStoryImage = (req, res, next) => {
  upload.single("img")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(createHttpError(400, "Image size must be less than 10MB"));
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

export const setStoryImageUrl = (req, res, next) => {
  if (req.file) {
    req.body.img = `${req.protocol}://${req.get("host")}/uploads/stories/${req.file.filename}`;
  }

  next();
};