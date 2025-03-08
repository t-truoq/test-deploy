// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   User,
//   ChevronDown,
//   Menu,
//   X,
//   Settings,
//   LogOut,
//   Heart,
//   ShoppingBag,
//   UserCircle,
// } from "lucide-react";
// import axios from "axios";

// // Custom hook để lắng nghe sự thay đổi của localStorage
// const useLocalStorage = (key, initialValue) => {
//   const [value, setValue] = useState(() => {
//     try {
//       const item = localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (error) {
//       console.error("Error reading localStorage:", error);
//       return initialValue;
//     }
//   });

//   useEffect(() => {
//     const handleStorageChange = () => {
//       try {
//         const item = localStorage.getItem(key);
//         setValue(item ? JSON.parse(item) : initialValue);
//       } catch (error) {
//         console.error("Error reading localStorage:", error);
//         setValue(initialValue);
//       }
//     };

//     // Lắng nghe sự kiện storage (khi localStorage thay đổi)
//     window.addEventListener("storage", handleStorageChange);

//     // Lắng nghe thay đổi thủ công (khi localStorage thay đổi trong cùng tab)
//     const interval = setInterval(() => {
//       handleStorageChange();
//     }, 1000); // Kiểm tra mỗi 1 giây

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       clearInterval(interval);
//     };
//   }, [key, initialValue]);

//   return [value, setValue];
// };

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [language, setLanguage] = useState("en"); // Default language is English
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Login status
//   const [showSidebar, setShowSidebar] = useState(false); // Sidebar state
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Logout confirmation popup
//   const [showMobileMenu, setShowMobileMenu] = useState(false); // Mobile menu state
//   const [user, setUser] = useLocalStorage("user", {
//     name: "User",
//     email: "user@example.com",
//   }); // Hook lắng nghe localStorage

//   // Check login status and fetch user profile when component mounts
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setIsLoggedIn(false);
//           return;
//         }

//         const response = await axios.get(
//           "https://6bc4-2405-4802-8132-b860-d454-d4f4-c346-cd13.ngrok-free.app/api/users/profile",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Fetch user profile response:", response.data);

//         const userData = {
//           userId: response.data.userId || null,
//           email: response.data.email || "user@example.com",
//           name: response.data.name || "User",
//           phone: response.data.phone || "",
//           address: response.data.address || "",
//           role: response.data.role || "",
//         };

//         // Lưu thông tin user vào localStorage
//         localStorage.setItem("user", JSON.stringify(userData));
//         setUser(userData);
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           setIsLoggedIn(false);
//           navigate("/login");
//         }
//       }
//     };

//     fetchUserProfile();
//   }, [navigate, setUser]);

//   // Google Translate
//   useEffect(() => {
//     const addGoogleTranslateScript = () => {
//       const script = document.createElement("script");
//       script.src =
//         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       document.body.appendChild(script);

//       window.googleTranslateElementInit = () => {
//         new window.google.translate.TranslateElement(
//           {
//             pageLanguage: "en",
//             includedLanguages: "en,vi",
//             autoDisplay: false,
//           },
//           "google_translate_element"
//         );
//       };
//     };

//     if (!window.googleTranslateElementInit) {
//       addGoogleTranslateScript();
//     }
//   }, []);

//   const changeLanguage = (lang) => {
//     const translateElement = document.querySelector(".goog-te-combo");
//     if (translateElement) {
//       translateElement.value = lang;
//       translateElement.dispatchEvent(new Event("change"));
//     }
//     setLanguage(lang);
//     setShowDropdown(false);
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar);
//   };

//   const handleLogout = () => {
//     setShowLogoutPopup(true);
//   };

//   const confirmLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser({ name: "User", email: "user@example.com" });
//     setIsLoggedIn(false);
//     setShowLogoutPopup(false);
//     setShowSidebar(false);
//     navigate("/");
//   };

