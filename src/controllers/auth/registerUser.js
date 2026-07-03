import { authService } from "../../services/index.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
