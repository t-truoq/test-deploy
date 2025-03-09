<<<<<<< HEAD
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

=======
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
// "use client"

// import { useState, useEffect } from "react"
// import { Link, NavLink, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { User, ChevronDown, Menu, X, Settings, LogOut, Heart, ShoppingBag, UserCircle, Globe, Bell } from "lucide-react"

// // Custom hook for localStorage
// const useLocalStorage = (key, initialValue) => {
//   const [value, setValue] = useState(() => {
//     try {
//       const item = localStorage.getItem(key)
//       return item ? JSON.parse(item) : initialValue
//     } catch (error) {
//       console.error("Error reading localStorage:", error)
//       return initialValue
//     }
//   })

//   useEffect(() => {
//     const handleStorageChange = () => {
//       try {
//         const item = localStorage.getItem(key)
//         setValue(item ? JSON.parse(item) : initialValue)
//       } catch (error) {
//         console.error("Error reading localStorage:", error)
//         setValue(initialValue)
//       }
//     }

//     window.addEventListener("storage", handleStorageChange)
//     const interval = setInterval(() => handleStorageChange(), 1000)

//     return () => {
//       window.removeEventListener("storage", handleStorageChange)
//       clearInterval(interval)
//     }
//   }, [key, initialValue])

//   return [value, setValue]
// }

// const Navbar = () => {
//   const navigate = useNavigate()
//   const [language, setLanguage] = useState("en")
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [showSidebar, setShowSidebar] = useState(false)
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false)
//   const [showMobileMenu, setShowMobileMenu] = useState(false)
//   const [scrolled, setScrolled] = useState(false)
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [notifications, setNotifications] = useState([])
//   const [loadingNotifications, setLoadingNotifications] = useState(true)
//   const [errorNotifications, setErrorNotifications] = useState(null)
//   const [user, setUser] = useLocalStorage("user", {
//     name: "User",
//     email: "user@example.com",
//   })
//   const baseUrl = "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app"

//   // Add these state variables after the other useState declarations
//   const [showNotificationMessage, setShowNotificationMessage] = useState(true)

//   // Check login status and fetch user profile
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           setIsLoggedIn(false)
//           return
//         }

//         const response = await axios.get(`${baseUrl}/api/users/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//           timeout: 10000,
//         })

//         const userData = {
//           userId: response.data.userId || null,
//           email: response.data.email || "user@example.com",
//           name: response.data.name || "User",
//           phone: response.data.phone || "",
//           address: response.data.address || "",
//           role: response.data.role || "",
//         }

//         localStorage.setItem("user", JSON.stringify(userData))
//         setUser(userData)
//         setIsLoggedIn(true)
//       } catch (error) {
//         console.error("Error fetching user profile:", error)
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem("token")
//           localStorage.removeItem("user")
//           setIsLoggedIn(false)
//           navigate("/login")
//         }
//       }
//     }

//     fetchUserProfile()
//   }, [navigate, setUser, baseUrl])

//   // Hàm đánh dấu thông báo là đã đọc
//   const markNotificationAsRead = async (notification) => {
//     if (notification.status === "read") return // Nếu đã đọc thì không làm gì

//     // Kiểm tra nếu ID là tạm (có dấu chấm hoặc không phải số nguyên)
//     const isTempId = notification.id.toString().includes(".") || !Number.isInteger(Number(notification.id))
//     if (isTempId) {
//       console.warn(`Skipping mark as read for temporary ID: ${notification.id}`)
//       // Vẫn cập nhật UI để không gây khó chịu cho người dùng
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((n) => (n.id === notification.id ? { ...n, status: "read" } : n)),
//       )
//       return
//     }

//     // Đổi status thành true ngay lập tức trên giao diện
//     setNotifications((prevNotifications) =>
//       prevNotifications.map((n) => (n.id === notification.id ? { ...n, status: "read" } : n)),
//     )

//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         console.error("No token found")
//         return
//       }

//       // Gửi request tới API để lưu vào database
//       await axios.post(
//         `${baseUrl}/api/notifications/${notification.id}/read`,
//         { read: true },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//           timeout: 10000,
//         },
//       )
//       console.log(`Notification ${notification.id} marked as read in database`)
//     } catch (error) {
//       console.error("Error marking notification as read in database:", error)
//       // Nếu API thất bại, thông báo cho người dùng và rollback
//       alert("Failed to mark notification as read. Please try again.")
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((n) => (n.id === notification.id ? { ...n, status: "unread" } : n)),
//       )
//     }
//   }

