"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Filter,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Hàm parse booking date
const parseBookingDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Updated API URL to fetch all bookings (not just confirmed)
const BOOKING_API_URL =
  "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/bookings/confirmed";
const CASH_PAYMENT_API_URL =
  "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/v1/vnpay/cash-payment";

export default function BookingStaff() {
  const [bookings, setBookings] = useState([]);
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

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(BOOKING_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
        });

        console.log("API Response:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid or empty response from bookings API");
        }

        const bookingData = response.data.map((booking) => ({
          bookingId: booking.bookingId || "N/A",
          customerName: booking.customerName || "N/A",
          specialistName: booking.specialistName || "N/A",
          totalPrice: booking.totalPrice ? Number(booking.totalPrice) : 0,
          bookingDate: booking.bookingDate || "N/A",
          timeSlot: booking.timeSlot || "N/A",
          status: booking.status || "N/A",
          paymentStatus: booking.paymentStatus || "N/A",
        }));

        setBookings(bookingData);
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
                "Forbidden: You do not have permission to view bookings."
              );
              break;
            case 404:
              setError("No confirmed or in-progress bookings found.");
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

    fetchBookings();
  }, [hasFetched]);

  // Hàm xử lý thanh toán bằng tiền mặt
  const handleCashPayment = async (bookingId, amount) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.post(
        CASH_PAYMENT_API_URL,
        { bookingId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.data.message === "Cash payment processed successfully") {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId
              ? { ...booking, paymentStatus: "SUCCESS" }
              : booking
          )
        );
        alert(`Payment successful for Booking ID: ${bookingId}`);
      }
    } catch (error) {
      console.error("Cash Payment Error:", error);
      alert(
        `Failed to process payment: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Filter bookings based on selected filters and search term
  const filteredBookings = bookings
    .filter(
      (booking) =>
        (statusFilter === "all" || booking.status === statusFilter) &&
        (searchTerm === "" ||
          booking.bookingId.toString().includes(searchTerm) ||
          booking.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.specialistName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (dateFilter === "newest") {
        return new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0);
      }
      if (dateFilter === "oldest") {
        return new Date(a.bookingDate || 0) - new Date(b.bookingDate || 0);
      }
      return 0;
    });

  const resetFilters = () => {
    setDateFilter("all");
    setStatusFilter("all");
    setSearchTerm("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
            Loading bookings...
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
            Booking Dashboard
          </motion.h1>
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
                  placeholder="Search by ID, Customer, Specialist..."
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

                  <AnimatePresence>
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
                  </AnimatePresence>
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
                    {statusFilter === "CONFIRMED" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : statusFilter === "IN_PROGRESS" ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Filter className="w-4 h-4" />
                    )}
                    <span>
                      {statusFilter === "all"
                        ? "All Status"
                        : statusFilter === "CONFIRMED"
                        ? "Confirmed"
                        : "In Progress"}
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
                            statusFilter === "CONFIRMED"
                              ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                              : "text-gray-700"
                          } hover:bg-[#F8F2F5]`}
                          onClick={() => {
                            setStatusFilter("CONFIRMED");
                            setShowStatusDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            Confirmed
                          </div>
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${
                            statusFilter === "IN_PROGRESS"
                              ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                              : "text-gray-700"
                          } hover:bg-[#F8F2F5]`}
                          onClick={() => {
                            setStatusFilter("IN_PROGRESS");
                            setShowStatusDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-green-500" />
                            In Progress
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    Booking ID
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Customer
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Specialist
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Amount
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Date
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Time Slot
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Status
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Payment Status
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-[#3D021E] border-gray-200 border-b">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={booking.bookingId}
                      className={`border-gray-100 hover:bg-[#F8F2F5] ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/80"
                      } border-b transition-colors`}
                    >
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">
                        #{booking.bookingId}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {booking.customerName}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {booking.specialistName}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800 font-medium">
                        $
                        {booking.totalPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {parseBookingDate(booking.bookingDate)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {booking.timeSlot}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                            booking.paymentStatus
                          )}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {booking.paymentStatus !== "SUCCESS" ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md flex items-center gap-1"
                            onClick={() =>
                              handleCashPayment(
                                booking.bookingId,
                                booking.totalPrice
                              )
                            }
                          >
                            <DollarSign className="w-4 h-4" />
                            Pay Cash
                          </motion.button>
                        ) : (
                          <span className="text-emerald-600 font-medium">
                            Paid
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No booking records found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-6 border-gray-200 bg-white border-t flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>

            <div className="text-sm bg-[#F8F2F5] text-gray-600 px-4 py-2 rounded-lg">
              <span className="font-medium">Total: </span>
              <span className="font-bold text-[#3D021E]">
                $
                {bookings
                  .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
                  .toLocaleString(undefined, {
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
