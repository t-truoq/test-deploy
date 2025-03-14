// import React, { useEffect } from "react";
// import { useState } from "react";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// export default function SignIn() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Xử lý callback từ Google OAuth2
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const code = params.get("code");

//     if (code) {
//       handleGoogleCallback(code);
//     }
//   }, [location]);

//   const handleGoogleCallback = async (code) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(

//         `https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/login/oauth2/code/google?code=${code}`,

//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Google callback response:", response.data);

//       if (response.data && response.data.result && response.data.result.token) {
//         const token = response.data.result.token;
//         localStorage.setItem("token", token);

//         const decodedToken = JSON.parse(atob(token.split(".")[1]));
//         console.log("Decoded token:", decodedToken);

//         if (rememberMe) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify({
//               email: decodedToken.email,
//               role: decodedToken.role,
//             })
//           );
//         }

//         const userRole = decodedToken.role?.toUpperCase();
//         switch (userRole) {
//           case "ADMIN":
//             navigate("/admin/home");
//             break;
//           case "STAFF":
//             navigate("/staff/home");
//             break;
//           case "SPECIALIST":
//             navigate("/skintherapist/home");
//             break;
//           case "CUSTOMER":
//             navigate("/");
//             break;
//           default:
//             setError("Vai trò người dùng không hợp lệ");
//             navigate("/");
//         }
//       } else {
//         setError("Không thể xác thực với Google");
//       }
//     } catch (error) {
//       console.error("Google callback error:", error);
//       setError(error.response?.data?.message || "Đăng nhập Google thất bại");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       if (!email || !password) {
//         setError("Vui lòng nhập email và mật khẩu");
//         setIsLoading(false);
//         return;
//       }

//       console.log("Request data:", { email, password });
//       const response = await axios.post(
//         "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/auth/token",

//         { email, password },

//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Response data:", response.data);

//       if (response.data && response.data.result && response.data.result.token) {
//         const token = response.data.result.token;
//         localStorage.setItem("token", token);

//         const decodedToken = JSON.parse(atob(token.split(".")[1]));
//         console.log("Decoded token:", decodedToken);

//         if (rememberMe) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify({ email, role: decodedToken.role })
//           );
//         }

//         const userRole = decodedToken.role?.toUpperCase();
//         switch (userRole) {
//           case "ADMIN":
//             navigate("/admin/home");
//             break;
//           case "STAFF":
//             navigate("/staff/home");
//             break;
//           case "SPECIALIST":
//             navigate("/skintherapist/home");
//             // navigate("/specialist");
//             break;
//           case "CUSTOMER":
//             navigate("/");
//             break;
//           default:
//             setError("Vai trò người dùng không hợp lệ");
//             navigate("/");
//         }
//       } else {
//         setError("Email hoặc mật khẩu không đúng");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       if (error.response) {
//         console.log("Error response:", error.response.data);
//         console.log("Status:", error.response.status);
//         setError(
//           error.response.data.message ||
//             "Tài khoản không tồn tại hoặc mật khẩu sai"
//         );
//       } else if (error.request) {
//         console.log("No response received:", error.request);
//         setError("Không thể kết nối đến server");
//       } else {
//         console.log("Error setting up request:", error.message);
//         setError("Đã xảy ra lỗi. Vui lòng thử lại.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {

//     window.location.href =
//       "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/oauth2/authorization/google";
//   };

//   return (
//     <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
//       <div className="space-y-6">
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Đăng nhập vào tài khoản của bạn
//         </h1>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Nhập địa chỉ email của bạn"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Nhập mật khẩu của bạn"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {showPassword ? (
//                 <EyeOffIcon className="h-5 w-5" />
//               ) : (
//                 <EyeIcon className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
//               />
//               <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
//             </label>
//             <Link
//               to="/forgetpass"
//               className="text-sm text-orange-500 hover:text-orange-600"
//             >
//               Quên mật khẩu?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || !email || !password}
//             className={`w-full py-3 rounded-lg transition-colors ${
//               isLoading || !email || !password
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-[#FF6B2B] hover:bg-orange-600"
//             } text-white`}
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Đang đăng nhập...
//               </div>
//             ) : (
//               "Đăng nhập"
//             )}
//           </button>
//         </form>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white text-gray-500">
//               Hoặc đăng nhập bằng
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <button
//             type="button"
//             onClick={handleGoogleLogin}
//             disabled={isLoading}
//             className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
//               isLoading ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <img
//               src="https://www.google.com/favicon.ico"
//               alt="Google"
//               className="w-5 h-5 mr-2"
//             />
//             Google
//           </button>
//           <button
//             type="button"
//             className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
//             </svg>
//             Facebook
//           </button>
//         </div>

//         <p className="text-center text-sm text-gray-600">
//           Chưa có tài khoản?{" "}
//           <Link to="/signup" className="text-orange-500 hover:text-orange-600">
//             Đăng ký ngay
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL =
    "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app";

  useEffect(() => {
    console.log("Location search:", location.search); // Debug URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log("Token from query:", token); // Debug token

    if (token) {
      setIsLoading(true); // Hiển thị loading
      handleGoogleCallback(token);
    }
  }, [location]);

  const handleGoogleCallback = async (token) => {
    console.log("Handling Google callback with token:", token);
    try {
      // Lưu token ngay lập tức
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");

      // Decode token để lấy thông tin (không cần introspect nếu tin tưởng backend)
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded token:", decodedToken);

      if (rememberMe) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: decodedToken.sub,
            role: decodedToken.role,
          })
        );
        console.log("User info stored in localStorage");
      }

      redirectBasedOnRole(decodedToken.role);
    } catch (error) {
      console.error("Google callback error:", error);
      setError("Đăng nhập Google thất bại: " + error.message);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Vui lòng nhập email và mật khẩu");
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/auth/token`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.result?.token) {
        const token = response.data.result.token;
        localStorage.setItem("token", token);

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token:", decodedToken);

        if (rememberMe) {
          localStorage.setItem(
            "user",
            JSON.stringify({ email: decodedToken.sub, role: decodedToken.role })
          );
        }

        redirectBasedOnRole(decodedToken.role);
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Tài khoản không tồn tại hoặc mật khẩu sai"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    console.log("Redirecting based on role:", role);
    const userRole = role?.toUpperCase();
    switch (userRole) {
      case "ADMIN":
        navigate("/admin/home");
        break;
      case "STAFF":
        navigate("/staff/home");
        break;
      case "SPECIALIST":
        navigate("/skintherapist/home");
        break;
      case "CUSTOMER":
        navigate("/");
        break;
      default:
        setError("Vai trò người dùng không hợp lệ");
        navigate("/");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google login");
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Đăng nhập vào tài khoản của bạn
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center">Đang xử lý đăng nhập...</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
            </label>
            <Link
              to="/forgetpass"
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={`w-full py-3 rounded-lg transition-colors ${
              isLoading || !email || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FF6B2B] hover:bg-orange-600"
            } text-white`}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
              isLoading ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-orange-500 hover:text-orange-600">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
