"use client";

import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  ClipboardList,
  Calendar,
  Contact,
  FileText,
  LogOut,
  MessageCircleWarning,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token và thông tin user từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Chuyển hướng về trang home
    navigate('/');
  };

  const mainNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/home" },
    { name: "Services", icon: ListChecks, path: "/admin/services" },
    { name: "Order Lists", icon: ClipboardList, path: "/admin/orderlists" },
    { name: "Feedback", icon: MessageCircleWarning, path: "/admin/feedback" },
  ];

  const pages = [
    { name: "Calendar", icon: Calendar, path: "/admin/calendar" },
    { name: "Contact", icon: Contact, path: "/admin/contact" },
    { name: "Invoice", icon: FileText, path: "/admin/invoice" },
    { 
      name: "Logout", 
      icon: LogOut, 
      path: "/",
      onClick: handleLogout 
    },
  ];

  return (
    <div className="sidebar">
      {/* Logo - Updated to link to dashboard */}
      <Link
        to="/admin/home"
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
      <nav className="sidebar-nav">
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              to={item.path}
              key={item.name}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Icon className="sidebar-icon" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Pages Section */}
      <div className="sidebar-pages">
        <h2>PAGES</h2>
        <nav>
          {pages.map((item) => {
            const Icon = item.icon;
            return item.name === "Logout" ? (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`sidebar-link w-full text-left ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <Icon className="sidebar-icon" />
                {item.name}
              </button>
            ) : (
              <Link
                to={item.path}
                key={item.name}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <Icon className="sidebar-icon" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
