// // import { Link, NavLink } from "react-router-dom";
// // import CartButton from "./cart/CartButton";

// // const Navbar = () => {
// //   return (
// //     <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
// //       <div className="container mx-auto flex justify-between items-center px-4">
// //         {/* Logo */}
// //         <Link to="/" className="flex items-center text-pink-700 font-bold text-xl uppercase">
// //           <img src="home/logo/logo.webp" alt="Beauty Logo" className="h-10 mr-2" />
// //           BEAUTYA
// //         </Link>

// //         {/* Mobile Menu Button */}
// //         <button className="lg:hidden text-gray-700 text-2xl focus:outline-none">
// //           <i className="bi bi-list"></i>
// //         </button>

// //         {/* Menu items */}
// //         <div className="hidden lg:flex space-x-6 items-center">
// //           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/">
// //             Home
// //           </NavLink>
// //           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/about">
// //             About
// //           </NavLink>
// //           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/blog">
// //             Blog
// //           </NavLink>
// //           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/services">
// //             Services
// //           </NavLink>
// //           {/* <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/products">
// //             Products
// //           </NavLink> */}

// //           {/* Search Bar */}
// //           {/* <form className="relative">
// //             <input
// //               type="search"
// //               className="border rounded-lg px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-400"
// //               placeholder="Search..."
// //             />
// //             <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
// //               <i className="bi bi-search"></i>
// //             </button>
// //           </form> */}

// //           {/* Language */}
// //           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/language">
// //             US (EN)
// //           </NavLink>

// //           {/* Login Button */}
// //           <Link to="/login" className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition">
// //             Login
// //           </Link>

// //           {/* Shop Cart Icon */}
// //           <CartButton/>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;
// // import { Link, NavLink } from "react-router-dom";
// // import CartButton from "./cart/CartButton";
// // import { useEffect, useState } from "react";

// // const Navbar = () => {
// //   const [language, setLanguage] = useState("en"); // Ngôn ngữ mặc định là English
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
// //   const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Hiển thị popup logout

// //   // Kiểm tra trạng thái đăng nhập khi component mount
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     setIsLoggedIn(!!token); // Nếu có token, isLoggedIn = true
// //   }, []);

// //   // Google Translate
// //   useEffect(() => {
// //     const addGoogleTranslateScript = () => {
// //       const script = document.createElement("script");
// //       script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
// //       script.async = true;
// //       document.body.appendChild(script);

// //       window.googleTranslateElementInit = () => {
// //         new window.google.translate.TranslateElement(
// //           {
// //             pageLanguage: "en",
// //             includedLanguages: "en,vi",
// //             autoDisplay: false,
// //           },
// //           "google_translate_element"
// //         );
// //       };
// //     };

// //     if (!window.googleTranslateElementInit) {
// //       addGoogleTranslateScript();
// //     }
// //   }, []);

// //   const changeLanguage = (lang) => {
// //     const translateElement = document.querySelector(".goog-te-combo");
// //     if (translateElement) {
// //       translateElement.value = lang;
// //       translateElement.dispatchEvent(new Event("change"));
// //     }
// //     setLanguage(lang);
// //     setShowDropdown(false);
// //   };

// //   const toggleDropdown = () => {
// //     setShowDropdown(!showDropdown);
// //   };

// //   const handleLogout = () => {
// //     // Hiển thị popup xác nhận logout
// //     setShowLogoutPopup(true);
// //   };

// //   const confirmLogout = () => {
// //     // Xóa token và user từ localStorage
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     setIsLoggedIn(false); // Cập nhật trạng thái
// //     setShowLogoutPopup(false); // Ẩn popup
// //     window.location.href = "/"; // Chuyển hướng về trang chủ
// //   };

// //   const cancelLogout = () => {
// //     setShowLogoutPopup(false); // Ẩn popup
// //   };

