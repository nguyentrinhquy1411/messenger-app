import PostService from "../services/post.service.js";
import { ApiResponse } from "../utils/response.js";
import ErrorHandler from "../middlewares/error.middleware.js";

class PostController {
  static getNewsfeed = ErrorHandler.handleAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const result = await PostService.getNewsfeed(userId, page, limit);

    res.json(ApiResponse.paginated(result.posts, result.pagination, "Newsfeed fetched successfully"));
  });

  static getUserPosts = ErrorHandler.handleAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const result = await PostService.getUserPosts(userId, page, limit);

    res.json(ApiResponse.paginated(result.posts, result.pagination, "User posts fetched successfully"));
  });

  static createPost = ErrorHandler.handleAsync(async (req, res) => {
    const { content, image } = req.body;
    const userId = req.user._id;

    const post = await PostService.createPost(userId, content, image);

    res.status(201).json(ApiResponse.success(post, "Post created successfully", 201));
  });

  static toggleLike = ErrorHandler.handleAsync(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    const result = await PostService.toggleLike(postId, userId);

    res.json(ApiResponse.success(result, result.message));
  });

  static addComment = ErrorHandler.handleAsync(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await PostService.addComment(postId, userId, content);

    res.status(201).json(ApiResponse.success(comment, "Comment added successfully", 201));
  });

  static addReply = ErrorHandler.handleAsync(async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const reply = await PostService.addReply(postId, commentId, userId, content);

    res.status(201).json(ApiResponse.success(reply, "Reply added successfully", 201));
  });
  static toggleRepost = ErrorHandler.handleAsync(async (req, res) => {
    const { postId } = req.params;
    const { content = "", type = "simple" } = req.body;
    const userId = req.user._id;

    const result = await PostService.toggleRepost(postId, userId, content, type);

    res.json(ApiResponse.success(result, result.message));
  });
}

export default PostController;
