import { authService } from "../../services/index.js";

export const loginUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken} = await authService.loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
    });

  } catch (error) {
    next(error);
  }
};