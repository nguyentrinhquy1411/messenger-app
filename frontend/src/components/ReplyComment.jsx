import { useState, useEffect } from "react";
import { X, Heart, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { formatPostTime } from "../lib/utils";
import toast from "react-hot-toast";

const ReplyComment = ({ comment, postId, onReply, onCancelReply, isReplying = false, replyingTo = null }) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyingToReply, setReplyingToReply] = useState(null);
  const [showReplyInputForReply, setShowReplyInputForReply] = useState(null);
  const { authUser } = useAuthStore();
  const { addReply } = usePostStore();

  // Set initial reply text with tag when replying
  useEffect(() => {
    if (isReplying && replyingTo) {
      setReplyText(`@${replyingTo.username} `);
    } else if (!isReplying) {
      setReplyText("");
      setReplyingToReply(null);
      setShowReplyInputForReply(null);
    }
  }, [isReplying, replyingTo]);
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      await addReply(postId, comment._id, replyText.trim());
      setReplyText("");
      setReplyingToReply(null);
      setShowReplyInputForReply(null);
      onCancelReply();
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLikeReply = (replyId) => {
    // TODO: Implement reply like functionality
    toast.info("Reply like feature coming soon!");
  };
  const handleReplyToReply = (reply) => {
    setReplyingToReply(reply);
    setShowReplyInputForReply(reply._id);
    setReplyText(`@${reply.user?.username} `);
  };

  const handleCancelReplyToReply = () => {
    setReplyingToReply(null);
    setShowReplyInputForReply(null);
    setReplyText(replyingTo ? `@${replyingTo.username} ` : "");
  };

  const handleSubmitReplyToReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      await addReply(postId, comment._id, replyText.trim());
      setReplyText("");
      setReplyingToReply(null);
      setShowReplyInputForReply(null);
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Helper function to render text with user tags
  const renderTextWithTags = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="text-primary font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {/* Display replies if they exist */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="flex items-start space-x-2">
              <img
                src={reply.user?.profilePic || "/avatar.png"}
                alt={reply.user?.fullName || "User"}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-base-300 rounded-lg p-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-base-content text-xs">{reply.user?.fullName || "Anonymous"}</span>
                    <span className="text-base-content/60 text-xs">@{reply.user?.username || "user"}</span>
                    <span className="text-base-content/40 text-xs">• {formatPostTime(reply.createdAt)}</span>
                  </div>
                  <p className="text-base-content text-xs">{renderTextWithTags(reply.content)}</p>
                </div>{" "}
                <div className="flex items-center mt-1 ml-2 space-x-2">
                  <button
                    onClick={() => handleLikeReply(reply._id)}
                    className={`flex items-center space-x-1 text-xs transition-colors px-1 py-0.5 rounded-full hover:bg-base-300 ${
                      reply.isLiked ? "text-red-500" : "text-base-content/60"
                    }`}
                  >
                    <Heart size={12} fill={reply.isLiked ? "currentColor" : "none"} />
                    <span>{reply.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReplyToReply(reply)}
                    className="text-xs text-base-content/60 hover:text-base-content transition-colors px-1 py-0.5 rounded hover:bg-base-300"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input for this specific comment */}
      {isReplying && (
        <div className="ml-6">
          <form onSubmit={handleSubmitReply} className="space-y-2">
            <div className="flex items-start space-x-2">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Your avatar"
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                {" "}
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    replyingToReply
                      ? `Replying to ${replyingToReply.user?.fullName}...`
                      : `Reply to ${comment.user?.fullName || "user"}...`
                  }
                  className="textarea textarea-ghost w-full min-h-[40px] text-xs resize-none border-none focus:outline-none p-2 bg-base-300 rounded-lg"
                  rows="2"
                  autoFocus
                />
              </div>
            </div>{" "}
            <div className="flex items-center justify-end space-x-2 ml-8">
              {replyingToReply && (
                <span className="text-xs text-base-content/60">
                  Replying to @{replyingToReply.user?.username}
                  <button
                    type="button"
                    onClick={handleCancelReplyToReply}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={onCancelReply}
                className="text-xs text-base-content/60 hover:text-base-content px-2 py-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmittingReply}
                className="btn btn-primary btn-xs px-3 disabled:opacity-50"
              >
                {isSubmittingReply ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin mr-1" />
                    Replying...
                  </>
                ) : (
                  "Reply"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReplyComment;
