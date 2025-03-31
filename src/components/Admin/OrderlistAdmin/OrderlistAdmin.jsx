"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";

const BASE_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings";

export default function OrderlistAdmin() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [therapistFilter, setTherapistFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
          timeout: 10000,
        });

        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((booking) => ({
            id: booking.bookingId.toString(),
            name: booking.customerName || `Customer ${booking.customerId}`,
            therapist:
              booking.specialistName || `Specialist ${booking.specialistId}`,
            date: booking.bookingDate,
            detail: booking.serviceNames
              ? booking.serviceNames.join(", ")
              : "N/A",
            status: booking.status
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          }));
          setOrders(formattedData);
          setFilteredOrders(formattedData);
        } else {
          throw new Error("Bookings data is not an array");
        }
      } catch (error) {
        console.error("Detailed Error:", error);
        if (error.response) {
          setError(
            `Server Error: ${error.response.status} - ${
              error.response.data?.message || "Failed to load bookings"
            }`
          );
        } else if (error.request) {
          setError(
            "Network Error: Unable to connect to the server. Check your ngrok URL or internet connection."
          );
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (statusFilter && statusFilter !== "All Status") {
      result = result.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (therapistFilter) {
      result = result.filter((order) =>
        order.therapist.toLowerCase().includes(therapistFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      result = result.filter((order) => order.date.includes(dateFilter));
    }
    setFilteredOrders(result);
  }, [statusFilter, therapistFilter, dateFilter, orders]);

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 border border-yellow-500 text-yellow-900",
      Confirm: "bg-green-100 border border-green-500 text-green-900",
      "In Progress": "bg-blue-100 border border-blue-500 text-blue-900",
      Completed: "bg-green-100 border border-green-500 text-green-900",
      Cancelled: "bg-red-100 border border-red-500 text-red-900",
    };
    return colors[status] || "bg-gray-100 border border-gray-300 text-gray-800";
  };

  const resetFilters = () => {
    setStatusFilter("All Status");
    setTherapistFilter("");
    setDateFilter("");
    setFilteredOrders(orders);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-6 rounded-xl shadow-lg border"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-lg text-[#3D021E] font-medium">
            Loading bookings...
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
          className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <h2 className="text-xl font-bold text-[#3D021E] mb-2">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors mt-4"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
            Order List
          </h2>
          <p className="text-sm text-gray-600">Manage your booking orders</p>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 4h18M3 12h18M3 20h18" />
                </svg>
                Filter By
              </button>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirm">Confirm</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <input
                type="text"
                placeholder="Filter by Skin Therapist"
                value={therapistFilter}
                onChange={(e) => setTherapistFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
              />

              <button
                onClick={resetFilters}
                className="w-full sm:w-auto px-4 py-2 text-sm text-[#3D021E] hover:text-[#4A0404] transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Skin Therapist
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="hidden md:table-cell px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.name}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.therapist}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 sm:px-6 sm:py-4 whitespace-normal text-sm text-gray-600 max-w-[150px]">
                      {order.detail}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end px-4 py-3 sm:px-6 border-t border-gray-200">
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
