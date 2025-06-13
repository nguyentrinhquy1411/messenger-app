import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  UserPlus,
  Image,
  Smile,
  Repeat,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import CreatePostModal from "./CreatePostModal";
import RepostModal from "./RepostModal";
import CommentModal from "./CommentModal";

const NewsFeed = () => {
  const { authUser } = useAuthStore();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        username: "@johndoe",
        avatar: "/avatar.png",
        verified: true,
      },
      content:
        "Just finished working on a new project! Really excited to share it with everyone. What do you think about the new design trends?",
      image: null,
      timestamp: "2h",
      likes: 24,
      replies: 5,
      reposts: 2,
      isLiked: false,
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        username: "@janesmith",
        avatar: "/avatar.png",
        verified: false,
      },
      content:
        "Beautiful sunset today! Sometimes we need to pause and appreciate the simple things in life. 🌅",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      timestamp: "4h",
      likes: 89,
      replies: 12,
      reposts: 15,
      isLiked: true,
    },
    {
      id: 3,
      user: {
        name: "Alex Johnson",
        username: "@alexj",
        avatar: "/avatar.png",
        verified: true,
      },
      content:
        "Working on some exciting features for our app. The community feedback has been incredible! Thank you all for your support 💙",
      image: null,
      timestamp: "6h",
      likes: 156,
      replies: 23,
      reposts: 8,
      isLiked: false,
    },
  ]);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCreatePost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleOpenCommentModal = (post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  };

  const handleOpenRepostModal = (post) => {
    setSelectedPost(post);
    setIsRepostModalOpen(true);
  };

  const handleRepost = (postId, type, content = "") => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reposts: post.reposts + 1,
            }
          : post
      )
    );
    // Here you would typically create a new repost entry in your backend
  };

  const handleAddComment = (postId, comment) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies + 1,
            }
          : post
      )
    );
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
              What's on your mind, {authUser?.fullName?.split(" ")[0] || "User"}
              ?
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
      {/* Posts */}
      <div className="space-y-6">
        {" "}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-base-100 border border-base-300 rounded-lg p-6"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-base-content">
                      {post.user.name}
                    </h3>
                    {post.user.verified && (
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-base-content/70 text-sm">
                    {post.user.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-base-content/60">
                <span className="text-sm">{post.timestamp}</span>
                <button className="hover:text-base-content transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-base-content text-base leading-relaxed mb-3">
                {post.content}
              </p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg object-cover max-h-96"
                />
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-base-300">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                  post.isLiked
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-base-content/70 hover:text-red-500 hover:bg-red-500/10"
                }`}
              >
                <Heart
                  size={18}
                  fill={post.isLiked ? "currentColor" : "none"}
                />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>{" "}
              <button
                onClick={() => handleOpenCommentModal(post)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full text-base-content/70 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="text-sm font-medium">{post.replies}</span>
              </button>
              <button
                onClick={() => handleOpenRepostModal(post)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full text-base-content/70 hover:text-green-500 hover:bg-green-500/10 transition-colors"
              >
                <Repeat size={18} />
                <span className="text-sm font-medium">{post.reposts}</span>
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
      />
      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => {
            setIsCommentModalOpen(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
          onAddComment={handleAddComment}
        />
      )}
      {/* Repost Modal */}
      {selectedPost && (
        <RepostModal
          isOpen={isRepostModalOpen}
          onClose={() => {
            setIsRepostModalOpen(false);
            setSelectedPost(null);
          }}
          post={selectedPost}
          onRepost={handleRepost}
        />
      )}
    </div>
  );
};

export default NewsFeed;