//   // Fetch notifications from API with retry
//   useEffect(() => {
//     const fetchNotifications = async (retryCount = 2) => {
//       try {
//         setLoadingNotifications(true)
//         setErrorNotifications(null)
//         const token = localStorage.getItem("token")
//         if (!token) {
//           setErrorNotifications("No authentication token found. Please log in.")
//           setLoadingNotifications(false)
//           return
//         }

//         const response = await axios.get(`${baseUrl}/api/notifications`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           timeout: 10000,
//         })

//         let rawData = response.data
//         console.log("Raw response data:", rawData)

//         let parsedData
//         if (typeof rawData === "string") {
//           rawData = rawData.trim()
//           if (rawData.startsWith("[")) {
//             try {
//               parsedData = JSON.parse(rawData)
//             } catch (parseError) {
//               console.error("Initial parse error:", parseError)
//               const jsonMatch = rawData.match(/(\[.*\])/s)
//               if (jsonMatch && jsonMatch[1]) {
//                 parsedData = JSON.parse(jsonMatch[1])
//               } else {
//                 throw new Error("No valid JSON array found in response")
//               }
//             }
//           } else {
//             throw new Error("Response is not a JSON array string")
//           }
//         } else if (Array.isArray(rawData)) {
//           parsedData = rawData
//         } else if (typeof rawData === "object" && rawData !== null) {
//           parsedData = [rawData]
//         } else {
//           throw new Error("Unexpected response format")
//         }

//         const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData]

//         // Xử lý dữ liệu thông báo
//         const processedNotifications = dataArray.map((item) => {
//           if (!item.id) {
//             console.warn("Notification missing ID:", item)
//             // Tạo ID tạm dựa trên createdAt nếu có, nếu không dùng timestamp
//             const tempId = item.createdAt
//               ? `temp_${new Date(item.createdAt).getTime()}`
//               : `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//             return {
//               id: tempId,
//               message: item.message || "New Notification",
//               time: item.createdAt
//                 ? new Date(item.createdAt).toLocaleString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                   })
//                 : "Unknown time",
//               createdAt: item.createdAt, // Lưu createdAt để sắp xếp
//               status: item.read ? "read" : "unread",
//             }
//           }
//           return {
//             id: item.id,
//             message: item.message || "New Notification",
//             time: item.createdAt
//               ? new Date(item.createdAt).toLocaleString("en-US", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })
//               : "Unknown time",
//             createdAt: item.createdAt, // Lưu createdAt để sắp xếp
//             status: item.read ? "read" : "unread",
//           }
//         })

//         // Sắp xếp thông báo theo thời gian giảm dần (mới nhất trước)
//         const sortedNotifications = processedNotifications.sort((a, b) => {
//           const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
//           const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
//           return dateB - dateA // Sắp xếp giảm dần
//         })

//         setNotifications(sortedNotifications)
//         console.log("Sorted notifications:", sortedNotifications)
//       } catch (error) {
//         console.error("Error fetching notifications:", error)
//         if (retryCount > 0 && error.code === "ECONNABORTED") {
//           console.log(`Retrying... Attempts left: ${retryCount}`)
//           await new Promise((resolve) => setTimeout(resolve, 2000))
//           return fetchNotifications(retryCount - 1)
//         }
//         setErrorNotifications(error.message || "Failed to fetch notifications. Check server or network.")
//       } finally {
//         setLoadingNotifications(false)
//       }
//     }

//     if (isLoggedIn) {
//       fetchNotifications()
//     }
//   }, [isLoggedIn, baseUrl])

//   // Add this useEffect for auto-hiding the notification message
//   useEffect(() => {
//     // Reset visibility when new unread notifications are detected
//     if (notifications.some((n) => n.status === "unread")) {
//       setShowNotificationMessage(true)

//       // Auto-hide after 5 seconds
//       const timer = setTimeout(() => {
//         setShowNotificationMessage(false)
//       }, 5000)

//       return () => clearTimeout(timer)
//     }
//   }, [notifications])

//   // Handle scroll event to change navbar appearance
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setScrolled(true)
//       } else {
//         setScrolled(false)
//       }
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
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

