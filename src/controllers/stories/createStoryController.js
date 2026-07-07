import createHttpError from "http-errors";
import { StoryModel } from "../../models/story.js";
import { CategoryModel } from "../../models/category.js";


export const createStoryController = async (req, res, next) => {
try {
const {title, article, category} = req.body;
const ownerId = req.user.id;

const existingCategory = await CategoryModel.findById(category);
if(!existingCategory) {
    throw createHttpError(400, "Category does not exist")
}

const existingStory = await StoryModel.findOne({
      ownerId,
      title,
      article,
    });

    if (existingStory) {
      throw createHttpError(409, "You have already created a story with this title and text"); 
    }

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


