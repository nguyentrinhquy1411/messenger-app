import { create } from "zustand";
import { postAPI } from "../lib/postAPI";
import toast from "react-hot-toast";

export const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  hasNextPage: true,
  currentPage: 1,

  // Fetch newsfeed posts
  fetchNewsfeed: async (page = 1) => {
    try {
      set({ isLoading: true, error: null });

      const response = await postAPI.getNewsfeed(page, 10);
      const newPosts = response.data;

      set((state) => ({
        posts: page === 1 ? newPosts : [...state.posts, ...newPosts],
        isLoading: false,
        currentPage: page,
        hasNextPage: response.pagination?.page < response.pagination?.pages,
      }));
    } catch (error) {
      console.error("Error fetching newsfeed:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch posts",
        isLoading: false,
      });
      toast.error("Failed to load posts");
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await postAPI.createPost(postData);
      const newPost = response.data;

      set((state) => ({
        posts: [newPost, ...state.posts],
      }));

      toast.success("Post created successfully!");
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMessage = error.response?.data?.message || "Failed to create post";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Toggle like
  toggleLike: async (postId) => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked ? Math.max(0, post.likeCount - 1) : post.likeCount + 1,
              }
            : post
        ),
      }));

      const response = await postAPI.toggleLike(postId);

      // Update with server response
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: response.data.isLiked,
                likeCount: response.data.likeCount,
              }
            : post
        ),
      }));
    } catch (error) {
      console.error("Error toggling like:", error);

      // Revert optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1),
              }
            : post
        ),
      }));

      toast.error("Failed to update like");
    }
  },
  // Add comment
  addComment: async (postId, content) => {
    try {
      const response = await postAPI.addComment(postId, content);

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                commentCount: post.commentCount + 1,
                comments: [...(post.comments || []), response.data],
              }
            : post
        ),
      }));

      toast.success("Comment added!");
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  },

  // Add reply to comment
  addReply: async (postId, commentId, content) => {
    try {
      const response = await postAPI.addReply(postId, commentId, content);

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                commentCount: post.commentCount + 1,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), response.data],
                      }
                    : comment
                ),
              }
            : post
        ),
      }));

      toast.success("Reply added!");
      return response.data;
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
      throw error;
    }
  },
  // Toggle repost
  toggleRepost: async (postId, content = "", type = "simple") => {
    try {
      // Optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isReposted: !post.isReposted,
                repostCount: post.isReposted ? Math.max(0, post.repostCount - 1) : post.repostCount + 1,
              }
            : post
        ),
      }));

      const response = await postAPI.toggleRepost(postId, content, type); // Update with server response
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isReposted: response.data.isReposted,
                repostCount: response.data.repostCount,
              }
            : post
        ),
      }));

      // Only show success message, let components handle their own success feedback
      if (response.data.isReposted) {
        toast.success("Post reposted successfully!");
      } else {
        toast.success("Post unreposted successfully!");
      }
    } catch (error) {
      console.error("Error toggling repost:", error);

      // Revert optimistic update
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isReposted: !post.isReposted,
                repostCount: post.isReposted ? post.repostCount + 1 : Math.max(0, post.repostCount - 1),
              }
            : post
        ),
      }));

      toast.error("Failed to update repost");
    }
  },

  // Clear posts
  clearPosts: () => set({ posts: [], currentPage: 1, hasNextPage: true }),

  // Reset store
  reset: () =>
    set({
      posts: [],
      isLoading: false,
      error: null,
      hasNextPage: true,
      currentPage: 1,
    }),
}));