//   const toggleDropdown = () => setShowDropdown(!showDropdown)
//   const toggleSidebar = () => setShowSidebar(!showSidebar)
//   const handleLogout = () => setShowLogoutPopup(true)

//   const confirmLogout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     setUser({ name: "User", email: "user@example.com" })
//     setIsLoggedIn(false)
//     setShowLogoutPopup(false)
//     setShowSidebar(false)
//     navigate("/")
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showNotifications && !event.target.closest(".notifications-container")) {
//         setShowNotifications(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [showNotifications])

//   // Add this right before the return statement
//   useEffect(() => {
//     // Add the animation styles to the document
//     const styleElement = document.createElement("style")
//     styleElement.innerHTML = styles
//     document.head.appendChild(styleElement)

//     return () => {
//       document.head.removeChild(styleElement)
//     }
//   }, [])

//   return (
//     <div className="relative z-50 w-full h-auto">
//       <nav
//         className={`fixed top-0 left-0 right-0 w-full h-auto bg-white shadow-sm border-b border-pink-100 transition-all duration-300 ${
//           scrolled ? "h-16 shadow-md" : "h-20"
//         }`}
//         style={{ zIndex: 1000 }}
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full h-auto">
//           <div className="flex justify-between items-center h-full w-full transition-all duration-300">
//             <Link to="/" className="flex items-center space-x-2 h-auto">
//               <img
//                 src="home/logo/logo.webp"
//                 alt="Beauty Logo"
//                 className={`transition-all duration-300 ${scrolled ? "h-10" : "h-12"} w-auto`}
//               />
//               <span
//                 className={`text-pink-600 font-bold tracking-tight transition-all duration-300 ${
//                   scrolled ? "text-xl" : "text-2xl"
//                 }`}
//               >
//                 BEAUTYA
//               </span>
//             </Link>

//             <div className="hidden lg:flex lg:items-center lg:space-x-10 h-full">
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `text-base font-medium transition-colors h-full flex items-center ${
//                     isActive
//                       ? "text-pink-600 border-b-2 border-pink-600"
//                       : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
//                   }`
//                 }
//               >
//                 Home
//               </NavLink>
//               <NavLink
//                 to="/about"
//                 className={({ isActive }) =>
//                   `text-base font-medium transition-colors h-full flex items-center ${
//                     isActive
//                       ? "text-pink-600 border-b-2 border-pink-600"
//                       : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
//                   }`
//                 }
//               >
//                 About
//               </NavLink>
//               <NavLink
//                 to="/blog"
//                 className={({ isActive }) =>
//                   `text-base font-medium transition-colors h-full flex items-center ${
//                     isActive
//                       ? "text-pink-600 border-b-2 border-pink-600"
//                       : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
//                   }`
//                 }
//               >
//                 Blog
//               </NavLink>
//               <NavLink
//                 to="/specialist"
//                 className={({ isActive }) =>
//                   `text-base font-medium transition-colors h-full flex items-center ${
//                     isActive
//                       ? "text-pink-600 border-b-2 border-pink-600"
//                       : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
//                   }`
//                 }
//               >
//                 Specialist
//               </NavLink>
//               <NavLink
//                 to="/services"
//                 className={({ isActive }) =>
//                   `text-base font-medium transition-colors h-full flex items-center ${
//                     isActive
//                       ? "text-pink-600 border-b-2 border-pink-600"
//                       : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
//                   }`
//                 }
//               >
//                 Services
//               </NavLink>
//             </div>

//             <div className="hidden lg:flex lg:items-center lg:space-x-8 h-full">
//               <div className="relative h-auto">
//                 <button
//                   onClick={toggleDropdown}
//                   className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium h-auto"
//                 >
//                   <Globe className={`w-5 h-5 mr-2 transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
//                   {language === "en" ? "English" : "Tiếng Việt"}
//                   <ChevronDown className={`ml-1 transition-all duration-300 ${scrolled ? "w-3 h-3" : "w-4 h-4"}`} />
//                 </button>

//                 {showDropdown && (
//                   <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
//                     <button
//                       onClick={() => changeLanguage("en")}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
//                     >
//                       English
//                     </button>
//                     <button
//                       onClick={() => changeLanguage("vi")}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
//                     >
//                       Tiếng Việt
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Replace the Bell button section with this updated version */}
//               {/* In the desktop menu section: */}
//               <div className="relative h-auto">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium h-auto relative"
//                 >
//                   <Bell className={`w-5 h-5 transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
//                   {notifications.some((n) => n.status === "unread") && (
//                     <>
//                       <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
//                       {showNotificationMessage && (
//                         <div className="absolute top-6 right-0 bg-pink-600 text-white text-xs py-1 px-2 rounded shadow-md whitespace-nowrap animate-fadeIn">
//                           <div className="absolute top-0 right-3 transform -translate-y-1/2 w-2 h-2 bg-pink-600 rotate-45"></div>
//                           You have a new notification!
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </button>

