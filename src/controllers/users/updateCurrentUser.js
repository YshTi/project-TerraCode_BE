import { userService } from "../../services/index.js";

export const updateCurrentUser = async (req, res, next) => {
  try {
    const result = await userService.updateCurrentUser({
      user: req.user,
      data: req.body,
    });

    res.status(result.requiresEmailVerification ? 202 : 200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailChange = async (req, res, next) => {
  try {
    const result = await userService.verifyEmailChange({
      token: req.query.token || req.body?.token,
    });

    res.status(200).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const changeCurrentUserPassword = async (req, res, next) => {
  try {
    const result = await userService.changeCurrentUserPassword({
      user: req.user,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
