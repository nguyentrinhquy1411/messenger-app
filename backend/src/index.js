// Barrel exports for models
export { default as Post } from "./models/post.model.js";
export { default as User } from "./models/user.model.js";

// Barrel exports for services
export { default as PostService } from "./services/post.service.js";
export { default as UserService } from "./services/user.service.js";

// Barrel exports for controllers
export { default as PostController } from "./controllers/post.controller.js";
export { default as UserController } from "./controllers/user.controller.js";

// Barrel exports for utilities
export { ApiResponse, ApiError } from "./utils/response.js";
export { default as ErrorHandler } from "./middlewares/error.middleware.js";
export { default as ValidationMiddleware } from "./middlewares/validation.middleware.js";

// Barrel exports for ALL routes
export { default as authRoutes } from "./routes/auth.route.js";
export { default as messageRoutes } from "./routes/message.route.js";
export { default as postRoutes } from "./routes/post.route.js";
export { default as userRoutes } from "./routes/user.route.js";
