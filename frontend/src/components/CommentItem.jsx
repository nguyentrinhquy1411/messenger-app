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
  };

  const handleCancelReply = () => {
    setReplyingToComment(null);
  };

  return (
    <div className="flex items-start space-x-3">
      <img
        src={comment.user?.profilePic || "/avatar.png"}
        alt={comment.user?.fullName || "User"}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="bg-base-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-base-content text-sm">{comment.user?.fullName || "Anonymous"}</span>
            <span className="text-base-content/60 text-xs">@{comment.user?.username || "user"}</span>
            <span className="text-base-content/40 text-xs">• {formatPostTime(comment.createdAt)}</span>
          </div>
          <p className="text-base-content text-sm">{comment.content}</p>
        </div>
        {/* Comment Actions */}
        <div className="flex items-center mt-2 ml-3 space-x-4 mb-3">
          <button
            onClick={() => handleLikeComment(comment._id)}
            className={`flex items-center space-x-1 text-xs transition-colors px-2 py-1 rounded-full hover:bg-base-300 ${
              comment.isLiked ? "text-red-500" : "text-base-content/60"
            }`}
          >
            <Heart size={14} fill={comment.isLiked ? "currentColor" : "none"} />
            <span>{comment.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => handleReply(comment)}
            className="text-xs text-base-content/60 hover:text-base-content transition-colors px-2 py-1 rounded-full hover:bg-base-300"
          >
            Reply
          </button>
        </div>{" "}
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
