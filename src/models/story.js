import { Schema, model } from "mongoose";

const storySchema = new Schema(
  {
    img: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    article: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    rate: {
      type: Number,
      default: 0,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StoryModel = model("story", storySchema);