import UserService from "../services/user.service.js";
import { ApiResponse } from "../utils/response.js";
import ErrorHandler from "../middlewares/error.middleware.js";

class UserController {
  static searchUsers = ErrorHandler.handleAsync(async (req, res) => {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json(ApiResponse.error("Search query is required", 400));
    }

    const users = await UserService.searchUsers(q, limit);

    res.json(ApiResponse.success(users, "Users found successfully"));
  });

  static getSuggestions = ErrorHandler.handleAsync(async (req, res) => {
    const { limit = 10 } = req.query;
    const userId = req.user._id;

    const users = await UserService.getSuggestions(userId, limit);

    res.json(ApiResponse.success(users, "User suggestions fetched successfully"));
  });

  static toggleFollow = ErrorHandler.handleAsync(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userId) {
      return res.status(400).json(ApiResponse.error("Cannot follow yourself", 400));
    }

    const result = await UserService.toggleFollow(currentUserId, userId);

    res.json(ApiResponse.success(result, result.message));
  });

  static getProfile = ErrorHandler.handleAsync(async (req, res) => {
    const { userId } = req.params;

    const user = await UserService.getProfile(userId);

    res.json(ApiResponse.success(user, "Profile fetched successfully"));
  });

  static updateProfile = ErrorHandler.handleAsync(async (req, res) => {
    const userId = req.user._id;
    const updateData = req.body;

    const user = await UserService.updateProfile(userId, updateData);

    res.json(ApiResponse.success(user, "Profile updated successfully"));
  });
}

export default UserController;
