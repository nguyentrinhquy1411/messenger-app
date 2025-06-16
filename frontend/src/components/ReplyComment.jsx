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
    <div className="mt-2">
      {/* Display replies if they exist */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="flex items-start space-x-2">
              <img
                src={reply.user?.profilePic || "/avatar.png"}
                alt={reply.user?.fullName || "User"}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                {/* Reply Bubble - Facebook style */}
                <div className="bg-base-300 rounded-2xl px-3 py-2 inline-block max-w-full">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="font-semibold text-base-content text-xs">
                      {reply.user?.fullName || "Anonymous"}
                    </span>
                  </div>
                  <p className="text-base-content text-xs break-words">{renderTextWithTags(reply.content)}</p>
                </div>

                {/* Reply Meta & Actions */}
                <div className="flex items-center space-x-3 mt-1 ml-3 text-xs text-base-content/60">
                  <span className="hover:underline cursor-pointer">{formatPostTime(reply.createdAt)}</span>
                  <button
                    onClick={() => handleLikeReply(reply._id)}
                    className={`font-semibold hover:underline transition-colors ${
                      reply.isLiked ? "text-primary" : "hover:text-base-content"
                    }`}
                  >
                    {reply.isLiked ? "Liked" : "Like"}
                  </button>{" "}
                  <button
                    onClick={() => handleReplyToReply(reply)}
                    className="font-semibold hover:underline hover:text-base-content transition-colors"
                  >
                    Reply
                  </button>
                  {/* Like count */}{" "}
                  {reply.likes?.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Heart size={10} fill="currentColor" className="text-red-500" />
                      <span>{reply.likes.length}</span>
                    </div>
                  )}
                </div>

                {/* Reply input for this specific reply */}
                {showReplyInputForReply === reply._id && (
                  <div className="ml-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                    <form onSubmit={handleSubmitReplyToReply}>
                      <div className="flex items-start space-x-2">
                        <img
                          src={authUser?.profilePic || "/avatar.png"}
                          alt="Your avatar"
                          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="bg-base-200 rounded-2xl px-3 py-2 min-h-[32px] flex items-center border-2 border-transparent focus-within:border-primary/30 transition-colors">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${reply.user?.fullName || "user"}...`}
                              className="w-full bg-transparent text-xs resize-none border-none focus:outline-none placeholder-base-content/50"
                              rows="1"
                              autoFocus
                              disabled={isSubmittingReply}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  if (replyText.trim()) {
                                    handleSubmitReplyToReply(e);
                                  }
                                }
                                if (e.key === "Escape") {
                                  handleCancelReplyToReply();
                                }
                              }}
                              style={{
                                minHeight: "14px",
                                maxHeight: "60px",
                                height: "auto",
                              }}
                              onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";
                              }}
                            />

                            {isSubmittingReply && <Loader className="w-3 h-3 animate-spin ml-2 text-primary" />}
                          </div>

                          {/* Reply to reply actions */}
                          <div className="flex items-center justify-between mt-1 ml-3 text-xs">
                            <span className="text-base-content/50">Press Enter to send • Esc to cancel</span>

                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={handleCancelReplyToReply}
                                className="text-base-content/60 hover:text-base-content font-medium px-2 py-1 rounded hover:bg-base-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={!replyText.trim() || isSubmittingReply}
                                className={`font-semibold px-2 py-1 rounded transition-all text-xs ${
                                  replyText.trim() && !isSubmittingReply
                                    ? "text-primary hover:text-primary/80 hover:bg-primary/10"
                                    : "text-base-content/40 cursor-not-allowed"
                                }`}
                              >
                                {isSubmittingReply ? "Sending..." : "Send"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}{" "}
      {/* Reply input for main comment */}
      {isReplying && !showReplyInputForReply && (
        <div className="ml-4 mt-3 animate-in slide-in-from-top-2 duration-200" data-reply-id={comment._id}>
          <form onSubmit={handleSubmitReply}>
            <div className="flex items-start space-x-2">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Your avatar"
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-base-300 rounded-2xl px-3 py-2 min-h-[36px] flex items-center border-2 border-transparent focus-within:border-primary/30 transition-colors">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.user?.fullName || "user"}...`}
                    className="w-full bg-transparent text-xs resize-none border-none focus:outline-none placeholder-base-content/50"
                    rows="1"
                    autoFocus
                    disabled={isSubmittingReply}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (replyText.trim()) {
                          handleSubmitReply(e);
                        }
                      }
                      if (e.key === "Escape") {
                        onCancelReply();
                      }
                    }}
                    style={{
                      minHeight: "16px",
                      maxHeight: "80px",
                      height: "auto",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />

                  {/* Loading indicator inside input */}
                  {isSubmittingReply && <Loader className="w-3 h-3 animate-spin ml-2 text-primary" />}
                </div>

                {/* Enhanced reply actions */}
                <div className="flex items-center justify-between mt-2 ml-3 text-xs">
                  <div className="flex items-center space-x-2">
                    {replyingToReply && (
                      <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-full">
                        <span className="text-primary font-medium">Replying to @{replyingToReply.user?.username}</span>
                        <button
                          type="button"
                          onClick={handleCancelReplyToReply}
                          className="text-primary hover:text-primary/70 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <span className="text-base-content/50">Press Enter to send • Esc to cancel</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={onCancelReply}
                      className="text-base-content/60 hover:text-base-content font-medium px-2 py-1 rounded hover:bg-base-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSubmittingReply}
                      className={`font-semibold px-3 py-1 rounded transition-all ${
                        replyText.trim() && !isSubmittingReply
                          ? "text-primary hover:text-primary/80 hover:bg-primary/10"
                          : "text-base-content/40 cursor-not-allowed"
                      }`}
                    >
                      {isSubmittingReply ? (
                        <div className="flex items-center space-x-1">
                          <Loader className="w-3 h-3 animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send"
                      )}
                    </button>
                  </div>
                </div>

                {/* Character limit indicator */}
                {replyText.length > 200 && (
                  <div className="ml-3 mt-1">
                    <span className={`text-xs ${replyText.length > 280 ? "text-red-500" : "text-yellow-500"}`}>
                      {280 - replyText.length} characters remaining
                    </span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReplyComment;
