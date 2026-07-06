import createHttpError from "http-errors";
import { StoryModel } from "../../models/story.js";

export const createStoryController = async (req, res, next) => {
try {
 const story = await StoryModel.create({
      ...req.body,
      ownerId: req.user.id,
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
  }


