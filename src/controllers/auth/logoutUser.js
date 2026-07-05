export const logoutUser = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
