// import { Link, NavLink } from "react-router-dom";
// import CartButton from "./cart/CartButton";

// const Navbar = () => {
//   return (
//     <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
//       <div className="container mx-auto flex justify-between items-center px-4">
//         {/* Logo */}
//         <Link to="/" className="flex items-center text-pink-700 font-bold text-xl uppercase">
//           <img src="home/logo/logo.webp" alt="Beauty Logo" className="h-10 mr-2" />
//           BEAUTYA
//         </Link>

//         {/* Mobile Menu Button */}
//         <button className="lg:hidden text-gray-700 text-2xl focus:outline-none">
//           <i className="bi bi-list"></i>
//         </button>

//         {/* Menu items */}
//         <div className="hidden lg:flex space-x-6 items-center">
//           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/">
//             Home
//           </NavLink>
//           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/about">
//             About
//           </NavLink>
//           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/blog">
//             Blog
//           </NavLink>
//           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/services">
//             Services
//           </NavLink>
//           {/* <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/products">
//             Products
//           </NavLink> */}
          

//           {/* Search Bar */}
//           {/* <form className="relative">
//             <input
//               type="search"
//               className="border rounded-lg px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-400"
//               placeholder="Search..."
//             />
//             <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
//               <i className="bi bi-search"></i>
//             </button>
//           </form> */}

//           {/* Language */}
//           <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/language">
//             US (EN)
//           </NavLink>

//           {/* Login Button */}
//           <Link to="/login" className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition">
//             Login
//           </Link>

//           {/* Shop Cart Icon */}
//           <CartButton/>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { Link, NavLink } from "react-router-dom";
import CartButton from "./cart/CartButton";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [language, setLanguage] = useState("en"); // Ngôn ngữ mặc định là English
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Hiển thị popup logout

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Nếu có token, isLoggedIn = true
  }, []);

  // Google Translate
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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

  const handleLogout = () => {
    // Hiển thị popup xác nhận logout
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    // Xóa token và user từ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Cập nhật trạng thái
    setShowLogoutPopup(false); // Ẩn popup
    window.location.href = "/"; // Chuyển hướng về trang chủ
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false); // Ẩn popup
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center text-pink-700 font-bold text-xl uppercase">
            <img src="home/logo/logo.webp" alt="Beauty Logo" className="h-10 mr-2" />
            BEAUTYA
          </Link>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-gray-700 text-2xl focus:outline-none">
            <i className="bi bi-list"></i>
          </button>

          {/* Menu items */}
          <div className="hidden lg:flex space-x-6 items-center">
            <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/">
              Home
            </NavLink>
            <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/about">
              About
            </NavLink>
            <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/blog">
              Blog
            </NavLink>
            <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/services">
              Services
            </NavLink>

            {/* Language Dropdown Custom */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-gray-700 font-medium hover:text-pink-700 flex items-center"
              >
                {language === "en" ? "US (EN)" : "VN (VI)"}
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
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

            {/* Ẩn Google Translate Widget mặc định */}
            <div id="google_translate_element" className="hidden"></div>

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition"
              >
                Logout
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
            <CartButton />
          </div>
        </div>
      </nav>

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
                onClick={cancelLogout}
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

