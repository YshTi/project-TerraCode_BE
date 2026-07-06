export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user.toObject();

    delete user.password;
    delete user.token;
    delete user.__v;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};