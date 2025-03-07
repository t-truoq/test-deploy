"use client";

import { useState } from "react";
import { Shield, AlertCircle, ArrowLeft } from "lucide-react";

export function ChangePassword() {
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordInfoChange = (field, value) => {
    setPasswordInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Password updated successfully!");
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      alert("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto py-10">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="text-center space-y-2">
                <div className="mx-auto bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold">Change Password</h1>
                <p className="text-sm text-gray-500">
                  Update your account password to keep your account secure
                </p>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Password Requirements
                    </h3>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                      <li>At least 8 characters long</li>
                      <li>Must include uppercase and lowercase letters</li>
                      <li>Must include at least one number</li>
                      <li>Must include at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter your current password"
                    value={passwordInfo.currentPassword}
                    onChange={(e) =>
                      handlePasswordInfoChange(
                        "currentPassword",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter your new password"
                    value={passwordInfo.newPassword}
                    onChange={(e) =>
                      handlePasswordInfoChange("newPassword", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Confirm your new password"
                    value={passwordInfo.confirmPassword}
                    onChange={(e) =>
                      handlePasswordInfoChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
