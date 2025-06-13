import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import MainLayout from "../components/MainLayout";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

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
  return (
    <MainLayout>
      {" "}
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
          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {" "}
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
            </div>{" "}
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-base-content/70 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-base-content/70 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300">
                {authUser?.email}
              </p>
            </div>
          </div>
          <div className="mt-6 bg-base-200 rounded-xl p-6 border border-base-300">
            <h2 className="text-lg font-medium text-base-content mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span className="text-base-content/70">Member Since</span>
                <span className="text-base-content">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/70">Account Status</span>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </MainLayout>
  );
};
export default ProfilePage;