//   const cancelLogout = () => {
//     setShowLogoutPopup(false);
//   };

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
//         <div className="container mx-auto flex justify-between items-center px-4">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="flex items-center text-pink-700 font-bold text-xl uppercase"
//           >
//             <img
//               src="home/logo/logo.webp"
//               alt="Beauty Logo"
//               className="h-10 mr-2"
//             />
//             BEAUTYA
//           </Link>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden text-gray-700 text-2xl focus:outline-none"
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//           >
//             {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           {/* Menu items */}
//           <div
//             className={`lg:flex lg:space-x-6 lg:items-center ${
//               showMobileMenu
//                 ? "absolute top-16 left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 z-50"
//                 : "hidden"
//             }`}
//           >
//             <NavLink
//               className="text-gray-700 font-medium hover:text-pink-700"
//               to="/"
//             >
//               Home
//             </NavLink>
//             <NavLink
//               className="text-gray-700 font-medium hover:text-pink-700"
//               to="/about"
//             >
//               About
//             </NavLink>
//             <NavLink
//               className="text-gray-700 font-medium hover:text-pink-700"
//               to="/blog"
//             >
//               Blog
//             </NavLink>
//             <NavLink
//               className="text-gray-700 font-medium hover:text-pink-700"
//               to="/therapist"
//             >
//               Therapist
//             </NavLink>
//             <NavLink
//               className="text-gray-700 font-medium hover:text-pink-700"
//               to="/services"
//             >
//               Services
//             </NavLink>

//             {/* Language Dropdown Custom */}
//             <div className="relative">
//               <button
//                 onClick={toggleDropdown}
//                 className="text-gray-700 font-medium hover:text-pink-700 flex items-center"
//               >
//                 {language === "en" ? "US (EN)" : "VN (VI)"}
//                 <ChevronDown className="ml-1 w-4 h-4" />
//               </button>
//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
//                   <button
//                     onClick={() => changeLanguage("en")}
//                     className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
//                   >
//                     US (EN)
//                   </button>
//                   <button
//                     onClick={() => changeLanguage("vi")}
//                     className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
//                   >
//                     VN (VI)
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Hidden Google Translate Widget */}
//             <div id="google_translate_element" className="hidden"></div>

//             {/* User Profile / Login Button */}
//             {isLoggedIn ? (
//               <button
//                 onClick={toggleSidebar}
//                 className="flex items-center space-x-1 text-gray-700 hover:text-pink-700"
//               >
//                 <User size={20} />
//                 <span>My Profile</span>
//               </button>
//             ) : (
//               <Link
//                 to="/login"
//                 className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Shop Cart Icon */}
//             {/* <CartButton /> */}
//           </div>
//         </div>
//       </nav>

//       {/* User Profile Sidebar */}
//       {isLoggedIn && (
//         <div
//           className={`fixed inset-0 z-50 ${showSidebar ? "block" : "hidden"}`}
//         >
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={toggleSidebar}
//           ></div>

//           {/* Sidebar */}
//           <div
//             className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
//               showSidebar ? "translate-x-0" : "translate-x-full"
//             }`}
//           >
//             {/* Sidebar Header */}
//             <div className="flex justify-between items-center p-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-pink-700">
//                 My Profile
//               </h2>
//               <button
//                 onClick={toggleSidebar}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* User Info */}
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-pink-100 p-3 rounded-full">
//                   <UserCircle size={40} className="text-pink-700" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium">{user?.name || "User"}</h3>
//                   <p className="text-sm text-gray-500">
//                     {user?.email || "user@example.com"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar Menu */}
//             <div className="py-4">
//               <Link
//                 to="/profile"
//                 className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
//               >
//                 <User size={20} className="mr-3" />
//                 <span>Edit Profile</span>
//               </Link>
//               <Link
//                 to="/mybooking"
//                 className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
//               >
//                 <ShoppingBag size={20} className="mr-3" />
//                 <span>My Booking </span>
//               </Link>
//               <Link
//                 to="/wishlist"
//                 className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
//               >
//                 <Heart size={20} className="mr-3" />
//                 <span>Wishlist</span>
//               </Link>
//               <Link
//                 to="/myskintype"
//                 className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
//               >
//                 <Settings size={20} className="mr-3" />
//                 <span>My Type Skin</span>
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center w-full px-6 py-3 hover:bg-pink-50 text-gray-700"
//               >
//                 <LogOut size={20} className="mr-3" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Logout Confirmation Popup */}
//       {showLogoutPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fade-in">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
//               Do you want to logout?
//             </h3>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={confirmLogout}
//                 className="bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-800 transition-colors"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setShowLogoutPopup(false)}
//                 className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Navbar;


"use client"

