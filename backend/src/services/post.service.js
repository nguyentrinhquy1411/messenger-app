import Post from "../models/post.model.js";
import User from "../models/user.model.js";

class PostService {
  // Static methods for common operations
  static async getNewsfeed(userId, page = 1, limit = 10) {
    const user = await User.findById(userId).select("following");
    const userIds = [userId, ...(user.following || [])];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user", "username fullName avatar")
      .populate("comments.user", "username fullName avatar")
      .populate("comments.replies.user", "username fullName avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Add isLiked and isReposted flags for current user
    const postsWithUserData = posts.map((post) => {
      const postObj = post.toObject();
      postObj.isLiked = post.likes.some((likeId) => likeId.toString() === userId.toString());
      postObj.isReposted = post.reposts.some((repost) => repost.user.toString() === userId.toString());
      return postObj;
    });

    const total = await Post.countDocuments({ user: { $in: userIds } });

    return {
      posts: postsWithUserData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
  static async getUserPosts(userId, page = 1, limit = 10) {
    const posts = await Post.find({ user: userId })
      .populate("user", "username fullName avatar")
      .populate("comments.user", "username fullName avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Add isLiked and isReposted flags for current user
    const postsWithUserData = posts.map((post) => {
      const postObj = post.toObject();
      postObj.isLiked = post.likes.some((likeId) => likeId.toString() === userId.toString());
      postObj.isReposted = post.reposts.some((repost) => repost.user.toString() === userId.toString());
      return postObj;
    });

    const total = await Post.countDocuments({ user: userId });

    return {
      posts: postsWithUserData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async createPost(userId, content, image = null) {
    if (!content?.trim()) {
      throw new Error("Content is required");
    }

    const post = new Post({
      user: userId,
      content: content.trim(),
      image,
    });

    await post.save();
    await post.populate("user", "username fullName avatar");

    return post;
  }

  static async toggleLike(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return {
      isLiked: !isLiked,
      likeCount: post.likeCount,
      message: isLiked ? "Post unliked" : "Post liked",
    };
  }

  static async addComment(postId, userId, content) {
    if (!content?.trim()) {
      throw new Error("Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    post.comments.push({
      user: userId,
      content: content.trim(),
    });

    await post.save();
    await post.populate("comments.user", "username fullName avatar");

    return post.comments[post.comments.length - 1];
  }

  static async addReply(postId, commentId, userId, content) {
    if (!content?.trim()) {
      throw new Error("Reply content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    comment.replies.push({
      user: userId,
      content: content.trim(),
    });

    await post.save();
    await post.populate("comments.replies.user", "username fullName avatar");

    return comment.replies[comment.replies.length - 1];
  }
  static async toggleRepost(postId, userId, content = "", type = "simple") {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingRepost = post.reposts.find((repost) => repost.user.toString() === userId.toString());

    if (existingRepost) {
      // Remove existing repost
      post.reposts = post.reposts.filter((repost) => repost.user.toString() !== userId.toString());
    } else {
      // Add new repost
      post.reposts.push({
        user: userId,
        content: content.trim(),
        type: type,
      });
    }

    await post.save();

    return {
      isReposted: !existingRepost,
      repostCount: post.repostCount,
      message: existingRepost ? "Post unreposted" : "Post reposted",
    };
  }
}

export default PostService;
