import { axiosInstance } from "./axios";

export const postAPI = {
  // Get newsfeed
  getNewsfeed: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/posts/newsfeed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/posts/user-posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create post
  createPost: async (postData) => {
    const response = await axiosInstance.post("/posts", postData);
    return response.data;
  },

  // Toggle like
  toggleLike: async (postId) => {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (postId, content) => {
    const response = await axiosInstance.post(`/posts/${postId}/comment`, { content });
    return response.data;
  },

  // Add reply
  addReply: async (postId, commentId, content) => {
    const response = await axiosInstance.post(`/posts/${postId}/comment/${commentId}/reply`, { content });
    return response.data;
  },
  // Toggle repost
  toggleRepost: async (postId, content = "", type = "simple") => {
    const response = await axiosInstance.post(`/posts/${postId}/repost`, { content, type });
    return response.data;
  },
};