//                 {showNotifications && (
//                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5 notifications-container">
//                     {loadingNotifications && (
//                       <div className="px-4 py-2 text-sm text-gray-500">Loading notifications...</div>
//                     )}
//                     {errorNotifications && <div className="px-4 py-2 text-sm text-red-500">{errorNotifications}</div>}
//                     {!loadingNotifications && !errorNotifications && notifications.length === 0 && (
//                       <div className="px-4 py-2 text-sm text-gray-500">No notifications available</div>
//                     )}
//                     {!loadingNotifications && !errorNotifications && notifications.length > 0 && (
//                       <>
//                         <div className="px-4 py-2 border-b border-gray-100">
//                           <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
//                         </div>
//                         <div className="max-h-96 overflow-y-auto">
//                           {notifications.map((notification) => (
//                             <div
//                               key={notification.id}
//                               onClick={() => markNotificationAsRead(notification)}
//                               className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
//                                 notification.status === "unread" ? "bg-pink-50" : ""
//                               }`}
//                             >
//                               <p
//                                 className={`text-sm text-gray-900 ${
//                                   notification.status === "unread" ? "font-medium" : "font-normal"
//                                 }`}
//                               >
//                                 {notification.message}
//                               </p>
//                               <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
//                             </div>
//                           ))}
//                         </div>
//                         <div className="px-4 py-2 border-t border-gray-100">
//                           <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
//                             View all notifications
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div id="google_translate_element" className="hidden"></div>

//               {isLoggedIn ? (
//                 <button
//                   onClick={toggleSidebar}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 text-base font-medium h-auto"
//                 >
//                   <UserCircle className={`transition-all duration-300 ${scrolled ? "w-5 h-5" : "w-6 h-6"}`} />
//                   <span>{user?.name?.split(" ")[0] || "User"}</span>
//                 </button>
//               ) : (
//                 <Link
//                   to="/login"
//                   className={`bg-pink-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-pink-700 transition-all duration-300 shadow-sm h-auto ${
//                     scrolled ? "text-sm px-4 py-2" : "text-base px-5 py-2.5"
//                   }`}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>

//             <div className="flex lg:hidden h-auto">
//               <button
//                 onClick={() => setShowMobileMenu(!showMobileMenu)}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 focus:outline-none"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 {showMobileMenu ? (
//                   <X
//                     className={`block transition-all duration-300 ${scrolled ? "h-6 w-6" : "h-7 w-7"}`}
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   <Menu
//                     className={`block transition-all duration-300 ${scrolled ? "h-6 w-6" : "h-7 w-7"}`}
//                     aria-hidden="true"
//                   />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div
//           className={`lg:hidden ${showMobileMenu ? "block" : "hidden"} w-full h-auto absolute bg-white shadow-lg transition-all duration-300 ease-in-out`}
//           style={{ zIndex: 999 }}
//         >
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 w-full">
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
//                   isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
//                 }`
//               }
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
//                   isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
//                 }`
//               }
//               onClick={() => setShowMobileMenu(false)}
//             >
//               About
//             </NavLink>
//             <NavLink
//               to="/blog"
//               className={({ isActive }) =>
//                 `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
//                   isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
//                 }`
//               }
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Blog
//             </NavLink>
//             <NavLink
//               to="/therapist"
//               className={({ isActive }) =>
//                 `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
//                   isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
//                 }`
//               }
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Therapist
//             </NavLink>
//             <NavLink
//               to="/services"
//               className={({ isActive }) =>
//                 `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
//                   isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
//                 }`
//               }
//               onClick={() => setShowMobileMenu(false)}
//             >
//               Services
//             </NavLink>

