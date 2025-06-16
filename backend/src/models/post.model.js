import mongoose from "mongoose";

// Simplified Comment Schema
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Replies as simple array (2-level max)
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Simplified Post Schema
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    reposts: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          default: "",
          trim: true,
        },
        type: {
          type: String,
          enum: ["simple", "quote"],
          default: "simple",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Essential indexes only
postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1 });

// Simple virtuals
postSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

postSchema.virtual("commentCount").get(function () {
  if (!this.comments) return 0;
  return this.comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);
});

postSchema.virtual("repostCount").get(function () {
  return this.reposts?.length || 0;
});

// Enable virtuals in JSON
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
