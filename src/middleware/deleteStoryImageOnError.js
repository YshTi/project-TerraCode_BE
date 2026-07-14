import { deleteImageFromCloudinary } from "../utils/uploadBufferToCloudinary.js";

export const deleteStoryImageOnError = async (
  error,
  req,
  res,
  next,
) => {
  if (!req.storyImagePublicId) {
    next(error);
    return;
  }

  try {
    await deleteImageFromCloudinary(
      req.storyImagePublicId,
    );
  } catch (cleanupError) {
    console.error(
      "Failed to delete orphaned Cloudinary image:",
      cleanupError,
    );
  }

  next(error);
};