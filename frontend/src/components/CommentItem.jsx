import { useState } from "react";
import { Heart } from "lucide-react";
import { formatPostTime } from "../lib/utils";
import ReplyComment from "./ReplyComment";
import toast from "react-hot-toast";

const CommentItem = ({ comment, postId }) => {
  const [replyingToComment, setReplyingToComment] = useState(null);

  const handleLikeComment = (commentId) => {
    // TODO: Implement comment like functionality
    toast.info("Comment like feature coming soon!");
  };

  const handleReply = (comment) => {
    setReplyingToComment(comment._id);
    // Small delay to ensure the input is rendered before focusing
    setTimeout(() => {
      const replyInput = document.querySelector(`[data-reply-id="${comment._id}"] textarea`);
      if (replyInput) {
        replyInput.focus();
      }
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingToComment(null);
  };
  return (
    <div className="flex items-start space-x-3 mb-4">
      <img
        src={comment.user?.profilePic || "/avatar.png"}
        alt={comment.user?.fullName || "User"}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        {/* Comment Bubble - Facebook style */}
        <div className="bg-base-200 rounded-2xl px-3 py-2 inline-block max-w-full">
          <div className="flex items-center space-x-1 mb-1">
            <span className="font-semibold text-base-content text-sm">{comment.user?.fullName || "Anonymous"}</span>
          </div>
          <p className="text-base-content text-sm break-words">{comment.content}</p>
        </div>

        {/* Comment Meta & Actions - Below bubble like Facebook */}
        <div className="flex items-center space-x-4 mt-1 ml-3 text-xs text-base-content/60">
          <span className="hover:underline cursor-pointer">{formatPostTime(comment.createdAt)}</span>

          <button
            onClick={() => handleLikeComment(comment._id)}
            className={`font-semibold hover:underline transition-colors ${
              comment.isLiked ? "text-primary" : "hover:text-base-content"
            }`}
          >
            {comment.isLiked ? "Liked" : "Like"}
          </button>

          <button
            onClick={() => handleReply(comment)}
            className="font-semibold hover:underline hover:text-base-content transition-colors"
          >
            Reply
          </button>

          {/* Like count - Show if there are likes */}
          {comment.likes?.length > 0 && (
            <div className="flex items-center space-x-1">
              <Heart size={12} fill="currentColor" className="text-red-500" />
              <span>{comment.likes.length}</span>
            </div>
          )}
        </div>

        {/* Use ReplyComment component */}
        <ReplyComment
          comment={comment}
          postId={postId}
          onReply={handleReply}
          onCancelReply={handleCancelReply}
          isReplying={replyingToComment === comment._id}
          replyingTo={comment.user}
        />
      </div>
    </div>
  );
};

export default CommentItem;