//             <div className="px-3 py-3 w-full h-auto">
//               <div className="flex flex-col space-y-2 w-full">
//                 <span className="text-sm font-medium text-gray-500">Language</span>
//                 <div className="flex space-x-2 w-full">
//                   <button
//                     onClick={() => changeLanguage("en")}
//                     className={`px-3 py-1.5 text-sm rounded-full h-auto ${
//                       language === "en" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     English
//                   </button>
//                   <button
//                     onClick={() => changeLanguage("vi")}
//                     className={`px-3 py-1.5 text-sm rounded-full h-auto ${
//                       language === "vi" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     Tiếng Việt
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="px-3 py-3 w-full h-auto">
//               {isLoggedIn ? (
//                 <button
//                   onClick={() => {
//                     toggleSidebar()
//                     setShowMobileMenu(false)
//                   }}
//                   className="flex items-center space-x-2 text-pink-600 font-medium w-full h-auto py-2"
//                 >
//                   <UserCircle className="w-5 h-5" />
//                   <span>My Profile</span>
//                 </button>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="block w-full text-center bg-pink-600 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-pink-700 h-auto"
//                   onClick={() => setShowMobileMenu(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>

//             {/* Also update the mobile menu version: */}
//             <div className="px-3 py-3 w-full h-auto">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium h-auto relative"
//               >
//                 <Bell className={`w-5 h-5 transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
//                 {notifications.some((n) => n.status === "unread") && (
//                   <>
//                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
//                     {showNotificationMessage && (
//                       <div className="absolute top-6 right-0 bg-pink-600 text-white text-xs py-1 px-2 rounded shadow-md whitespace-nowrap animate-fadeIn">
//                         <div className="absolute top-0 right-3 transform -translate-y-1/2 w-2 h-2 bg-pink-600 rotate-45"></div>
//                         You have a new notification!
//                       </div>
//                     )}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       <div className="h-20 w-full"></div>

//       {isLoggedIn && (
//         <>
//           {showSidebar && (
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 w-full h-full"
//               onClick={toggleSidebar}
//             ></div>
//           )}

//           <div
//             className={`fixed inset-y-0 right-0 max-w-xs w-full h-full bg-white shadow-xl overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
//               showSidebar ? "translate-x-0" : "translate-x-full"
//             }`}
//           >
//             <div className="p-6 w-full h-auto">
//               <div className="flex items-center justify-between mb-6 w-full">
//                 <h2 className="text-xl font-bold text-gray-900">My Account</h2>
//                 <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>

//               <div className="mb-6 pb-6 border-b border-gray-200 w-full h-auto">
//                 <div className="flex items-center space-x-4 w-full">
//                   <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-full h-auto">
//                     <UserCircle className="h-8 w-8 text-white" />
//                   </div>
//                   <div className="w-auto h-auto">
//                     <h3 className="text-lg font-medium text-gray-900">{user?.name || "User"}</h3>
//                     <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
//                   </div>
//                 </div>
//               </div>

//               <nav className="space-y-1 w-full h-auto">
//                 <Link
//                   to="/profile"
//                   className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
//                   onClick={() => setShowSidebar(false)}
//                 >
//                   <User className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
//                   Edit Profile
//                 </Link>
//                 <Link
//                   to="/mybooking"
//                   className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
//                   onClick={() => setShowSidebar(false)}
//                 >
//                   <ShoppingBag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
//                   My Bookings
//                 </Link>
//                 <Link
//                   to="/wishlist"
//                   className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
//                   onClick={() => setShowSidebar(false)}
//                 >
//                   <Heart className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
//                   Wishlist
//                 </Link>
//                 <Link
//                   to="/myskintype"
//                   className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
//                   onClick={() => setShowSidebar(false)}
//                 >
//                   <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
//                   My Skin Type
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full h-auto group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
//                 >
//                   <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
//                   Logout
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </>
//       )}

