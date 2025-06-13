import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  Heart,
  MessageCircle,
  Repeat,
  Share,
  MoreHorizontal,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import CommentModal from "../components/CommentModal";
import RepostModal from "../components/RepostModal";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Sample posts data
  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      user: {
        name: authUser?.fullName || "User",
        username: `@${authUser?.username || "user"}`,
        avatar: authUser?.profilePic || "/avatar.png",
        verified: false,
      },
      content:
        "Just finished working on a new project! Really excited to share it with everyone. What do you think about the new design trends?",
      image: null,
      timestamp: "2h ago",
      likes: 24,
      replies: 5,
      reposts: 2,
      isLiked: false,
      isReposted: false,
    },
    {
      id: 2,
      user: {
        name: authUser?.fullName || "User",
        username: `@${authUser?.username || "user"}`,
        avatar: authUser?.profilePic || "/avatar.png",
        verified: false,
      },
      content:
        "Beautiful sunset today! Sometimes we need to pause and appreciate the simple things in life. 🌅",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      timestamp: "1d ago",
      likes: 89,
      replies: 12,
      reposts: 15,
      isLiked: true,
      isReposted: true,
    },
  ]);

  // Sample reposts data
  const [userReposts, setUserReposts] = useState([
    {
      id: 3,
      originalPost: {
        user: {
          name: "Alex Johnson",
          username: "@alexj",
          avatar: "/avatar.png",
          verified: true,
        },
        content:
          "Working on some exciting features for our app. The community feedback has been incredible! Thank you all for your support 💙",
        timestamp: "6h ago",
      },
      repostTimestamp: "4h ago",
      repostComment: "This is so inspiring! Great work Alex 👏",
      likes: 156,
      replies: 23,
      reposts: 8,
      isLiked: false,
      isReposted: true, // User has reposted this
    },
  ]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Post interaction handlers
  const handleLike = (postId) => {
    setUserPosts(
      userPosts.map((post) =>
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

  const handleOpenRepostModal = (post) => {
    setSelectedPost(post);
    setIsRepostModalOpen(true);
  };

  const handleCloseRepostModal = () => {
    setIsRepostModalOpen(false);
    // Small delay to ensure modal state is properly reset
    setTimeout(() => {
      setSelectedPost(null);
    }, 100);
  };

  const handleRepost = (postId, type, content = "") => {
    setUserPosts(
      userPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reposts: post.reposts + 1,
              isReposted: true,
            }
          : post
      )
    );
  };

  const handleUnrepost = (postId) => {
    setUserPosts(
      userPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reposts: Math.max(0, post.reposts - 1),
              isReposted: false,
            }
          : post
      )
    );
  };

  const handleRepostToggle = (post) => {
    if (post.isReposted) {
      handleUnrepost(post.id);
    } else {
      handleOpenRepostModal(post);
    }
  };

  const handleAddComment = (postId, comment) => {
    setUserPosts(
      userPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies + 1,
            }
          : post
      )
    );
  };

  // Handlers for reposts tab
  const handleRepostLike = (repostId) => {
    setUserReposts(
      userReposts.map((repost) =>
        repost.id === repostId
          ? {
              ...repost,
              isLiked: !repost.isLiked,
              likes: repost.isLiked ? repost.likes - 1 : repost.likes + 1,
            }
          : repost
      )
    );
  };

  const handleRepostComment = (repost) => {
    // Create a post-like object for the modal
    const postForModal = {
      id: repost.id,
      user: repost.originalPost.user,
      content: repost.originalPost.content,
      timestamp: repost.originalPost.timestamp,
      likes: repost.likes,
      replies: repost.replies,
      reposts: repost.reposts,
    };
    setSelectedPost(postForModal);
    setIsCommentModalOpen(true);
  };

  const handleUnrepostFromTab = (repostId) => {
    // Remove from reposts and update the original post
    setUserReposts(userReposts.filter((repost) => repost.id !== repostId));

    // Also update userPosts if the original post exists there
    setUserPosts(
      userPosts.map((post) =>
        post.id === repostId
          ? {
              ...post,
              reposts: Math.max(0, post.reposts - 1),
              isReposted: false,
            }
          : post
      )
    );
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-xl border border-base-300 p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-base-content">
              Profile
            </h1>
            <p className="mt-2 text-base-content/70">
              Your profile information
            </p>
          </div>

          {/* Profile Header Section */}
          <div className="flex flex-col items-center gap-6">
            {/* Avatar Upload */}
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-base-300"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:bg-base-content/80 hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-100" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-base-content">
                {authUser?.fullName}
              </h2>
              <p className="text-base-content/70">
                @{authUser?.username || "user"}
              </p>

              {/* Bio */}
              <p className="text-base-content/80 max-w-md mx-auto leading-relaxed">
                {authUser?.bio || "Hello! I'm new to this platform."}
              </p>

              {/* Additional Info */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-base-content/60 mt-3">
                {authUser?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{authUser.location}</span>
                  </div>
                )}

                {authUser?.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {new Date(authUser.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}

                {authUser?.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={authUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {authUser.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-base-content/60">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Posts and Reposts Tabs */}
          <div className="mt-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-base-300">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === "posts"
                    ? "border-b-2 border-primary text-primary"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                Posts ({userPosts.length})
              </button>
              <button
                onClick={() => setActiveTab("reposts")}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === "reposts"
                    ? "border-b-2 border-primary text-primary"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                Reposts ({userReposts.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "posts" && (
                <div className="space-y-6">
                  {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-base-content/70">No posts yet</p>
                      <p className="text-base-content/60 text-sm mt-2">
                        Share your first post to get started!
                      </p>
                    </div>
                  ) : (
                    userPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-base-100 border border-base-300 rounded-lg p-6"
                      >
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={authUser?.profilePic || "/avatar.png"}
                              alt={authUser?.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-base-content">
                                  {authUser?.fullName}
                                </h3>
                                <span className="text-base-content/70 text-sm">
                                  @{authUser?.username || "user"}
                                </span>
                              </div>
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
                            <span className="text-sm font-medium">
                              {post.likes}
                            </span>
                          </button>

                          <button
                            onClick={() => handleOpenCommentModal(post)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-full text-base-content/70 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                          >
                            <MessageCircle size={18} />
                            <span className="text-sm font-medium">
                              {post.replies}
                            </span>
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
                            <span className="text-sm font-medium">
                              {post.reposts}
                            </span>
                            {post.isReposted && (
                              <Check size={14} className="text-green-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "reposts" && (
                <div className="space-y-6">
                  {userReposts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-base-content/70">No reposts yet</p>
                      <p className="text-base-content/60 text-sm mt-2">
                        Repost something to get started!
                      </p>
                    </div>
                  ) : (
                    userReposts.map((repost) => (
                      <div
                        key={repost.id}
                        className="bg-base-100 border border-base-300 rounded-lg p-6"
                      >
                        {/* Repost Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-base-content/70">
                            <Repeat size={16} className="text-green-500" />
                            <span className="text-sm">
                              You reposted {repost.repostTimestamp}
                            </span>
                          </div>
                          <button
                            onClick={() => handleUnrepostFromTab(repost.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full text-green-500 hover:bg-green-500/10 transition-colors text-sm"
                            title="Remove repost"
                          >
                            <Check size={14} />
                            <span>Reposted</span>
                          </button>
                        </div>

                        {/* Repost Comment (if any) */}
                        {repost.repostComment && (
                          <div className="mb-4 p-3 bg-base-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <img
                                src={authUser?.profilePic || "/avatar.png"}
                                alt={authUser?.fullName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-medium text-base-content text-sm">
                                  {authUser?.fullName}
                                </h4>
                                <p className="text-base-content/80 text-sm mt-1">
                                  {repost.repostComment}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Original Post */}
                        <div className="border border-base-300 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <img
                                src={repost.originalPost.user.avatar}
                                alt={repost.originalPost.user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-base-content text-sm">
                                    {repost.originalPost.user.name}
                                  </h4>
                                  {repost.originalPost.user.verified && (
                                    <svg
                                      className="w-3 h-3 text-blue-500"
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
                                  <span className="text-base-content/70 text-xs">
                                    {repost.originalPost.user.username}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-base-content/60 text-xs">
                              {repost.originalPost.timestamp}
                            </span>
                          </div>

                          <p className="text-base-content text-sm leading-relaxed mb-3">
                            {repost.originalPost.content}
                          </p>

                          {/* Original Post Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-base-300">
                            <button
                              onClick={() => handleRepostLike(repost.id)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-colors ${
                                repost.isLiked
                                  ? "text-red-500 hover:bg-red-500/10"
                                  : "text-base-content/70 hover:text-red-500 hover:bg-red-500/10"
                              }`}
                            >
                              <Heart
                                size={14}
                                fill={repost.isLiked ? "currentColor" : "none"}
                              />
                              <span className="text-xs">{repost.likes}</span>
                            </button>

                            <button
                              onClick={() => handleRepostComment(repost)}
                              className="flex items-center space-x-1 px-2 py-1 rounded-full text-base-content/70 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                            >
                              <MessageCircle size={14} />
                              <span className="text-xs">{repost.replies}</span>
                            </button>

                            <button
                              onClick={() => handleUnrepostFromTab(repost.id)}
                              className="flex items-center space-x-1 px-2 py-1 rounded-full text-green-500 hover:bg-green-500/10 transition-colors"
                              title="Remove repost"
                            >
                              <Repeat size={14} />
                              <span className="text-xs">{repost.reposts}</span>
                              <Check size={12} className="text-green-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={handleCloseCommentModal}
          post={selectedPost}
          onAddComment={handleAddComment}
        />
      )}

      {/* Repost Modal */}
      {selectedPost && (
        <RepostModal
          isOpen={isRepostModalOpen}
          onClose={handleCloseRepostModal}
          post={selectedPost}
          onRepost={handleRepost}
        />
      )}
    </MainLayout>
  );
};

export default ProfilePage;