import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import axios from "axios"
import { User, ChevronDown, Menu, X, Settings, LogOut, Heart, ShoppingBag, UserCircle, Globe } from "lucide-react"

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error reading localStorage:", error)
      return initialValue
    }
  })

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem(key)
        setValue(item ? JSON.parse(item) : initialValue)
      } catch (error) {
        console.error("Error reading localStorage:", error)
        setValue(initialValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    const interval = setInterval(() => {
      handleStorageChange()
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [key, initialValue])

  return [value, setValue]
}

const Navbar = () => {
  const navigate = useNavigate()
  const [language, setLanguage] = useState("en")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [user, setUser] = useLocalStorage("user", {
    name: "User",
    email: "user@example.com",
  })

  // Check login status and fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoggedIn(false)
          return
        }

        const response = await axios.get("https://6bc4-2405-4802-8132-b860-d454-d4f4-c346-cd13.ngrok-free.app/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        })

        const userData = {
          userId: response.data.userId || null,
          email: response.data.email || "user@example.com",
          name: response.data.name || "User",
          phone: response.data.phone || "",
          address: response.data.address || "",
          role: response.data.role || "",
        }

        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setIsLoggedIn(false)
          navigate("/login")
        }
      }
    }

    fetchUserProfile()
  }, [navigate, setUser])

  // Google Translate
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script")
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,vi",
            autoDisplay: false,
          },
          "google_translate_element",
        )
      }
    }

    if (!window.googleTranslateElementInit) {
      addGoogleTranslateScript()
    }
  }, [])

  const changeLanguage = (lang) => {
    const translateElement = document.querySelector(".goog-te-combo")
    if (translateElement) {
      translateElement.value = lang
      translateElement.dispatchEvent(new Event("change"))
    }
    setLanguage(lang)
    setShowDropdown(false)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const handleLogout = () => {
    setShowLogoutPopup(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser({ name: "User", email: "user@example.com" })
    setIsLoggedIn(false)
    setShowLogoutPopup(false)
    setShowSidebar(false)
    navigate("/")
  }

  return (
    <div className="relative z-50">
      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b border-pink-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="home/logo/logo.webp" alt="Beauty Logo" className="h-10" />
              <span className="text-pink-600 font-bold text-xl tracking-tight">BEAUTYA</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                      : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600 pb-1"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                      : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600 pb-1"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                      : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600 pb-1"
                  }`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/specialist"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                      : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600 pb-1"
                  }`
                }
              >
                Specialist
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                      : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600 pb-1"
                  }`
                }
              >
                Services
              </NavLink>
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 hover:text-pink-600 text-sm font-medium"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  {language === "en" ? "English" : "Tiếng Việt"}
                  <ChevronDown className="ml-1 w-3 h-3" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => changeLanguage("en")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("vi")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                    >
                      Tiếng Việt
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden Google Translate Element */}
              <div id="google_translate_element" className="hidden"></div>

              {/* User Profile / Login Button */}
              {isLoggedIn ? (
                <button
                  onClick={toggleSidebar}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 text-sm font-medium"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>{user?.name?.split(" ")[0] || "User"}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors shadow-sm"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden ${showMobileMenu ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/therapist"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
            >
              Therapist
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
            >
              Services
            </NavLink>

            {/* Language Selector Mobile */}
            <div className="px-3 py-2">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-500">Language</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      language === "en" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("vi")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      language === "vi" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                </div>
              </div>
            </div>

            {/* Login/Profile Mobile */}
            <div className="px-3 py-2">
              {isLoggedIn ? (
                <button onClick={toggleSidebar} className="flex items-center space-x-2 text-pink-600 font-medium">
                  <UserCircle className="w-5 h-5" />
                  <span>My Profile</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-pink-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-pink-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile Sidebar */}
      {isLoggedIn && (
        <>
          {/* Backdrop */}
          {showSidebar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40" onClick={toggleSidebar}></div>
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Account</h2>
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-full">
                    <UserCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user?.name || "User"}</h3>
                    <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                <Link
                  to="/profile"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  onClick={() => setShowSidebar(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Edit Profile
                </Link>

                <Link
                  to="/mybooking"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  onClick={() => setShowSidebar(false)}
                >
                  <ShoppingBag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  My Bookings
                </Link>

                <Link
                  to="/wishlist"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  onClick={() => setShowSidebar(false)}
                >
                  <Heart className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Wishlist
                </Link>

                <Link
                  to="/myskintype"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
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

      {/* Logout Confirmation Modal */}
      {showLogoutPopup && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowLogoutPopup(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmLogout}
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar

