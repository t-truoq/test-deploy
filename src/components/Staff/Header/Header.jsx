"use client";

import axios from "axios";
import {
  AlertCircle,
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
    role: "Loading...",
  }); // Default to loading states
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Xử lý click ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-toggle")) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Gọi API để lấy thông tin người dùng từ token
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        navigate("/");
        return;
      }

      try {
        console.log("Fetching user profile with token:", token);
        const response = await axios.get(
          "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("User profile response:", response.data);

        if (response.data) {
          const { name, role } = response.data; // Directly access name and role from response.data
          setUserInfo({
            name: name || "User",
            role: role || "Guest",
          });
        } else {
          setError("Failed to fetch user profile: Invalid response data.");
          console.log("Invalid response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Status:", error.response.status);
          setError(
            error.response.data.message ||
              `Failed to fetch user profile (Status: ${error.response.status})`
          );
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          setError(
            "Cannot connect to the server. Please check if the server is running."
          );
        } else {
          console.log("Error setting up request:", error.message);
          setError("An unexpected error occurred. Please try again.");
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Hàm điều hướng
  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  return (
    <header className="flex items-center justify-end border-b border-gray-200 bg-white px-8 py-2">
      {/* Notifications and Profile */}
      <div className="flex items-center gap-6">
        {/* Hiển thị lỗi nếu có */}
        {error && <div className="text-red-500 text-sm mr-4">{error}</div>}

        <div className="relative">
          <button
            className="dropdown-toggle rounded-md p-2 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationOpen(!isNotificationOpen);
              setIsDropdownOpen(false);
            }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
              <div className="px-4 py-2">
                <h3 className="font-medium text-gray-900">Notification</h3>
              </div>

              <div className="mt-2 space-y-1">
                <button className="flex w-full items-start gap-3 px-4 py-2 hover:bg-gray-50">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-700">Settings</span>
                    <span className="text-xs text-gray-500">
                      Update Dashboard
                    </span>
                  </div>
                </button>

                <button className="flex w-full items-start gap-3 px-4 py-2 hover:bg-gray-50">
                  <div className="rounded-full bg-pink-100 p-2">
                    <Calendar className="h-4 w-4 text-pink-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-700">Event Update</span>
                    <span className="text-xs text-gray-500">
                      An event date update again
                    </span>
                  </div>
                </button>

                <button className="flex w-full items-start gap-3 px-4 py-2 hover:bg-gray-50">
                  <div className="rounded-full bg-purple-100 p-2">
                    <UserCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-700">Profile</span>
                    <span className="text-xs text-gray-500">
                      Update your profile
                    </span>
                  </div>
                </button>

                <button className="flex w-full items-start gap-3 px-4 py-2 hover:bg-gray-50">
                  <div className="rounded-full bg-red-100 p-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-700">
                      Application Error
                    </span>
                    <span className="text-xs text-gray-500">
                      Check Your running application
                    </span>
                  </div>
                </button>
              </div>

              <div className="mt-2 border-t border-gray-100 px-4 py-2">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  See all notification
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="dropdown-toggle flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationOpen(false);
            }}
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {userInfo.name}
              </span>
              <span className="text-xs text-gray-500">{userInfo.role}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => handleNavigation("/logout")}
              >
                <LogOut className="h-4 w-4 text-blue-500" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
