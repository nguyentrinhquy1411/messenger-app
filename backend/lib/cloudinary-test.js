import cloudinary from "../lib/cloudinary.js";

// Test Cloudinary connectionexport const testCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error);
    return false;
  }
};

// Test function for image upload (for debugging)
export const testImageUpload = async (base64Image) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      resource_type: "auto",
      folder: "messenger-app", // Optional: organize uploads in folders
    });
    console.log("✅ Image upload successful:", uploadResponse.secure_url);
    return uploadResponse;
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    throw error;
  }
};
