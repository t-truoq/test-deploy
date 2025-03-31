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
    "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app";

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
      setError("Login Google failed !");
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
        setError("Please enter email and password !");
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
        setError("Incorrect email or password !");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Your account isn't exits !");
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
        setError("Cannot check role !");
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
          Sign in with your account
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {isLoading && <div className="text-center">Processing login...</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgetpass"
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              Forgot password?
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
            {isLoading ? "Login...." : "Login"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with</span>
          </div>
        </div>

        <div className="grid grid-cols gap-4">
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
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have account?{" "}
          <Link to="/signup" className="text-orange-500 hover:text-orange-600">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
