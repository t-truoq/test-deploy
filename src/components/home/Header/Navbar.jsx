"use client";

import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
  Menu,
  X,
  Settings,
  LogOut,
  Heart,
  ShoppingBag,
  UserCircle,
  Globe,
  Bell,
} from "lucide-react";
import axios from "axios";

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem(key);
        setValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error("Error reading localStorage:", error);
        setValue(initialValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => handleStorageChange(), 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [key, initialValue]);

  return [value, setValue];
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState(null);
  const [user, setUser] = useLocalStorage("user", {
    name: "Nguyen",
    email: "user@example.com",
  });
  const [language, setLanguage] = useState("en");
  const [showNotificationMessage, setShowNotificationMessage] = useState(true);
  const [googleTranslateReady, setGoogleTranslateReady] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false); // State cho language dropdown
  const baseUrl =
    "https://a66f-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app";

  // Check login status and fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const response = await axios.get(`${baseUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });

        const userData = {
          userId: response.data.userId || null,
          email: response.data.email || "user@example.com",
          name: response.data.name || "User",
          phone: response.data.phone || "",
          address: response.data.address || "",
          role: response.data.role || "",
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          navigate("/login");
        }
      }
    };

    fetchUserProfile();
  }, [navigate, setUser, baseUrl]);

  // Mark notification as read
  const markNotificationAsRead = async (notification) => {
    if (notification.status === "read") return;

    const isTempId =
      notification.id.toString().includes(".") ||
      !Number.isInteger(Number(notification.id));
    if (isTempId) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, status: "read" } : n
        )
      );
      return;
    }

    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notification.id ? { ...n, status: "read" } : n
      )
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await axios.post(
        `${baseUrl}/api/notifications/${notification.id}/read`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
    } catch (error) {
      console.error("Error marking notification as read in database:", error);
      alert("Failed to mark notification as read. Please try again.");
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, status: "unread" } : n
        )
      );
    }
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async (retryCount = 2) => {
      try {
        setLoadingNotifications(true);
        setErrorNotifications(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorNotifications(
            "No authentication token found. Please log in."
          );
          setLoadingNotifications(false);
          return;
        }

        const response = await axios.get(`${baseUrl}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        });

        let rawData = response.data;
        let parsedData;

        if (typeof rawData === "string") {
          rawData = rawData.trim();
          if (rawData.startsWith("[")) {
            parsedData = JSON.parse(rawData);
          } else {
            throw new Error("Response is not a JSON array string");
          }
        } else if (Array.isArray(rawData)) {
          parsedData = rawData;
        } else if (typeof rawData === "object" && rawData !== null) {
          parsedData = [rawData];
        } else {
          throw new Error("Unexpected response format");
        }

        const processedNotifications = parsedData.map((item) => ({
          id:
            item.id ||
            `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          message: item.message || "New Notification",
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Unknown time",
          createdAt: item.createdAt,
          status: item.read ? "read" : "unread",
        }));

        const sortedNotifications = processedNotifications.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (retryCount > 0 && error.code === "ECONNABORTED") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return fetchNotifications(retryCount - 1);
        }
        setErrorNotifications(
          error.message ||
            "Failed to fetch notifications. Check server or network."
        );
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn, baseUrl]);

  // Auto-hide notification message
  useEffect(() => {
    if (notifications.some((n) => n.status === "unread")) {
      setShowNotificationMessage(true);
      const timer = setTimeout(() => {
        setShowNotificationMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Google Translate setup
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,vi",
            autoDisplay: false,
          },
          "google_translate_element"
        );

        const waitForGoogleTranslate = setInterval(() => {
          const translateElement = document.querySelector(".goog-te-combo");
          if (translateElement) {
            setGoogleTranslateReady(true);
            clearInterval(waitForGoogleTranslate);

            const savedLanguage = localStorage.getItem("selectedLanguage");
            if (savedLanguage) {
              changeLanguage(savedLanguage);
            }
          }
        }, 100);
      };
    };

    if (!window.googleTranslateElementInit) {
      addGoogleTranslateScript();
    }

    // Điều chỉnh padding-top cho body khi thanh Google Translate hiển thị
    const adjustBodyPadding = () => {
      const translateBanner = document.querySelector(".goog-te-banner-frame");
      if (translateBanner) {
        const bannerHeight = translateBanner.offsetHeight || 40; // Chiều cao mặc định nếu không lấy được
        document.body.style.paddingTop = `${bannerHeight}px`;
      }
    };

    // Quan sát DOM để phát hiện khi thanh Google Translate được thêm vào
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const translateBanner = document.querySelector(".goog-te-banner-frame");
        if (translateBanner) {
          adjustBodyPadding();
          observer.disconnect(); // Ngắt kết nối sau khi điều chỉnh
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.body.style.paddingTop = "0px"; // Reset padding khi component unmount
    };
  }, []);

  const changeLanguage = (lang) => {
    const translateElement = document.querySelector(".goog-te-combo");
    if (translateElement) {
      translateElement.value = lang;
      translateElement.dispatchEvent(new Event("change"));
    }
    setLanguage(lang);
    localStorage.setItem("selectedLanguage", lang); // Lưu ngôn ngữ đã chọn
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ name: "User", email: "user@example.com" });
    setIsLoggedIn(false);
    setShowLogoutPopup(false);
    setShowSidebar(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-container")
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 w-full bg-white shadow-sm border-b border-pink-100 transition-all duration-300 ${
          scrolled ? "h-16 shadow-md" : "h-20"
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="home/logo/logo.webp"
              alt="Beauty Logo"
              onError={(e) => {
                console.error("Image failed to load:", e);
                e.target.style.display = "none";
              }}
              className={`transition-all duration-300 ${
                scrolled ? "h-10" : "h-12"
              } w-auto`}
            />
            <span
              className={`text-pink-600 font-bold tracking-tight transition-all duration-300 ${
                scrolled ? "text-xl" : "text-2xl"
              }`}
            >
              BEAUTYA
            </span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:space-x-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/specialist"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
                }`
              }
            >
              Specialist
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
                }`
              }
            >
              Services
            </NavLink>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center text-gray-700 hover:text-pink-600"
              >
                <Bell
                  className={`w-5 h-5 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`}
                />
                {notifications.some((n) => n.status === "unread") && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5 notifications-container">
                  {loadingNotifications && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Loading notifications...
                    </div>
                  )}
                  {errorNotifications && (
                    <div className="px-4 py-2 text-sm text-red-500">
                      {errorNotifications}
                    </div>
                  )}
                  {!loadingNotifications &&
                    !errorNotifications &&
                    notifications.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No notifications available
                      </div>
                    )}
                  {!loadingNotifications &&
                    !errorNotifications &&
                    notifications.length > 0 && (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() =>
                                markNotificationAsRead(notification)
                              }
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                                notification.status === "unread"
                                  ? "bg-pink-50"
                                  : ""
                              }`}
                            >
                              <p
                                className={`text-sm text-gray-900 ${
                                  notification.status === "unread"
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-100">
                          <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                            View all notifications
                          </button>
                        </div>
                      </>
                    )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center text-gray-700 hover:text-pink-600"
              >
                <Globe
                  className={`w-5 h-5 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`}
                />
                {language === "en" ? "English" : "Tiếng Việt"}
                <ChevronDown
                  className={`ml-1 w-4 h-4 ${scrolled ? "w-3 h-3" : "w-4 h-4"}`}
                />
              </button>

              {showLanguages && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 language-dropdown">
                  <button
                    onClick={() => {
                      changeLanguage("en");
                      setShowLanguages(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage("vi");
                      setShowLanguages(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600"
              >
                <UserCircle
                  className={`w-6 h-6 ${scrolled ? "w-5 h-5" : "w-6 h-6"}`}
                />
                <span>{user?.name?.split(" ")[0] || "Nguyen"}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className={`bg-pink-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-pink-700 transition-all duration-300 shadow-sm ${
                  scrolled ? "text-sm px-4 py-2" : "text-base px-5 py-2.5"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {showMobileMenu ? (
                <X
                  className={`block transition-all duration-300 ${
                    scrolled ? "h-6 w-6" : "h-7 w-7"
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  className={`block transition-all duration-300 ${
                    scrolled ? "h-6 w-6" : "h-7 w-7"
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20 w-full"></div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          showMobileMenu ? "block" : "hidden"
        } w-full absolute bg-white shadow-lg transition-all duration-300 ease-in-out`}
        style={{ zIndex: 999 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium w-full ${
                isActive
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium w-full ${
                isActive
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium w-full ${
                isActive
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Blog
          </NavLink>
          <NavLink
            to="/specialist"
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium w-full ${
                isActive
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Specialist
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `block px-3 py-3 rounded-md text-base font-medium w-full ${
                isActive
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            Services
          </NavLink>
          <div className="px-3 py-3 w-full">
            <div className="flex flex-col space-y-2 w-full">
              <span className="text-sm font-medium text-gray-500">
                Language
              </span>
              <div className="flex space-x-2 w-full">
                <button
                  onClick={() => {
                    changeLanguage("en");
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    language === "en"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    changeLanguage("vi");
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    language === "vi"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tiếng Việt
                </button>
              </div>
            </div>
          </div>
          <div className="px-3 py-3 w-full">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                setShowNotifications(!showNotifications);
              }}
              className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium relative"
            >
              <Bell
                className={`w-5 h-5 transition-all duration-300 ${
                  scrolled ? "w-4 h-4" : "w-5 h-5"
                }`}
              />
              {notifications.some((n) => n.status === "unread") && (
                <>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                  {showNotificationMessage && (
                    <div className="absolute top-6 right-0 bg-pink-600 text-white text-xs py-1 px-2 rounded shadow-md whitespace-nowrap animate-fadeIn">
                      <div className="absolute top-0 right-3 transform -translate-y-1/2 w-2 h-2 bg-pink-600 rotate-45"></div>
                      You have a new notification!
                    </div>
                  )}
                </>
              )}
            </button>
          </div>
          {isLoggedIn ? (
            <div className="px-3 py-3 w-full">
              <button
                onClick={() => {
                  toggleSidebar();
                  setShowMobileMenu(false);
                }}
                className="flex items-center space-x-2 text-pink-600 font-medium w-full py-2"
              >
                <UserCircle className="w-5 h-5" />
                <span>My Profile</span>
              </button>
            </div>
          ) : (
            <div className="px-3 py-3 w-full">
              <Link
                to="/login"
                className="block w-full text-center bg-pink-600 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-pink-700"
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Sidebar */}
      {isLoggedIn && (
        <>
          {showSidebar && (
            <div
              className="fixed top-20 bottom-0 left-0 right-0 bg-black bg-opacity-50 transition-opacity z-40"
              onClick={toggleSidebar}
            ></div>
          )}

          <div
            className={`fixed top-20 bottom-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-6 w-full">
              <div className="flex items-center justify-between mb-6 w-full">
                <h2 className="text-xl font-bold text-gray-900">My Account</h2>
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 w-full">
                <div className="flex items-center space-x-4 w-full">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-full">
                    <UserCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-auto">
                    <h3 className="text-lg font-medium text-gray-900">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1 w-full">
                <Link
                  to="/profile"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full"
                  onClick={() => setShowSidebar(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Edit Profile
                </Link>
                <Link
                  to="/mybooking"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full"
                  onClick={() => setShowSidebar(false)}
                >
                  <ShoppingBag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  My Bookings
                </Link>
                <Link
                  to="/wishlist"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full"
                  onClick={() => setShowSidebar(false)}
                >
                  <Heart className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Wishlist
                </Link>
                <Link
                  to="/myskintype"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full"
                  onClick={() => setShowSidebar(false)}
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  My Skin Type
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Do you want to logout?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-800 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
};

// Add animation styles (moved to CSS file or styled-components for better React integration)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Thay bằng cách thêm CSS vào file riêng hoặc dùng styled-components
// Ví dụ: Tạo file styles.css và import
// import './styles.css';

export default Navbar;
