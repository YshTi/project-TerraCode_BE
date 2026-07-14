import createHttpError from "http-errors";

import { StoryModel } from "../../models/story.js";
import { CategoryModel } from "../../models/category.js";
import { validateImageUrl } from "../../utils/index.js";
import { deleteImageFromCloudinary } from "../../utils/uploadBufferToCloudinary.js";

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
        "You have already created a story with this title and text",
      );
    }

    await validateImageUrl(img, "Image");

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

    req.storyImagePublicId = null;

    res.status(201).json({
      status: 201,
      message: "Story created successfully",
      data: story,
    });
  } catch (error) {
    if (req.storyImagePublicId) {
      try {
        await deleteImageFromCloudinary(req.storyImagePublicId);
      } catch (cleanupError) {
        console.error(
          "Failed to delete Cloudinary image after story creation error:",
          cleanupError,
        );
      }
    }

    next(error);
  }
};