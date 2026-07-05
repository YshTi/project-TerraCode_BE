import { authService } from "../../services/index.js";

export const logoutUser = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
