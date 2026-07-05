export const logoutUser = (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
