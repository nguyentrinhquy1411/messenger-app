import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDatabase } from "../lib/db.js";
import { app, server } from "../lib/socket.js";

// Barrel imports - clean and organized 🚀
import { authRoutes, messageRoutes, postRoutes, userRoutes, ErrorHandler } from "./index.js";

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
console.log(CLIENT_URL);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Tăng giới hạn payload cho upload ảnh
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware (MUST BE LAST)
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.globalErrorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDatabase();
});
