import { useState, useEffect } from "react";
import { X, Share, MessageSquare, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { formatPostTime } from "../lib/utils";
import toast from "react-hot-toast";

const RepostModal = ({ isOpen, onClose, post, onRepost }) => {
  const [repostContent, setRepostContent] = useState("");
  const [repostType, setRepostType] = useState("quote"); // "quote" or "simple"  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser } = useAuthStore();

  if (!isOpen) return null;

  const handleClose = () => {
    setRepostContent("");
    setRepostType("quote");
    setIsSubmitting(false);
    onClose();
  };

  const handleRepost = async () => {
    if (repostType === "quote" && !repostContent.trim()) {
      toast.error("Please add your thoughts for quote repost");
      return;
    }
    setIsSubmitting(true);
    try {
      // Just call the parent handler, don't call API directly
      if (onRepost) {
        await onRepost(post._id, repostType, repostContent);
      }
      handleClose();
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Failed to repost");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center space-x-4">
            <button onClick={handleClose} className="p-2 hover:bg-base-200 rounded-full transition-colors">
              <X size={20} className="text-base-content/70" />
            </button>
            <h2 className="text-lg font-semibold text-base-content">Repost</h2>
          </div>
        </div>
        {/* Repost Type Selection */}
        <div className="p-4 border-b border-base-300">
          <div className="flex space-x-4">
            <button
              onClick={() => setRepostType("simple")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                repostType === "simple"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/70 hover:bg-base-300"
              }`}
            >
              <Share size={16} />
              <span className="text-sm font-medium">Repost</span>
            </button>
            <button
              onClick={() => setRepostType("quote")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                repostType === "quote"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/70 hover:bg-base-300"
              }`}
            >
              <MessageSquare size={16} />
              <span className="text-sm font-medium">Quote</span>
            </button>
          </div>
        </div>
        {/* Quote Text Input (only for quote reposts) */}
        {repostType === "quote" && (
          <div className="p-4 border-b border-base-300">
            <textarea
              value={repostContent}
              onChange={(e) => setRepostContent(e.target.value)}
              placeholder="Add your thoughts..."
              className="w-full p-3 bg-base-200 border border-base-300 rounded-lg resize-none focus:outline-none focus:border-primary transition-colors text-base-content"
              rows="3"
              maxLength="280"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-base-content/50">{280 - repostContent.length} characters remaining</span>
            </div>
          </div>
        )}{" "}
        {/* Original Post Preview */}
        <div className="p-4">
          <div className="border border-base-300 rounded-lg p-4 bg-base-200/50">
            <div className="flex items-start space-x-3">
              <img
                src={post.user?.profilePic || "/avatar.png"}
                alt={post.user?.fullName || "User"}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-base-content">{post.user?.fullName || "Anonymous"}</span>
                  <span className="text-base-content/50 text-sm">@{post.user?.username || "user"}</span>
                  <span className="text-base-content/50 text-sm">·</span>
                  <span className="text-base-content/50 text-sm">{formatPostTime(post.createdAt)}</span>
                </div>
                <p className="text-base-content mt-1 text-sm line-clamp-3">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="w-full rounded-lg mt-2 max-h-32 object-cover" />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="p-4 border-t border-base-300">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-base-content/70 hover:bg-base-200 rounded-full transition-colors font-medium"
            >
              Cancel
            </button>{" "}
            <button
              onClick={handleRepost}
              disabled={(repostType === "quote" && repostContent.trim().length === 0) || isSubmitting}
              className="px-6 py-2 bg-primary text-primary-content rounded-full hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-1 inline" />
                  {repostType === "simple" ? "Reposting..." : "Quote Reposting..."}
                </>
              ) : (
                <>{repostType === "simple" ? "Repost" : "Quote Repost"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepostModal;