// //   return (
// //     <div>
// //       {/* Navbar */}
// //       <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
// //         <div className="container mx-auto flex justify-between items-center px-4">
// //           {/* Logo */}
// //           <Link to="/" className="flex items-center text-pink-700 font-bold text-xl uppercase">
// //             <img src="home/logo/logo.webp" alt="Beauty Logo" className="h-10 mr-2" />
// //             BEAUTYA
// //           </Link>

// //           {/* Mobile Menu Button */}
// //           <button className="lg:hidden text-gray-700 text-2xl focus:outline-none">
// //             <i className="bi bi-list"></i>
// //           </button>

// //           {/* Menu items */}
// //           <div className="hidden lg:flex space-x-6 items-center">
// //             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/">
// //               Home
// //             </NavLink>
// //             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/about">
// //               About
// //             </NavLink>
// //             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/blog">
// //               Blog
// //             </NavLink>
// //             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/services">
// //               Services
// //             </NavLink>

// //             {/* Language Dropdown Custom */}
// //             <div className="relative">
// //               <button
// //                 onClick={toggleDropdown}
// //                 className="text-gray-700 font-medium hover:text-pink-700 flex items-center"
// //               >
// //                 {language === "en" ? "US (EN)" : "VN (VI)"}
// //                 <svg
// //                   className="ml-1 w-4 h-4"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                 >
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </button>
// //               {showDropdown && (
// //                 <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
// //                   <button
// //                     onClick={() => changeLanguage("en")}
// //                     className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
// //                   >
// //                     US (EN)
// //                   </button>
// //                   <button
// //                     onClick={() => changeLanguage("vi")}
// //                     className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
// //                   >
// //                     VN (VI)
// //                   </button>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Ẩn Google Translate Widget mặc định */}
// //             <div id="google_translate_element" className="hidden"></div>

// //             {/* Login/Logout Button */}
// //             {isLoggedIn ? (
// //               <button
// //                 onClick={handleLogout}
// //                 className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition"
// //               >
// //                 Logout
// //               </button>
// //             ) : (
// //               <Link
// //                 to="/login"
// //                 className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition"
// //               >
// //                 Login
// //               </Link>
// //             )}

// //             {/* Shop Cart Icon */}
// //             <CartButton />
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Logout Confirmation Popup */}
// //       {showLogoutPopup && (
// //         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
// //           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fade-in">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
// //               Do you want to logout?
// //             </h3>
// //             <div className="flex justify-center space-x-4">
// //               <button
// //                 onClick={confirmLogout}
// //                 className="bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-800 transition-colors"
// //               >
// //                 Yes
// //               </button>
// //               <button
// //                 onClick={cancelLogout}
// //                 className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
// //               >
// //                 No
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Navbar;

// "use client"

// import { Link, NavLink } from "react-router-dom"
// import CartButton from "./cart/CartButton"
// import { useEffect, useState } from "react"
// import { User, ChevronDown, Menu, X, Settings, LogOut, Heart, ShoppingBag, UserCircle } from "lucide-react"

// const Navbar = () => {
//   const [language, setLanguage] = useState("en") // Default language is English
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [isLoggedIn, setIsLoggedIn] = useState(false) // Login status
//   const [showSidebar, setShowSidebar] = useState(false) // Sidebar state
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false) // Logout confirmation popup
//   const [showMobileMenu, setShowMobileMenu] = useState(false) // Mobile menu state

//   // Check login status when component mounts
//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     setIsLoggedIn(!!token) // If token exists, isLoggedIn = true
//   }, [])

//   // Google Translate
//   useEffect(() => {
//     const addGoogleTranslateScript = () => {
//       const script = document.createElement("script")
//       script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//       script.async = true
//       document.body.appendChild(script)

//       window.googleTranslateElementInit = () => {
//         new window.google.translate.TranslateElement(
//           {
//             pageLanguage: "en",
//             includedLanguages: "en,vi",
//             autoDisplay: false,
//           },
//           "google_translate_element",
//         )
//       }
//     }

