import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    articlesAmount: {
      type: Number,
      default: 0,
    },

    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],

    // Optional
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // Optional
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Unique email only for users that actually have email
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $type: "string" },
    },
  }
);

export const UserModel = model("user", userSchema);