import { ApiResponse } from "../utils/response.js";
import mongoose from "mongoose";

class ValidationMiddleware {
  static validatePost(req, res, next) {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json(ApiResponse.error("Content is required", 400));
    }

    if (content.length > 2000) {
      return res.status(400).json(ApiResponse.error("Content must be less than 2000 characters", 400));
    }

    next();
  }

  static validateComment(req, res, next) {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json(ApiResponse.error("Comment content is required", 400));
    }

    if (content.length > 500) {
      return res.status(400).json(ApiResponse.error("Comment must be less than 500 characters", 400));
    }

    next();
  }
  static validateObjectId(req, res, next) {
    const { postId, commentId, userId } = req.params;

    const ids = { postId, commentId, userId };

    for (const [key, id] of Object.entries(ids)) {
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(ApiResponse.error(`Invalid ${key.replace("Id", "")} ID`, 400));
      }
    }

    next();
  }

  static validatePagination(req, res, next) {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1 || limit > 50) limit = 10;

    req.query.page = page;
    req.query.limit = limit;

    next();
  }

  static validateRepost(req, res, next) {
    const { content = "", type = "simple" } = req.body;

    if (type && !["simple", "quote"].includes(type)) {
      return res.status(400).json(ApiResponse.error("Invalid repost type. Must be 'simple' or 'quote'", 400));
    }

    if (type === "quote" && content && content.length > 280) {
      return res.status(400).json(ApiResponse.error("Quote repost content must be less than 280 characters", 400));
    }

    next();
  }
}

export default ValidationMiddleware;