//     if (!window.googleTranslateElementInit) {
//       addGoogleTranslateScript()
//     }
//   }, [])

//   const changeLanguage = (lang) => {
//     const translateElement = document.querySelector(".goog-te-combo")
//     if (translateElement) {
//       translateElement.value = lang
//       translateElement.dispatchEvent(new Event("change"))
//     }
//     setLanguage(lang)
//     setShowDropdown(false)
//   }

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown)
//   }

//   const toggleSidebar = () => {
//     setShowSidebar(!showSidebar)
//   }

//   const handleLogout = () => {
//     // Show logout confirmation popup
//     setShowLogoutPopup(true)
//   }

//   const confirmLogout = () => {
//     // Remove token and user from localStorage
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     setIsLoggedIn(false) // Update status
//     setShowLogoutPopup(false) // Hide popup
//     setShowSidebar(false) // Close sidebar
//     window.location.href = "/" // Redirect to home page
//   }

//   const cancelLogout = () => {
//     setShowLogoutPopup(false) // Hide popup
//   }

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
//         <div className="container mx-auto flex justify-between items-center px-4">
//           {/* Logo */}
//           <Link to="/" className="flex items-center text-pink-700 font-bold text-xl uppercase">
//             <img src="home/logo/logo.webp" alt="Beauty Logo" className="h-10 mr-2" />
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
//             className={`lg:flex lg:space-x-6 lg:items-center ${showMobileMenu ? "absolute top-16 left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 z-50" : "hidden"}`}
//           >
//             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/">
//               Home
//             </NavLink>
//             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/about">
//               About
//             </NavLink>
//             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/blog">
//               Blog
//             </NavLink>
//             <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/services">
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
//               <button onClick={toggleSidebar} className="flex items-center space-x-1 text-gray-700 hover:text-pink-700">
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
//             <CartButton />
//           </div>
//         </div>
//       </nav>

//       {/* User Profile Sidebar */}
//       {isLoggedIn && (
//         <div className={`fixed inset-0 z-50 ${showSidebar ? "block" : "hidden"}`}>
//           {/* Backdrop */}
//           <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleSidebar}></div>

//           {/* Sidebar */}
//           <div
//             className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
//           >
//             {/* Sidebar Header */}
//             <div className="flex justify-between items-center p-4 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-pink-700">My Profile</h2>
//               <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
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
//                   <h3 className="font-medium">
//                     {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name || "User" : "User"}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     {localStorage.getItem("user")
//                       ? JSON.parse(localStorage.getItem("user")).email || "user@example.com"
//                       : "user@example.com"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar Menu */}
//             <div className="py-4">
//               <Link to="/profile" className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700">
//                 <User size={20} className="mr-3" />
//                 <span>Edit Profile</span>
//               </Link>
//               <Link to="/orders" className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700">
//                 <ShoppingBag size={20} className="mr-3" />
//                 <span>My Orders</span>
//               </Link>
//               <Link to="/wishlist" className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700">
//                 <Heart size={20} className="mr-3" />
//                 <span>Wishlist</span>
//               </Link>
//               <Link to="/settings" className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700">
//                 <Settings size={20} className="mr-3" />
//                 <span>Settings</span>
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
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Do you want to logout?</h3>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={confirmLogout}
//                 className="bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-800 transition-colors"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={cancelLogout}
//                 className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Navbar

"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import axios from "axios";

// Custom hook để lắng nghe sự thay đổi của localStorage
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

    // Lắng nghe sự kiện storage (khi localStorage thay đổi)
    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe thay đổi thủ công (khi localStorage thay đổi trong cùng tab)
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000); // Kiểm tra mỗi 1 giây

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [key, initialValue]);

  return [value, setValue];
};

