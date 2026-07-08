import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";
import { saveFileToCloudinary } from "../../utils/saveFilesToCloudinary.js";

export const updateAvatar = async (req, res) => {
  const { file, user } = req;
  if (!file) {
    throw createHttpError(400, "No file");
  }

  const result = await saveFileToCloudinary(file.buffer, user._id);

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { avatar: result.secure_url },
    { returnDocument: "after" },
  );

  res.status(200).json({ url: user.avatar });
};
