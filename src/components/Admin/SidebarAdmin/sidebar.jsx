"use client";

import { useState } from "react"; // Add useState for managing collapse state
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  ClipboardList,
  Contact,
  FileText,
  MessageCircleWarning,
  FileQuestion,
  Menu, // Add Menu icon for toggle button
  ChevronLeft, // Add ChevronLeft for collapse/expand indication
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse

  const mainNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/home" },
    { name: "Services", icon: ListChecks, path: "/admin/services" },
    { name: "Order Lists", icon: ClipboardList, path: "/admin/orderlists" },
    { name: "Feedback", icon: MessageCircleWarning, path: "/admin/feedback" },
    { name: "Questions", icon: FileQuestion, path: "/admin/questions" },
  ];

  const pages = [
    {
      name: "Customers Management",
      icon: Contact,
      path: "/admin/customersmanagement",
    },
    {
      name: "Staff Management",
      icon: Contact,
      path: "/admin/staffsmanagement",
    },
    {
      name: "Skin Therapist Management",
      icon: Contact,
      path: "/admin/skintherapisttmanagement",
    },
    {
      name: "Payment Management",
      icon: FileText,
      path: "/admin/paymentmanagement",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen bg-white border-r border-gray-200 p-4 flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between">
        {/* Logo - Updated to link to dashboard */}
        <Link
          to="/admin/home"
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
                location.pathname === item.path
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

      {/* Pages Section */}
      <div className={isCollapsed ? "mt-4" : "mt-8"}>
        <h2
          className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          PAGES
        </h2>
        <nav className="flex flex-col gap-1">
          {pages.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to={item.path}
                key={item.name}
                className={`flex items-center w-full p-2 text-sm rounded-lg transition-all duration-300 ease-in-out hover:bg-pink-100 hover:text-pink-700 hover:scale-105 ${
                  location.pathname === item.path
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
    </div>
  );
}
