"use client";

import { useLocation } from "react-router-dom";
import { Calendar, Users, Clock, MessageCircleWarning } from "lucide-react";
import { Link } from "react-router-dom";

export default function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const isStaffRoute = pathname.startsWith("/staff");

  const mainNav = isStaffRoute
    ? [
        { name: "Appointments", icon: Calendar, path: "/staff/home" },
        { name: "Clients", icon: Users, path: "/staff/clients" },
        { name: "Skin therapist", icon: Users, path: "/staff/skintherapist" },
        { name: "Staff Schedule", icon: Clock, path: "/staff/schedule" },
        {
          name: "Feedback",
          icon: MessageCircleWarning,
          path: "/staff/feedback",
        },
      ]
    : [];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Logo */}
      <Link
        to="/staff/home"
        className="flex items-center text-pink-700 font-bold text-xl uppercase"
      >
        <img
          src="/public/home/logo/logo.webp"
          alt="Beauty Logo"
          className="h-10 mr-2"
        />
        BEAUTYA
      </Link>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 mt-8">
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
              <Icon className="w-5 h-5 mr-3 transition-transform duration-200 ease-in-out hover:rotate-10" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
