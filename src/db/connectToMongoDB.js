import mongoose from "mongoose";
import { UserModel, CategoryModel, StoryModel } from "../models/index.js";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    await Promise.all([
      UserModel.syncIndexes(),
      CategoryModel.syncIndexes(),
      StoryModel.syncIndexes(),
    ]);
      
    console.log("Synced db indexes");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};