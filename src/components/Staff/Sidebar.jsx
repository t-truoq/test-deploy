"use client";

import { useState } from "react"; // Add useState for managing collapse state
import { useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  MessageCircleWarning,
  Contact,
  FileText,
  Menu, // Add Menu icon for toggle button
  ChevronLeft, // Add ChevronLeft for collapse/expand indication
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse

  const isStaffRoute = pathname.startsWith("/staff");

  const mainNav = isStaffRoute
    ? [
        { name: "Appointments", icon: Calendar, path: "/staff/home" },
        { name: "Manager Schedule", icon: Clock, path: "/staff/schedule" },
        {
          name: "Payment Management",
          icon: FileText,
          path: "/staff/paymentmanagement",
        },
        { name: "Customers", icon: Users, path: "/staff/clients" },
        { name: "Skin therapist", icon: Users, path: "/staff/skintherapist" },
        { name: "Contact", icon: Contact, path: "/staff/contact" },
        {
          name: "Feedback",
          icon: MessageCircleWarning,
          path: "/staff/feedback",
        },
      ]
    : [];

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
        {/* Logo */}
        <Link
          to="/staff/home"
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
