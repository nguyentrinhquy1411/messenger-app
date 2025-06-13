import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, User, Mail, Key, Save } from "lucide-react";
import { useState } from "react";
import MainLayout from "../components/MainLayout";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  // Account settings state
  const [accountForm, setAccountForm] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  const handleAccountInputChange = (field, value) => {
    setAccountForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsUpdatingAccount(true);

    try {
      // Validate passwords if changing password
      if (
        accountForm.newPassword &&
        accountForm.newPassword !== accountForm.confirmPassword
      ) {
        alert("New passwords don't match!");
        return;
      }

      const updateData = {
        fullName: accountForm.fullName,
        email: accountForm.email,
      };

      // Only include password if user is changing it
      if (accountForm.newPassword) {
        updateData.currentPassword = accountForm.currentPassword;
        updateData.newPassword = accountForm.newPassword;
      }

      await updateProfile(updateData);

      // Clear password fields after successful update
      setAccountForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      alert("Account updated successfully!");
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Failed to update account. Please try again.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-base-100 rounded-xl border border-base-300 p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-base-content">
              Settings
            </h1>
            <p className="mt-2 text-base-content/70">
              Customize your app preferences
            </p>{" "}
          </div>
          <div className="space-y-6">
            {/* Account Settings Section */}
            <div className="border-b border-base-300 pb-8">
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-lg font-semibold text-base-content">
                  Account Settings
                </h2>
                <p className="text-sm text-base-content/70">
                  Update your account information and security settings
                </p>
              </div>

              <form onSubmit={handleUpdateAccount} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-base-content">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={accountForm.fullName}
                        onChange={(e) =>
                          handleAccountInputChange("fullName", e.target.value)
                        }
                        className="input input-bordered w-full"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) =>
                          handleAccountInputChange("email", e.target.value)
                        }
                        className="input input-bordered w-full"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-base-content">
                    Change Password
                  </h3>
                  <p className="text-sm text-base-content/60">
                    Leave blank if you don't want to change your password
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={accountForm.currentPassword}
                        onChange={(e) =>
                          handleAccountInputChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        className="input input-bordered w-full"
                        placeholder="Current password"
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={accountForm.newPassword}
                        onChange={(e) =>
                          handleAccountInputChange(
                            "newPassword",
                            e.target.value
                          )
                        }
                        className="input input-bordered w-full"
                        placeholder="New password"
                        minLength={6}
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-base-content">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={accountForm.confirmPassword}
                        onChange={(e) =>
                          handleAccountInputChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="input input-bordered w-full"
                        placeholder="Confirm new password"
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Password validation message */}
                  {accountForm.newPassword &&
                    accountForm.confirmPassword &&
                    accountForm.newPassword !== accountForm.confirmPassword && (
                      <div className="text-sm text-error">
                        Passwords don't match
                      </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingAccount || isUpdatingProfile}
                    className="btn btn-primary"
                  >
                    {isUpdatingAccount ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            {/* Theme Settings Section */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-base-content">Theme</h2>
              <p className="text-sm text-base-content/70">
                Choose a theme for your chat interface
              </p>
            </div>{" "}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                    ${
                      theme === t
                        ? "bg-base-200 border-2 border-base-300"
                        : "hover:bg-base-200/50 border-2 border-transparent"
                    }
                  `}
                  onClick={() => setTheme(t)}
                >
                  <div
                    className="relative h-8 w-full rounded-md overflow-hidden"
                    data-theme={t}
                  >
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium truncate w-full text-center text-base-content">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            {/* Preview Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-base-content">
                Preview
              </h3>
              <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-sm">
                <div className="p-4 bg-base-200">
                  <div className="max-w-lg mx-auto">
                    {/* Mock Chat UI */}
                    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-300">
                      {/* Chat Header */}
                      <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                            J
                          </div>
                          <div>
                            {" "}
                            <h3 className="font-medium text-sm text-base-content">
                              John Doe
                            </h3>
                            <p className="text-xs text-base-content/70">
                              Online
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                        {PREVIEW_MESSAGES.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.isSent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`
                                max-w-[80%] rounded-xl p-3 shadow-sm
                                ${
                                  message.isSent
                                    ? "bg-primary text-primary-content"
                                    : "bg-base-200 text-base-content"
                                }
                              `}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`
                                  text-[10px] mt-1.5
                                  ${
                                    message.isSent
                                      ? "text-primary-content/70"
                                      : "text-base-content/70"
                                  }
                                `}
                              >
                                12:00 PM
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-base-300 bg-base-100">
                        {" "}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered flex-1 text-sm"
                            placeholder="Type a message..."
                            value="This is a preview"
                            readOnly
                          />
                          <button className="btn btn-primary">
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