const Navbar = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en"); // Default language is English
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login status
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Logout confirmation popup
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Mobile menu state
  const [user, setUser] = useLocalStorage("user", {
    name: "User",
    email: "user@example.com",
  }); // Hook lắng nghe localStorage

  // Check login status and fetch user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch user profile response:", response.data);

        const userData = {
          userId: response.data.userId || null,
          email: response.data.email || "user@example.com",
          name: response.data.name || "User",
          phone: response.data.phone || "",
          address: response.data.address || "",
          role: response.data.role || "",
        };

        // Lưu thông tin user vào localStorage
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
  }, [navigate, setUser]);

  // Google Translate
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
      };
    };

    if (!window.googleTranslateElementInit) {
      addGoogleTranslateScript();
    }
  }, []);

  const changeLanguage = (lang) => {
    const translateElement = document.querySelector(".goog-te-combo");
    if (translateElement) {
      translateElement.value = lang;
      translateElement.dispatchEvent(new Event("change"));
    }
    setLanguage(lang);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({ name: "User", email: "user@example.com" });
    setIsLoggedIn(false);
    setShowLogoutPopup(false);
    setShowSidebar(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-pink-700 font-bold text-xl uppercase"
          >
            <img
              src="home/logo/logo.webp"
              alt="Beauty Logo"
              className="h-10 mr-2"
            />
            BEAUTYA
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 text-2xl focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Menu items */}
          <div
            className={`lg:flex lg:space-x-6 lg:items-center ${
              showMobileMenu
                ? "absolute top-16 left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 z-50"
                : "hidden"
            }`}
          >
            <NavLink
              className="text-gray-700 font-medium hover:text-pink-700"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className="text-gray-700 font-medium hover:text-pink-700"
              to="/about"
            >
              About
            </NavLink>
            <NavLink
              className="text-gray-700 font-medium hover:text-pink-700"
              to="/blog"
            >
              Blog
            </NavLink>
            <NavLink
              className="text-gray-700 font-medium hover:text-pink-700"
              to="/services"
            >
              Services
            </NavLink>

            {/* Language Dropdown Custom */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-gray-700 font-medium hover:text-pink-700 flex items-center"
              >
                {language === "en" ? "US (EN)" : "VN (VI)"}
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => changeLanguage("en")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
                  >
                    US (EN)
                  </button>
                  <button
                    onClick={() => changeLanguage("vi")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
                  >
                    VN (VI)
                  </button>
                </div>
              )}
            </div>

            {/* Hidden Google Translate Widget */}
            <div id="google_translate_element" className="hidden"></div>

            {/* User Profile / Login Button */}
            {isLoggedIn ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-700"
              >
                <User size={20} />
                <span>My Profile</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition"
              >
                Login
              </Link>
            )}

            {/* Shop Cart Icon */}
            {/* <CartButton /> */}
          </div>
        </div>
      </nav>

      {/* User Profile Sidebar */}
      {isLoggedIn && (
        <div
          className={`fixed inset-0 z-50 ${showSidebar ? "block" : "hidden"}`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>

          {/* Sidebar */}
          <div
            className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-pink-700">
                My Profile
              </h2>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <UserCircle size={40} className="text-pink-700" />
                </div>
                <div>
                  <h3 className="font-medium">{user?.name || "User"}</h3>
                  <p className="text-sm text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Menu */}
            <div className="py-4">
              <Link
                to="/profile"
                className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
              >
                <User size={20} className="mr-3" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/mybooking"
                className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
              >
                <ShoppingBag size={20} className="mr-3" />
                <span>My Booking </span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
              >
                <Heart size={20} className="mr-3" />
                <span>Wishlist</span>
              </Link>
              <Link
                to="/myskintype"
                className="flex items-center px-6 py-3 hover:bg-pink-50 text-gray-700"
              >
                <Settings size={20} className="mr-3" />
                <span>My Type Skin</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3 hover:bg-pink-50 text-gray-700"
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Popup */}
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
    </div>
  );
};

export default Navbar;
