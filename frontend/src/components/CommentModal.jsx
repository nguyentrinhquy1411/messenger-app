import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Smile, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { formatPostTime } from "../lib/utils";
import EmojiPicker from "emoji-picker-react";
import CommentItem from "./CommentItem";

const CommentModal = ({ isOpen, onClose, post, onAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser } = useAuthStore();
  const { addComment } = usePostStore();
  const commentsEndRef = useRef(null); // Don't render if post is not provided
  if (!post || !post.user) {
    return null;
  }

  // Scroll to bottom when new comments are added
  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (post.comments && post.comments.length > 0) {
      scrollToBottom();
    }
  }, [post.comments?.length]);

  // Also scroll when replies are added
  useEffect(() => {
    const totalReplies = post.comments?.reduce((total, comment) => {
      return total + (comment.replies?.length || 0);
    }, 0);

    if (totalReplies > 0) {
      scrollToBottom();
    }
  }, [post.comments?.map((c) => c.replies?.length).join(",")]);

  const handleEmojiClick = (emojiData) => {
    setCommentText((prev) => prev + emojiData.emoji);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(post._id, commentText.trim());
      setCommentText("");
      setShowEmojiPicker(false);
      // The comment will be added to the store automatically
      // and the UI will re-render, then scroll to bottom
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-base-300 flex-shrink-0">
          <h2 className="text-lg font-semibold text-base-content">Comments</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle hover:bg-base-200">
            <X className="w-5 h-5" />
          </button>
        </div>{" "}
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
          {/* Post Preview - Scrollable with content */}
          <div className="p-4 border-b border-base-300 bg-base-100">
            <div className="flex items-start space-x-3">
              <img
                src={post.user?.profilePic || "/avatar.png"}
                alt={post.user?.fullName || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-base-content">{post.user?.fullName || "Unknown User"}</h3>
                  <span className="text-base-content/70 text-sm">@{post.user?.username || "user"}</span>
                  <span className="text-base-content/60 text-sm">•</span>
                  <span className="text-base-content/60 text-sm">{formatPostTime(post.createdAt)}</span>
                </div>
                <p className="text-base-content mt-2">{post.content || ""}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="w-full rounded-lg mt-3 max-h-48 object-cover" />
                )}
              </div>
            </div>
          </div>{" "}
          {/* Comments List */}
          <div className="px-4 pb-4">
            {!post.comments || post.comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <p className="text-base-content/70 text-lg font-medium">No comments yet</p>
                <p className="text-base-content/60 text-sm mt-1">Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {post.comments.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} postId={post._id} />
                ))}
                {/* Invisible div to scroll to */}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>
        </div>{" "}
        {/* Comment Input - Fixed at bottom */}
        <div className="p-4 border-t border-base-300 flex-shrink-0 bg-base-100">
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-start space-x-3">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                {/* Facebook-style input */}
                <div className="bg-base-200 rounded-2xl px-4 py-2 min-h-[40px] flex items-center">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-transparent text-sm resize-none border-none focus:outline-none placeholder-base-content/60"
                    rows="1"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitComment(e);
                      }
                    }}
                    style={{
                      minHeight: "20px",
                      maxHeight: "120px",
                      height: "auto",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />

                  {/* Inline actions */}
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-1 rounded-full hover:bg-base-300 transition-colors ${
                        showEmojiPicker ? "bg-base-300" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      <Smile className="w-4 h-4 text-yellow-500" />
                    </button>

                    {commentText.trim() && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-primary hover:text-primary/80 font-semibold text-sm disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : "Send"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="mt-2 bg-base-200 rounded-lg p-2 border border-base-300">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width="100%"
                      height={200}
                      searchDisabled
                      skinTonesDisabled
                      previewConfig={{
                        showPreview: false,
                      }}
                      theme="auto"
                      style={{
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
