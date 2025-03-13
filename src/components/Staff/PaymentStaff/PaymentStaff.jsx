"use client";

import axios from "axios";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart4,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Hàm parse payment_time từ định dạng API
const parsePaymentTime = (timeString) => {
  if (!timeString || timeString === "N/A") return "N/A";
  const date = new Date(timeString.replace(" ", "T") + "Z");
  return date.toLocaleString();
};

const BASE_URL =
  "https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/v1/vnpay";

export default function PaymentStaff() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (hasFetched) return;

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

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
          paymentMethod: payment.paymentMethod || "VNPAY",
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
            case 403:
              setError(
                "Forbidden: You do not have permission to view payments."
              );
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

  // Filter payments based on selected filters and search term
  const filteredPayments = payments
    .filter(
      (payment) =>
        (statusFilter === "all" || payment.status === statusFilter) &&
        (searchTerm === "" ||
          payment.paymentId.toString().includes(searchTerm) ||
          payment.bookingId.toString().includes(searchTerm) ||
          payment.transactionId.toString().includes(searchTerm))
    )
    .sort((a, b) => {
      if (dateFilter === "newest") {
        return new Date(b.paymentTime || 0) - new Date(a.paymentTime || 0);
      }
      if (dateFilter === "oldest") {
        return new Date(a.paymentTime || 0) - new Date(b.paymentTime || 0);
      }
      return 0;
    });

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  const successCount = filteredPayments.filter(
    (payment) => payment.status === "SUCCESS"
  ).length;
  const failedCount = filteredPayments.filter(
    (payment) => payment.status === "FAILED"
  ).length;

  const resetFilters = () => {
    setDateFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white border-gray-100 p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-20 h-20 rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-xl text-[#3D021E] font-medium">
            Loading payments...
          </h3>
          <p className="text-gray-500 mt-2">
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
          className="bg-white border-gray-200 p-10 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 text-[#3D021E]"
          >
            <AlertCircle className="w-full h-full" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#3D021E] mb-2">Error</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] hover:from-[#4A0404] hover:to-[#7D1F4D] text-white rounded-lg transition-colors duration-300 shadow-md flex items-center justify-center gap-2 mx-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]"
          >
            Payment Dashboard
          </motion.h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Payments Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border-gray-200 rounded-xl shadow-lg p-6 border backdrop-blur-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">
                  {filteredPayments.length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-[#F8F2F5] text-[#3D021E]">
                <BarChart4 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-500">Success</span>
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {successCount}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-500">Failed</span>
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {failedCount}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Total Amount Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border-gray-200 rounded-xl shadow-lg p-6 border backdrop-blur-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">
                  $
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-[#F8F2F5] text-[#3D021E]">
                <Download className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(successCount / filteredPayments.length) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Success Rate</span>
                <span className="text-xs font-medium text-gray-900">
                  {filteredPayments.length > 0
                    ? `${Math.round(
                        (successCount / filteredPayments.length) * 100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-gray-200 rounded-xl shadow-xl border overflow-hidden backdrop-blur-sm"
        >
          {/* Search and Filters */}
          <div className="p-6 border-gray-200 border-b">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md text-gray-900">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-[#3D021E] focus:border-[#3D021E] border outline-none focus:ring-2"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-[#3D021E] font-medium flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-lg min-w-[140px] ${
                      dateFilter !== "all"
                        ? "text-[#3D021E] border-[#3D021E]"
                        : "text-gray-700 border-gray-300"
                    } bg-white border`}
                    onClick={() => {
                      setShowDateDropdown(!showDateDropdown);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {dateFilter === "all"
                        ? "All Dates"
                        : dateFilter === "newest"
                        ? "Newest First"
                        : "Oldest First"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  {showDateDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-1 w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dateFilter === "all"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setDateFilter("all");
                          setShowDateDropdown(false);
                        }}
                      >
                        All Dates
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dateFilter === "newest"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setDateFilter("newest");
                          setShowDateDropdown(false);
                        }}
                      >
                        Newest First
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dateFilter === "oldest"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setDateFilter("oldest");
                          setShowDateDropdown(false);
                        }}
                      >
                        Oldest First
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-lg min-w-[140px] ${
                      statusFilter !== "all"
                        ? "text-[#3D021E] border-[#3D021E]"
                        : "text-gray-700 border-gray-300"
                    } bg-white border`}
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowDateDropdown(false);
                    }}
                  >
                    {statusFilter === "SUCCESS" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : statusFilter === "FAILED" ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Filter className="w-4 h-4" />
                    )}
                    <span>
                      {statusFilter === "all"
                        ? "All Status"
                        : statusFilter === "SUCCESS"
                        ? "Success"
                        : "Failed"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  {showStatusDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-1 w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
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
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "SUCCESS"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setStatusFilter("SUCCESS");
                          setShowStatusDropdown(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Success
                        </div>
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "FAILED"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setStatusFilter("FAILED");
                          setShowStatusDropdown(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Failed
                        </div>
                      </button>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-[#3D021E] hover:text-[#4A0404] transition-colors font-medium"
                  onClick={resetFilters}
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F2F5]">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Payment ID
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Amount
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Payment Method
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Payment Time
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Status
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Transaction ID
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
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
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">
                        #{payment.paymentId}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">
                        $
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {payment.paymentMethod}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {parsePaymentTime(payment.paymentTime)}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {payment.transactionId}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        #{payment.bookingId}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No payment records found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-6 border-gray-200 bg-white border-t flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>

            <div className="text-sm bg-[#F8F2F5] text-gray-600 px-4 py-2 rounded-lg">
              <span className="font-medium">Total: </span>
              <span className="font-bold text-[#3D021E]">
                $
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
