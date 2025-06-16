import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  UserPlus,
  Image,
  Smile,
  Repeat,
  Check,
  Loader,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import { formatPostTime } from "../lib/utils";
import CreatePostModal from "./CreatePostModal";
import RepostModal from "./RepostModal";
import CommentModal from "./CommentModal";
import ImagePreview from "./ImagePreview";
import toast from "react-hot-toast";

const NewsFeed = () => {
  const { authUser } = useAuthStore();
  const { posts, isLoading, error, fetchNewsfeed, createPost, toggleLike, toggleRepost, addComment } = usePostStore();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Fetch posts on component mount
  useEffect(() => {
    fetchNewsfeed();
  }, [fetchNewsfeed]);
  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCreatePost = async (newPostData) => {
    try {
      await createPost(newPostData);
      setIsCreatePostModalOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  const handleOpenCommentModal = (post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  };
  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
    // Small delay to ensure modal state is properly reset
    setTimeout(() => {
      setSelectedPost(null);
    }, 100);
  };

  const handleCloseRepostModal = () => {
    setIsRepostModalOpen(false);
    // Small delay to ensure modal state is properly reset
    setTimeout(() => {
      setSelectedPost(null);
    }, 100);
  };
  const handleOpenRepostModal = (post) => {
    setSelectedPost(post);
    setIsRepostModalOpen(true);
  };
  const handleRepost = async (postId, type, content = "") => {
    try {
      await toggleRepost(postId, content, type);
      handleCloseRepostModal();
    } catch (error) {
      console.error("Error reposting:", error);
      toast.error("Failed to repost");
    }
  };
  const handleUnrepost = async (postId) => {
    try {
      await toggleRepost(postId, "", "simple");
    } catch (error) {
      console.error("Error unreposting:", error);
      toast.error("Failed to unrepost");
    }
  };

  const handleRepostToggle = async (post) => {
    if (post.isReposted) {
      await handleUnrepost(post._id);
    } else {
      handleOpenRepostModal(post);
    }
  };
  const handleAddComment = async (postId, comment) => {
    try {
      await addComment(postId, comment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setIsImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setIsImagePreviewOpen(false);
    setPreviewImageUrl("");
  };
  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      {/* Create Post */}
      <div className="bg-base-100 border border-base-300 rounded-lg mb-6 p-4">
        <div className="flex items-start space-x-3">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="w-full text-left p-3 rounded-full bg-base-200 hover:bg-base-300 transition-colors text-base-content/70"
            >
              What's on your mind, {authUser?.fullName?.split(" ")[0] || "User"}?
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/70"
          >
            <Image className="w-5 h-5 text-green-500" />
            <span>Photo/Video</span>
          </button>
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/70"
          >
            <Smile className="w-5 h-5 text-yellow-500" />
            <span>Feeling/Activity</span>
          </button>{" "}
        </div>
      </div>
      {/* Loading State */}
      {isLoading && posts.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <Loader className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-base-content/70">Loading posts...</span>
        </div>
      )}
      {/* Error State */}
      {error && posts.length === 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <p className="text-error text-center">{error}</p>
          <button onClick={() => fetchNewsfeed()} className="mt-2 btn btn-primary btn-sm mx-auto block">
            Try Again
          </button>
        </div>
      )}
      {/* Empty State */}
      {!isLoading && posts.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-base-content/70">No posts yet. Be the first to share something!</p>
        </div>
      )}
      {/* Posts */}
      <div className="space-y-6">
        {" "}
        {posts.map((post) => (
          <div key={post._id} className="bg-base-100 border border-base-300 rounded-lg p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={post.user?.profilePic || "/avatar.png"}
                  alt={post.user?.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-base-content">{post.user?.fullName || "Anonymous"}</h3>
                    {post.user?.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-base-content/70 text-sm">@{post.user?.username || "anonymous"}</p>
                </div>
              </div>{" "}
              <div className="flex items-center space-x-2 text-base-content/60">
                <span className="text-sm">{formatPostTime(post.createdAt)}</span>
                <button className="hover:text-base-content transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>{" "}
            {/* Post Content */}
            <div className="mb-4">
              <p className="text-base-content text-base leading-relaxed mb-3">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handleImageClick(post.image)}
                />
              )}
            </div>
            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-base-300">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                  post.isLiked
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-base-content/70 hover:text-red-500 hover:bg-red-500/10"
                }`}
              >
                <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                <span className="text-sm font-medium">{post.likeCount || 0}</span>
              </button>{" "}
              <button
                onClick={() => handleOpenCommentModal(post)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full text-base-content/70 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="text-sm font-medium">{post.commentCount || 0}</span>
              </button>
              <button
                onClick={() => handleRepostToggle(post)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                  post.isReposted
                    ? "text-green-500 hover:bg-green-500/10"
                    : "text-base-content/70 hover:text-green-500 hover:bg-green-500/10"
                }`}
                title={post.isReposted ? "Unrepost" : "Repost"}
              >
                <Repeat size={18} />
                <span className="text-sm font-medium">{post.repostCount || 0}</span>
                {post.isReposted && <Check size={14} className="text-green-500" />}
              </button>
            </div>
          </div>
        ))}
      </div>{" "}
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onCreatePost={handleCreatePost}
      />{" "}
      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={handleCloseCommentModal}
          post={selectedPost}
          onAddComment={handleAddComment}
        />
      )}{" "}
      {/* Repost Modal */}
      {selectedPost && (
        <RepostModal
          isOpen={isRepostModalOpen}
          onClose={handleCloseRepostModal}
          post={selectedPost}
          onRepost={handleRepost}
        />
      )}
      {/* Image Preview Modal */}
      <ImagePreview imageUrl={previewImageUrl} isOpen={isImagePreviewOpen} onClose={handleCloseImagePreview} />
    </div>
  );
};

export default NewsFeed;
