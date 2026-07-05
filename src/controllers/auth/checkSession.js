import { authService } from "../../services/index.js";

export const checkSession = async (req, res, next) => {
  try {
    const user = req.user;
    const accessToken = authService.createSessionToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Session is active",
      user: authService.formatUser(user),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
