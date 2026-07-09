import { authService } from "../../services/index.js";

export const logoutUser = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};