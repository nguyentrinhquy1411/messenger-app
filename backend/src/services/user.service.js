import User from "../models/user.model.js";

class UserService {
  // Static methods for user operations
  static async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  static async findByUsername(username) {
    return await User.findOne({ username: username.toLowerCase() });
  }

  static async searchUsers(query, limit = 10) {
    const searchRegex = new RegExp(query, "i");
    return await User.find({
      $or: [{ username: searchRegex }, { fullName: searchRegex }],
    })
      .select("username fullName avatar")
      .limit(limit);
  }

  static async getSuggestions(userId, limit = 10) {
    return await User.find({
      _id: { $ne: userId },
      followers: { $ne: userId },
    })
      .select("username fullName avatar followerCount")
      .sort({ followerCount: -1 })
      .limit(limit);
  }

  static async toggleFollow(currentUserId, targetUserId) {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      throw new Error("User not found");
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    return {
      isFollowing: !isFollowing,
      message: isFollowing ? "Unfollowed" : "Followed",
      followerCount: targetUser.followerCount,
    };
  }

  static async getProfile(userId) {
    const user = await User.findById(userId)
      .select("-password")
      .populate("following", "username fullName avatar")
      .populate("followers", "username fullName avatar");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async updateProfile(userId, updateData) {
    const allowedUpdates = ["fullName", "avatar", "bio"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

export default UserService;
