"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  MessageCircleWarning,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SKsidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse

  const isStaffRoute = pathname.startsWith("/skintherapist");

  const mainNav = isStaffRoute
    ? [
        { name: "Schedule", icon: Calendar, path: "/skintherapist/home" },
        {
          name: "Feedback",
          icon: MessageCircleWarning,
          path: "/skintherapist/feedback",
        },
        { name: "Profile", icon: Users, path: "/skintherapist/profile" },
      ]
    : [];

  const toggleSidebar = () => {
    console.log("Toggle button clicked. isCollapsed:", isCollapsed); // Debug log
    setIsCollapsed((prev) => {
      const newState = !prev;
      console.log("New isCollapsed state:", newState); // Debug log
      return newState;
    });
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen bg-white border-r border-gray-200 p-4 flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/skintherapist/home"
          className={`${
            isCollapsed ? "hidden" : "flex"
          } items-center text-pink-700 font-bold text-xl uppercase`}
        >
          <img
            src="/home/logo/logo.webp"
            alt="Beauty Logo"
            className="h-10 mr-2"
          />
          BEAUTYA
        </Link>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-pink-100 focus:outline-none transition-colors duration-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} // Accessibility
        >
          {isCollapsed ? (
            <Menu className="w-6 h-6 text-pink-700" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-pink-700" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`flex flex-col gap-1 ${isCollapsed ? "mt-4" : "mt-8"}`}>
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              to={item.path}
              key={item.name}
              className={`flex items-center w-full p-2 text-sm rounded-lg transition-all duration-300 ease-in-out hover:bg-pink-100 hover:text-pink-700 hover:scale-105 ${
                pathname === item.path
                  ? "bg-pink-50 text-pink-700 font-semibold scale-[1.08] shadow-md shadow-pink-700/15"
                  : "text-gray-600"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isCollapsed ? "mx-auto" : "mr-3"
                } transition-transform duration-200 ease-in-out hover:rotate-10`}
              />
              <span className={isCollapsed ? "hidden" : "block"}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
