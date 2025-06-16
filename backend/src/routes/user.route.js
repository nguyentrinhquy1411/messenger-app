import express from "express";
import UserController from "../controllers/user.controller.js";
import { protectRoute } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// User search and suggestions
router.get("/search", protectRoute, UserController.searchUsers);
router.get("/suggestions", protectRoute, UserController.getSuggestions);

// User profile
router.get("/profile/:userId", protectRoute, UserController.getProfile);
router.put("/profile", protectRoute, UserController.updateProfile);

// Follow system
router.post("/follow/:userId", protectRoute, UserController.toggleFollow);

export default router;