//       {showLogoutPopup && (
//         <div className="fixed inset-0 overflow-y-auto z-50 w-full h-full">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div
//               className="fixed inset-0 transition-opacity w-full h-full"
//               aria-hidden="true"
//               onClick={() => setShowLogoutPopup(false)}
//             >
//               <div className="absolute inset-0 bg-gray-500 opacity-75 w-full h-full"></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
//               ​
//             </span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-full h-auto">
//                 <div className="sm:flex sm:items-start w-full">
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full h-auto">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
//                     <div className="mt-2 w-full h-auto">
//                       <p className="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full h-auto">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm h-auto"
//                   onClick={confirmLogout}
//                 >
//                   Logout
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm h-auto"
//                   onClick={() => setShowLogoutPopup(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Add this at the end of the file before the export statement
// const styles = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(-10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
  
//   .animate-fadeIn {
//     animation: fadeIn 0.3s ease-out forwards;
//   }
// `

// export default Navbar


"use client";

import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
<<<<<<< HEAD
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
=======
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
import axios from "axios";
import { User, ChevronDown, Menu, X, Settings, LogOut, Heart, ShoppingBag, UserCircle, Globe, Bell } from "lucide-react";

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
  const [language, setLanguage] = useState("en");
  const [showDropdown, setShowDropdown] = useState(false);
<<<<<<< HEAD
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login status
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Logout confirmation popup
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Mobile menu state
  const [user, setUser] = useLocalStorage("user", {
    name: "User",
    email: "user@example.com",
  }); // Hook lắng nghe localStorage
=======
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
    name: "User",
    email: "user@example.com",
  });
  const [showNotificationMessage, setShowNotificationMessage] = useState(true);
  const baseUrl = "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app";
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379

  // Check login status and fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

