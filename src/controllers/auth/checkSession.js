import { authService } from "../../services/index.js";

export const checkSession = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Session is active",
      user: authService.formatUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};
