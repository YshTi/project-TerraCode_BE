import { authService } from "../../services/index.js";

export const refreshUser = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        const accessToken = await authService.refreshUserToken(refreshToken);

        res.status(200).json({
            accessToken,
        });
    } catch (err) {
        next(err);
    }
};