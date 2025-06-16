import express from "express";
import PostController from "../controllers/post.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import ValidationMiddleware from "../middlewares/validation.middleware.js";

const router = express.Router();

// Get routes
router.get("/newsfeed", protectRoute, ValidationMiddleware.validatePagination, PostController.getNewsfeed);

router.get("/user-posts", protectRoute, ValidationMiddleware.validatePagination, PostController.getUserPosts);

// Post actions
router.post("/", protectRoute, ValidationMiddleware.validatePost, PostController.createPost);

router.post("/:postId/like", protectRoute, ValidationMiddleware.validateObjectId, PostController.toggleLike);

router.post(
  "/:postId/repost",
  protectRoute,
  ValidationMiddleware.validateObjectId,
  ValidationMiddleware.validateRepost,
  PostController.toggleRepost
);

// Comment actions
router.post(
  "/:postId/comment",
  protectRoute,
  ValidationMiddleware.validateObjectId,
  ValidationMiddleware.validateComment,
  PostController.addComment
);

router.post(
  "/:postId/comment/:commentId/reply",
  protectRoute,
  ValidationMiddleware.validateObjectId,
  ValidationMiddleware.validateComment,
  PostController.addReply
);

export default router;
