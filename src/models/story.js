import { Schema, model } from "mongoose";

const storySchema = new Schema({});

export const StoryModel = model("story", storySchema);