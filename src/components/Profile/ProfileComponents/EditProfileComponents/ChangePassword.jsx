import { useState } from "react";
import { Check, AlertCircle, Eye, EyeOff, Save } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [error, setError] = useState("");

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message: message || "An unexpected error occurred",
    });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setNotification({ show: false, type: "", message: "" });

    try {
      if (!currentPassword) {
        throw new Error("Please enter your current password");
      }
      if (!newPassword || !confirmPassword) {
        throw new Error("Please enter both new password and confirm password");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords don't match");
      }
      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      const updateData = {
        currentPassword,
        password: newPassword,
        confirmPassword,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      console.log("Sending change password data:", updateData);

      const response = await axios.put(
        `https://beautya-gr2-production.up.railway.app/api/users/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Change password response:", response.data);

      if (
        response.status === 200 ||
        (response.data &&
          response.data.message === "Profile updated successfully")
      ) {
        showNotification("success", "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/edit-profile");
        }, 2000);
      } else {
        throw new Error(
          "Password change failed: Unexpected response from server"
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Status:", error.response.status);
        if (error.response.status === 401) {
          showNotification("error", "Unauthorized: Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (error.response.status === 403) {
          showNotification(
            "error",
            "You do not have permission to change this password."
          );
        } else if (error.response.status === 404) {
          showNotification("error", "Profile not found.");
        } else if (error.response.status === 400) {
          showNotification(
            "error",
            error.response.data.message || "Bad request: Invalid data provided."
          );
        } else {
          showNotification(
            "error",
            error.response.data.message ||
              "Failed to change password. Please try again."
          );
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        showNotification(
          "error",
          "Unable to connect to server. Please try again."
        );
      } else {
        showNotification(
          "error",
          error.message || "Failed to change password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-pink-700 text-white rounded-md hover:bg-pink-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4">
          <h1 className="text-white text-xl font-bold">Change Password</h1>
          <p className="text-pink-100 text-sm">Update your password securely</p>
        </div>

        {notification.show && (
          <div
            className={`px-6 py-3 mb-4 flex items-center ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <div className="relative">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters
                </p>
              </div>

              <div className="mt-6 relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-6 py-2 bg-pink-700 text-white rounded-md hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Changing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
