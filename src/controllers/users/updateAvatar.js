import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";
import { saveFileToCloudinary } from "../../utils/saveFilesToCloudinary.js";

export const updateAvatar = async (req, res, next) => {
  try {
    const { file, user } = req;

    if (!file) {
      throw createHttpError(400, "Avatar file is required");
    }

    const result = await saveFileToCloudinary(file.buffer, user._id);

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { avatarUrl: result.secure_url },
      { new: true },
    );

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      message: "Avatar updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        articlesAmount: updatedUser.articlesAmount,
        savedArticles: updatedUser.savedArticles,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
