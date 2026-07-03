import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model("category", categorySchema);