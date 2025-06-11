import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectToDatabase } from "../lib/db.js";
import cors from "cors";
import { app, server } from "../lib/socket.js";

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

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDatabase();
});
