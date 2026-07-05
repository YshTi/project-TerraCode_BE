import { authService } from "../../services/index.js";

export const loginUser = async (req, res, next) => {
  try {
    const { accessToken } = await authService.loginUser(req.body);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};