<<<<<<< HEAD
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
=======
        const response = await axios.get(`${baseUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379

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

  // Hàm đánh dấu thông báo là đã đọc
  const markNotificationAsRead = async (notification) => {
    if (notification.status === "read") return; // Nếu đã đọc thì không làm gì

    // Kiểm tra nếu ID là tạm (có dấu chấm hoặc không phải số nguyên)
    const isTempId = notification.id.toString().includes(".") || !Number.isInteger(Number(notification.id));
    if (isTempId) {
      console.warn(`Skipping mark as read for temporary ID: ${notification.id}`);
      // Vẫn cập nhật UI để không gây khó chịu cho người dùng
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => (n.id === notification.id ? { ...n, status: "read" } : n))
      );
      return;
    }

    // Đổi status thành true ngay lập tức trên giao diện
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === notification.id ? { ...n, status: "read" } : n))
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Gửi request tới API để lưu vào database
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
      console.log(`Notification ${notification.id} marked as read in database`);
    } catch (error) {
      console.error("Error marking notification as read in database:", error);
      // Nếu API thất bại, thông báo cho người dùng và rollback
      alert("Failed to mark notification as read. Please try again.");
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => (n.id === notification.id ? { ...n, status: "unread" } : n))
      );
    }
  };

  // Fetch notifications from API with retry
  useEffect(() => {
    const fetchNotifications = async (retryCount = 2) => {
      try {
        setLoadingNotifications(true);
        setErrorNotifications(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorNotifications("No authentication token found. Please log in.");
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
        console.log("Raw response data:", rawData);

        let parsedData;
        if (typeof rawData === "string") {
          rawData = rawData.trim();
          if (rawData.startsWith("[")) {
            try {
              parsedData = JSON.parse(rawData);
            } catch (parseError) {
              console.error("Initial parse error:", parseError);
              const jsonMatch = rawData.match(/(\[.*\])/s);
              if (jsonMatch && jsonMatch[1]) {
                parsedData = JSON.parse(jsonMatch[1]);
              } else {
                throw new Error("No valid JSON array found in response");
              }
            }
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

        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

        // Xử lý dữ liệu thông báo
        const processedNotifications = dataArray.map((item) => {
          if (!item.id) {
            console.warn("Notification missing ID:", item);
            // Tạo ID tạm dựa trên createdAt nếu có, nếu không dùng timestamp
            const tempId = item.createdAt
              ? `temp_${new Date(item.createdAt).getTime()}`
              : `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            return {
              id: tempId,
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
              createdAt: item.createdAt, // Lưu createdAt để sắp xếp
              status: item.read ? "read" : "unread",
            };
          }
          return {
            id: item.id,
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
            createdAt: item.createdAt, // Lưu createdAt để sắp xếp
            status: item.read ? "read" : "unread",
          };
        });

        // Sắp xếp thông báo theo thời gian giảm dần (mới nhất trước)
        const sortedNotifications = processedNotifications.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA; // Sắp xếp giảm dần
        });

        setNotifications(sortedNotifications);
        console.log("Sorted notifications:", sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (retryCount > 0 && error.code === "ECONNABORTED") {
          console.log(`Retrying... Attempts left: ${retryCount}`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return fetchNotifications(retryCount - 1);
        }
        setErrorNotifications(error.message || "Failed to fetch notifications. Check server or network.");
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn, baseUrl]);

  // Add this useEffect for auto-hiding the notification message
  useEffect(() => {
    // Reset visibility when new unread notifications are detected
    if (notifications.some((n) => n.status === "unread")) {
      setShowNotificationMessage(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotificationMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Google Translate with hidden bar
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

    // Add CSS to hide Google Translate bar
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .goog-te-banner-frame,
      .goog-te-gadget,
      .goog-te-menu-frame,
      #google_translate_element {
        display: none !important;
      }
      .skiptranslate {
        display: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
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

  const toggleDropdown = () => setShowDropdown(!showDropdown);
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
      if (showNotifications && !event.target.closest(".notifications-container")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
<<<<<<< HEAD
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
=======
    <div className="relative z-50 w-full h-auto">
      <nav
        className={`fixed top-0 left-0 right-0 w-full h-auto bg-white shadow-sm border-b border-pink-100 transition-all duration-300 ${
          scrolled ? "h-16 shadow-md" : "h-20"
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full h-auto">
          <div className="flex justify-between items-center h-full w-full transition-all duration-300">
            <Link to="/" className="flex items-center space-x-2 h-auto">
              <img
                src="home/logo/logo.webp"
                alt="Beauty Logo"
                className={`transition-all duration-300 ${scrolled ? "h-10" : "h-12"} w-auto`}
              />
              <span
                className={`text-pink-600 font-bold tracking-tight transition-all duration-300 ${
                  scrolled ? "text-xl" : "text-2xl"
                }`}
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
              >
                BEAUTYA
              </span>
            </Link>

            <div className="hidden lg:flex lg:items-center lg:space-x-10 h-full">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-base font-medium transition-colors h-full flex items-center ${
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
                  `text-base font-medium transition-colors h-full flex items-center ${
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
                  `text-base font-medium transition-colors h-full flex items-center ${
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
                  `text-base font-medium transition-colors h-full flex items-center ${
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
                  `text-base font-medium transition-colors h-full flex items-center ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-700 hover:text-pink-600 hover:border-b-2 hover:border-pink-600"
                  }`
                }
              >
                Services
              </NavLink>
            </div>

            <div className="hidden lg:flex lg:items-center lg:space-x-8 h-full">
              <div className="relative h-auto">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium h-auto"
                >
                  <Globe className={`w-5 h-5 mr-2 transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
                  {language === "en" ? "English" : "Tiếng Việt"}
                  <ChevronDown className={`ml-1 transition-all duration-300 ${scrolled ? "w-3 h-3" : "w-4 h-4"}`} />
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

              {/* Replace the Bell button section with this updated version */}
              {/* In the desktop menu section: */}
              <div className="relative h-auto">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium h-auto relative"
                >
                  <Bell className={`w-5 h-5 transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
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

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5 notifications-container">
                    {loadingNotifications && (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading notifications...</div>
                    )}
                    {errorNotifications && <div className="px-4 py-2 text-sm text-red-500">{errorNotifications}</div>}
                    {!loadingNotifications && !errorNotifications && notifications.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">No notifications available</div>
                    )}
                    {!loadingNotifications && !errorNotifications && notifications.length > 0 && (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification)}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                                notification.status === "unread" ? "bg-pink-50" : ""
                              }`}
                            >
                              <p
                                className={`text-sm text-gray-900 ${
                                  notification.status === "unread" ? "font-medium" : "font-normal"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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

              <div id="google_translate_element" className="hidden"></div>

              {isLoggedIn ? (
                <button
                  onClick={toggleSidebar}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 text-base font-medium h-auto"
                >
                  <UserCircle className={`transition-all duration-300 ${scrolled ? "w-5 h-5" : "w-6 h-6"}`} />
                  <span>{user?.name?.split(" ")[0] || "User"}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`bg-pink-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-pink-700 transition-all duration-300 shadow-sm h-auto ${
                    scrolled ? "text-sm px-4 py-2" : "text-base px-5 py-2.5"
                  }`}
                >
                  Login
                </Link>
              )}
            </div>

<<<<<<< HEAD
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
=======
            <div className="flex lg:hidden h-auto">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <X
                    className={`block transition-all duration-300 ${scrolled ? "h-6 w-6" : "h-7 w-7"}`}
                    aria-hidden="true"
                  />
                ) : (
                  <Menu
                    className={`block transition-all duration-300 ${scrolled ? "h-6 w-6" : "h-7 w-7"}`}
                    aria-hidden="true"
                  />
                )}
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
              </button>
            </div>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        <div
          className={`lg:hidden ${showMobileMenu ? "block" : "hidden"} w-full h-auto absolute bg-white shadow-lg transition-all duration-300 ease-in-out`}
          style={{ zIndex: 999 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 w-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
              onClick={() => setShowMobileMenu(false)}
            >
              Blog
            </NavLink>
            <NavLink
              to="/therapist"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
              onClick={() => setShowMobileMenu(false)}
            >
              Therapist
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-medium w-full h-auto ${
                  isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                }`
              }
              onClick={() => setShowMobileMenu(false)}
            >
              Services
            </NavLink>

            <div className="px-3 py-3 w-full h-auto">
              <div className="flex flex-col space-y-2 w-full">
                <span className="text-sm font-medium text-gray-500">Language</span>
                <div className="flex space-x-2 w-full">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`px-3 py-1.5 text-sm rounded-full h-auto ${
                      language === "en" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("vi")}
                    className={`px-3 py-1.5 text-sm rounded-full h-auto ${
                      language === "vi" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tiếng Việt
                  </button>
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
                </div>
              </div>
            </div>

<<<<<<< HEAD
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
=======
            <div className="px-3 py-3 w-full h-auto">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    toggleSidebar();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center space-x-2 text-pink-600 font-medium w-full h-auto py-2"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>My Profile</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-pink-600 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-pink-700 h-auto"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Also update the mobile menu version: */}
            <div className="px-3 py-3 w-full h-auto">
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center text-gray-700 hover:text-pink-600 text-base font-medium h-auto relative"
              >
                <Bell className={`w-5 h-5 transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
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
          </div>
        </div>
      </nav>
      <div className="h-20 w-full"></div>

      {isLoggedIn && (
        <>
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 w-full h-full"
              onClick={toggleSidebar}
            ></div>
          )}

          <div
            className={`fixed inset-y-0 right-0 max-w-xs w-full h-full bg-white shadow-xl overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
              showSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-6 w-full h-auto">
              <div className="flex items-center justify-between mb-6 w-full">
                <h2 className="text-xl font-bold text-gray-900">My Account</h2>
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 w-full h-auto">
                <div className="flex items-center space-x-4 w-full">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-full h-auto">
                    <UserCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-auto h-auto">
                    <h3 className="text-lg font-medium text-gray-900">{user?.name || "User"}</h3>
                    <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1 w-full h-auto">
                <Link
                  to="/profile"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
                  onClick={() => setShowSidebar(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Edit Profile
                </Link>
                <Link
                  to="/mybooking"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
                  onClick={() => setShowSidebar(false)}
                >
                  <ShoppingBag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  My Bookings
                </Link>
                <Link
                  to="/wishlist"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
                  onClick={() => setShowSidebar(false)}
                >
                  <Heart className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Wishlist
                </Link>
                <Link
                  to="/myskintype"
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50 w-full h-auto"
                  onClick={() => setShowSidebar(false)}
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  My Skin Type
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full h-auto group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-pink-600" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {showLogoutPopup && (
<<<<<<< HEAD
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
=======
        <div className="fixed inset-0 overflow-y-auto z-50 w-full h-full">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity w-full h-full"
              aria-hidden="true"
              onClick={() => setShowLogoutPopup(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75 w-full h-full"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-full h-auto">
                <div className="sm:flex sm:items-start w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full h-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
                    <div className="mt-2 w-full h-auto">
                      <p className="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full h-auto">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm h-auto"
                  onClick={confirmLogout}
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm h-auto"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  Cancel
                </button>
              </div>
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default Navbar;
=======
// Add this at the end of the file before the export statement
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

export default Navbar;
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
