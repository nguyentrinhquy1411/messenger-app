import { useState } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import EmojiPicker from "emoji-picker-react";

const CommentModal = ({ isOpen, onClose, post }) => {
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Wilson",
        avatar: "/avatar.png",
        username: "@sarahw",
      },
      content: "Great post! Really inspiring work 👏",
      timestamp: "2h ago",
      likes: 5,
      isLiked: false,
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "/avatar.png",
        username: "@mikechen",
      },
      content: "I totally agree with this. Thanks for sharing your experience!",
      timestamp: "1h ago",
      likes: 2,
      isLiked: true,
    },
    {
      id: 3,
      user: {
        name: "Emma Davis",
        avatar: "/avatar.png",
        username: "@emmad",
      },
      content:
        "This is exactly what I needed to read today. Thank you for the motivation! 🚀",
      timestamp: "45m ago",
      likes: 8,
      isLiked: false,
    },
    {
      id: 4,
      user: {
        name: "Alex Rodriguez",
        avatar: "/avatar.png",
        username: "@alexr",
      },
      content: "Amazing insights! Could you share more about your process?",
      timestamp: "30m ago",
      likes: 3,
      isLiked: true,
    },
    {
      id: 5,
      user: {
        name: "Sophie Turner",
        avatar: "/avatar.png",
        username: "@sophiet",
      },
      content:
        "Love this! Your work always inspires me to push my boundaries. Keep it up! 💪✨",
      timestamp: "15m ago",
      likes: 12,
      isLiked: false,
    },
    {
      id: 6,
      user: {
        name: "David Kim",
        avatar: "/avatar.png",
        username: "@davidk",
      },
      content:
        "This resonates so much with my recent experiences. Thanks for being vulnerable and sharing this.",
      timestamp: "10m ago",
      likes: 6,
      isLiked: true,
    },
    {
      id: 7,
      user: {
        name: "Lisa Wang",
        avatar: "/avatar.png",
        username: "@lisaw",
      },
      content: "Bookmarking this for future reference. Such valuable content!",
      timestamp: "5m ago",
      likes: 4,
      isLiked: false,
    },
  ]);

  const { authUser } = useAuthStore();

  const handleEmojiClick = (emojiData) => {
    setCommentText((prev) => prev + emojiData.emoji);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: authUser?.fullName || "User",
        avatar: authUser?.profilePic || "/avatar.png",
        username: "@" + (authUser?.username || "user"),
      },
      content: commentText,
      timestamp: "now",
      likes: 0,
      isLiked: false,
    };

    setComments([...comments, newComment]);
    setCommentText("");
    setShowEmojiPicker(false);
  };

  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  if (!isOpen || !post) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300 flex-shrink-0">
          <h2 className="text-lg font-semibold text-base-content">Comments</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Post Preview */}
        <div className="p-4 border-b border-base-300 flex-shrink-0">
          <div className="flex items-start space-x-3">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-base-content">
                  {post.user.name}
                </h3>
                <span className="text-base-content/70 text-sm">
                  {post.user.username}
                </span>
                <span className="text-base-content/60 text-sm">•</span>
                <span className="text-base-content/60 text-sm">
                  {post.timestamp}
                </span>
              </div>
              <p className="text-base-content mt-2">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg mt-3 max-h-48 object-cover"
                />
              )}
            </div>
          </div>
        </div>
        {/* Comments List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-base-content/30 mx-auto mb-2" />
              <p className="text-base-content/70">No comments yet</p>
              <p className="text-base-content/60 text-sm">
                Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-base-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-base-content text-sm">
                          {comment.user.name}
                        </span>
                        <span className="text-base-content/60 text-xs">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-base-content text-sm">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-2 ml-3">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center space-x-1 text-xs transition-colors ${
                          comment.isLiked
                            ? "text-red-500"
                            : "text-base-content/60 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          size={14}
                          fill={comment.isLiked ? "currentColor" : "none"}
                        />
                        <span>{comment.likes}</span>
                      </button>

                      <button className="text-base-content/60 hover:text-base-content text-xs">
                        Reply
                      </button>

                      <button className="text-base-content/60 hover:text-base-content">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>{" "}
        {/* Comment Input */}
        <div className="p-4 border-t border-base-300 flex-shrink-0">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-start space-x-3">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="textarea textarea-ghost w-full min-h-[60px] text-sm resize-none border-none focus:outline-none p-2 bg-base-200 rounded-lg"
                  rows="2"
                />
              </div>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="ml-11 bg-base-200 rounded-lg p-2">
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

            {/* Action Buttons */}
            <div className="flex items-center justify-between ml-11">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`flex items-center justify-center w-8 h-8 rounded-full hover:bg-base-200 transition-colors ${
                  showEmojiPicker ? "bg-base-300" : ""
                }`}
              >
                <Smile className="w-4 h-4 text-yellow-500" />
              </button>

              <button
                type="submit"
                disabled={!commentText.trim()}
                className="btn btn-primary btn-sm px-4 disabled:opacity-50"
              >
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
