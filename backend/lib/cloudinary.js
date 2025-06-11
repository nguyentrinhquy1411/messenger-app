import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfilePic = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "messenger-app/profile-pics", // Tạo folder riêng
      width: 400,
      height: 400,
      crop: "fill",
      quality: "auto",
      format: "jpg",
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const uploadMessageImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "messenger-app/messages", // Folder cho ảnh tin nhắn
      width: 800,
      height: 600,
      crop: "limit",
      quality: "auto",
      format: "jpg",
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default cloudinary;
