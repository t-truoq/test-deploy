"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const BASE_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/v1/vnpay";

export default function PaymentStaff() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid or empty response from payments API");
        }

        const paymentData = response.data.map((payment) => ({
          paymentId: payment.paymentId || "N/A",
          amount: payment.amount ? Number(payment.amount) : 0,
          paymentMethod: payment.paymentMethod || "N/A",
          paymentTime: payment.paymentTime || "N/A",
          status: payment.status || "N/A",
          transactionId: payment.transactionId || "N/A",
          bookingId: payment.bookingId || "N/A",
        }));
        setPayments(paymentData);
      } catch (error) {
        console.error("Detailed Error:", error);
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setError(
                "Bad Request: Please check the request format or token."
              );
              break;
            case 401:
              setError("Unauthorized: Please login again.");
              break;
            case 404:
              setError("No payment data found.");
              break;
            default:
              setError(
                error.response.data?.message ||
                  `API error (Status: ${error.response.status})`
              );
          }
        } else if (error.request) {
          setError("Unable to connect to server.");
        } else {
          setError(error.message || "An unexpected error occurred.");
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
          setHasFetched(true);
        }, 1500);
      }
    };

    fetchPayments();
  }, [hasFetched]);

  const filteredPayments = payments
    .filter(
      (payment) => statusFilter === "all" || payment.status === statusFilter
    )
    .filter((payment) => {
      if (!customDate) return true;
      const paymentDate = new Date(payment.paymentTime);
      const filterDate = new Date(customDate);
      return (
        paymentDate.getDate() === filterDate.getDate() &&
        paymentDate.getMonth() === filterDate.getMonth() &&
        paymentDate.getFullYear() === filterDate.getFullYear()
      );
    });

  const totalAmount = filteredPayments.reduce(
    (sum, payment) =>
      payment.status !== "FAILED" ? sum + (payment.amount || 0) : sum,
    0
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setCustomDate("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const parsePaymentTime = (timeString) => {
    if (!timeString || timeString === "N/A") return "N/A";
    return new Date(timeString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white border-gray-100 p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
            Loading payments...
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Please wait while we fetch your data
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-gray-200 p-6 sm:p-10 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-[#3D021E]"
          >
            <AlertCircle className="w-full h-full" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D021E] mb-2">
            Error
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] hover:from-[#4A0404] hover:to-[#7D1F4D] text-white rounded-lg transition-colors duration-300 shadow-md flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] mb-4 sm:mb-6"
        >
          Payment Dashboard
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-gray-200 rounded-xl shadow-xl border overflow-hidden backdrop-blur-sm"
        >
          <div className="p-4 sm:p-6 border-gray-200 border-b">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end">
                <div className="text-xs sm:text-sm text-[#3D021E] font-medium flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-[#3D021E] focus:ring-[#3D021E] outline-none"
                  placeholder="Select date"
                />
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg min-w-[120px] sm:min-w-[140px] ${
                      statusFilter !== "all"
                        ? "text-[#3D021E] border-[#3D021E]"
                        : "text-gray-700 border-gray-300"
                    } bg-white border`}
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <Filter className="w-4 h-4" />
                    <span>
                      {statusFilter === "all"
                        ? "All Status"
                        : statusFilter === "SUCCESS"
                        ? "Success"
                        : statusFilter === "PENDING"
                        ? "Pending"
                        : "Failed"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                  <AnimatePresence>
                    {showStatusDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-1 w-[130px] sm:w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
                      >
                        <button
                          className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                            statusFilter === "all"
                              ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                              : "text-gray-700"
                          } hover:bg-[#F8F2F5]`}
                          onClick={() => {
                            setStatusFilter("all");
                            setShowStatusDropdown(false);
                          }}
                        >
                          All Status
                        </button>
                        <button
                          className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                            statusFilter === "SUCCESS"
                              ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                              : "text-gray-700"
                          } hover:bg-[#F8F2F5]`}
                          onClick={() => {
                            setStatusFilter("SUCCESS");
                            setShowStatusDropdown(false);
                          }}
                        >
                          Success
                        </button>
                        <button
                          className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                            statusFilter === "PENDING"
                              ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                              : "text-gray-700"
                          } hover:bg-[#F8F2F5]`}
                          onClick={() => {
                            setStatusFilter("PENDING");
                            setShowStatusDropdown(false);
                          }}
                        >
                          Pending
                        </button>
                        <button
                          className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                            statusFilter === "FAILED"
                              ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                              : "text-gray-700"
                          } hover:bg-[#F8F2F5]`}
                          onClick={() => {
                            setStatusFilter("FAILED");
                            setShowStatusDropdown(false);
                          }}
                        >
                          Failed
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs sm:text-sm text-[#3D021E] hover:text-[#4A0404] transition-colors font-medium"
                  onClick={resetFilters}
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F2F5]">
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Payment ID
                  </th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Amount
                  </th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Payment Method
                  </th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Time
                  </th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Status
                  </th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Transaction ID
                  </th>
                  <th className="py-3 sm:py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Booking ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={payment.paymentId}
                      className={`border-gray-100 hover:bg-[#F8F2F5] ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/80"
                      } border-b transition-colors`}
                    >
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-800 font-medium">
                        #{payment.paymentId}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-800 font-medium">
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        ₫
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-800">
                        {payment.paymentMethod}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-800">
                        {parsePaymentTime(payment.paymentTime)}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-800">
                        {payment.transactionId}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-800">
                        #{payment.bookingId}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base"
                    >
                      No payment records found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden space-y-4 p-4">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={payment.paymentId}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Payment ID:
                      </span>
                      <span className="text-xs text-gray-800 font-medium">
                        #{payment.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Amount:
                      </span>
                      <span className="text-xs text-gray-800 font-medium">
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        ₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Method:
                      </span>
                      <span className="text-xs text-gray-800">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Time:
                      </span>
                      <span className="text-xs text-gray-800">
                        {parsePaymentTime(payment.paymentTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Transaction ID:
                      </span>
                      <span className="text-xs text-gray-800">
                        {payment.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Booking ID:
                      </span>
                      <span className="text-xs text-gray-800">
                        #{payment.bookingId}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm py-6">
                No payment records found matching your filters
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 border-gray-200 bg-white border-t flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
            <div className="text-xs sm:text-sm bg-[#F8F2F5] text-gray-600 px-3 sm:px-4 py-2 rounded-lg">
              <span className="font-medium">Total: </span>
              <span className="font-bold text-[#3D021E]">
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ₫
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
