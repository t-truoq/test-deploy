"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundLogin from "../componentsLogin/BackgroundLogin";

// Icons as inline SVG components to avoid external dependencies
const ArrowLeftIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const MailIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const KeyRoundIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const LockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const SendIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đổi mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra định dạng email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gửi OTP về email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Kiểm tra định dạng email trước khi gửi
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/forgotPassword/verifyMail/${email}`,

        {}, // Backend có thể không yêu cầu body, gửi body rỗng
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Send OTP response:", response.data);

      setSuccess("OTP has been sent to your email. Please check your inbox.");
      setOtpSent(true);
      setStep(2); // Chuyển sang bước nhập OTP
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Status:", error.response.status);
        if (error.response.status === 400) {
          // Nếu OTP được gửi nhưng backend trả về lỗi 400, bỏ qua lỗi và tiếp tục
          setSuccess(
            "OTP has been sent to your email. Please check your inbox."
          );
          setOtpSent(true);
          setStep(2); // Chuyển sang bước nhập OTP
        } else if (error.response.status === 404) {
          setError("Email not found. Please check your email address.");
        } else {
          setError(
            error.response.data.message ||
              "Failed to send OTP. Please try again."
          );
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        setError("Unable to connect to server. Please try again.");
      } else {
        setError(error.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/forgotPassword/verifyOtp/${otp}/${email}`,

        {},
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Verify OTP response:", response.data);

      setSuccess("OTP verified successfully!");
      setOtpVerified(true);
      setStep(3); // Chuyển sang bước đổi mật khẩu
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Status:", error.response.status);
        if (error.response.status === 400) {
          setError(
            error.response.data.message ||
              "Invalid or expired OTP. Please try again."
          );
        } else {
          setError(
            error.response.data.message ||
              "Failed to verify OTP. Please try again."
          );
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        setError("Unable to connect to server. Please try again.");
      } else {
        setError(error.message || "Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Kiểm tra mật khẩu khớp
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    // Kiểm tra yêu cầu mật khẩu (chứa chữ hoa, chữ thường, số, ký tự đặc biệt)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/forgotPassword/changePassword/${email}`,

        {
          password: newPassword,
          repeatPassword: confirmPassword,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Change password response:", response.data);

      // Store success message in localStorage to display on login page
      localStorage.setItem(
        "passwordResetSuccess",
        "Your password has been changed successfully!"
      );

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Status:", error.response.status);
        if (error.response.status === 400) {
          setError(
            error.response.data.message ||
              "Failed to change password. Please try again."
          );
        } else if (error.response.status === 401) {
          setError("Unauthorized: OTP session expired. Please start over.");
          setTimeout(() => {
            setStep(1);
            setOtpSent(false);
            setOtpVerified(false);
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
          }, 2000);
        } else {
          setError(
            error.response.data.message ||
              "Failed to change password. Please try again."
          );
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        setError("Unable to connect to server. Please try again.");
      } else {
        setError(
          error.message || "Failed to change password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Progress indicator for the steps
  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div
          className={`flex items-center ${
            step >= 1 ? "text-[#FF6B2B]" : "text-gray-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 1 ? "border-[#FF6B2B] bg-[#FFF1EB]" : "border-gray-300"
            }`}
          >
            <MailIcon className="h-4 w-4" />
          </div>
          <span className="ml-2 text-sm font-medium">Email</span>
        </div>
        <div
          className={`w-12 h-1 mx-2 ${
            step >= 2 ? "bg-[#FF6B2B]" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex items-center ${
            step >= 2 ? "text-[#FF6B2B]" : "text-gray-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 2 ? "border-[#FF6B2B] bg-[#FFF1EB]" : "border-gray-300"
            }`}
          >
            <KeyRoundIcon className="h-4 w-4" />
          </div>
          <span className="ml-2 text-sm font-medium">OTP</span>
        </div>
        <div
          className={`w-12 h-1 mx-2 ${
            step >= 3 ? "bg-[#FF6B2B]" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex items-center ${
            step >= 3 ? "text-[#FF6B2B]" : "text-gray-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 3 ? "border-[#FF6B2B] bg-[#FFF1EB]" : "border-gray-300"
            }`}
          >
            <LockIcon className="h-4 w-4" />
          </div>
          <span className="ml-2 text-sm font-medium">Reset</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <BackgroundLogin />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 && "Forgot Your Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a strong password for your account"}
            </p>
          </div>

          {renderProgressSteps()}

          {/* Hiển thị lỗi hoặc thông báo thành công */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
              <div className="flex-shrink-0 mr-2 mt-0.5">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>{error}</div>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-start">
              <div className="flex-shrink-0 mr-2 mt-0.5">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <div>{success}</div>
            </div>
          )}

          {/* Bước 1: Nhập email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF6B2B] focus:border-[#FF6B2B] sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B2B] hover:bg-[#FF8F5B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2B] transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <SendIcon
                          className="h-5 w-5 text-[#FF8F5B] group-hover:text-[#FFF1EB]"
                          aria-hidden="true"
                        />
                      </span>
                      Send OTP
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bước 2: Nhập OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code (OTP)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRoundIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF6B2B] focus:border-[#FF6B2B] sm:text-sm"
                    placeholder="Enter OTP"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please check your email inbox for the verification code.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B2B] hover:bg-[#FF8F5B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2B] transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <KeyRoundIcon
                          className="h-5 w-5 text-[#FF8F5B] group-hover:text-[#FFF1EB]"
                          aria-hidden="true"
                        />
                      </span>
                      Verify OTP
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-sm font-medium text-[#FF6B2B] hover:text-[#FF8F5B] transition duration-150 ease-in-out"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}

          {/* Bước 3: Đổi mật khẩu */}
          {step === 3 && (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="new-password"
                      name="new-password"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF6B2B] focus:border-[#FF6B2B] sm:text-sm"
                      placeholder="New Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF6B2B] focus:border-[#FF6B2B] sm:text-sm"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    Password must contain:
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1 pl-5 list-disc">
                    <li>At least 6 characters</li>
                    <li>At least one uppercase letter (A-Z)</li>
                    <li>At least one lowercase letter (a-z)</li>
                    <li>At least one number (0-9)</li>
                    <li>At least one special character (@$!%*?&)</li>
                  </ul>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B2B] hover:bg-[#FF8F5B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2B] transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LockIcon
                          className="h-5 w-5 text-[#FF8F5B] group-hover:text-[#FFF1EB]"
                          aria-hidden="true"
                        />
                      </span>
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-center mt-6">
            <a
              href="/login"
              className="text-sm font-medium text-[#FF6B2B] hover:text-[#FF8F5B] flex items-center transition duration-150 ease-in-out"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to login
            </a>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
