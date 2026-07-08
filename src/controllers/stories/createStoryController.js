import createHttpError from "http-errors";
import { StoryModel } from "../../models/story.js";
import { CategoryModel } from "../../models/category.js";

const MAX_IMAGE_SIZE = 1024 * 1024;

const checkImageSize = async (imageUrl) => {
  const response = await fetch(imageUrl, { method: "HEAD" });

  if (!response.ok) {
    throw createHttpError(400, "Image URL is not accessible or invalid");
  }

  const contentLength = response.headers.get("content-length");

  if (!contentLength) {
    throw createHttpError(400, "Unable to verify image size");
  }

  if (Number(contentLength) > MAX_IMAGE_SIZE) {
    throw createHttpError(400, "Image size must be less than 1MB");
  }
};

export const createStoryController = async (req, res, next) => {
  try {
    const { img, title, article, category, date } = req.body;
    const ownerId = req.user.id;

    const existingCategory = await CategoryModel.findById(category);

    if (!existingCategory) {
      throw createHttpError(400, "Category does not exist");
    }

    const existingStory = await StoryModel.findOne({
      ownerId,
      title,
      article,
    });

    if (existingStory) {
      throw createHttpError(
        409,
        "You have already created a story with this title and text"
      );
    }

    await checkImageSize(img);

    const story = await StoryModel.create({
      img,
      title,
      article,
      category,
      date,
      ownerId,
    });

    if (!story) {
      throw createHttpError(400, "Failed to create story");
    }

    res.status(201).json({
      status: 201,
      message: "Story created successfully",
      data: story,
    });
  } catch (error) {
    next(error);
  }
};
