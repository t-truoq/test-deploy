"use client";

import axios from "axios";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SKHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
    role: "Loading...",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("User profile response:", response.data);

        if (response.data) {
          const { name, role } = response.data;
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  return (
    <header className="flex items-center justify-end border-b border-gray-200 bg-white px-8 py-2">
      <div className="flex items-center gap-6">
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
                <h3 className="font-medium text-gray-900">Notifications</h3>
              </div>
              {/* Notification items remain unchanged */}
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
