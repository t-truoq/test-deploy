"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Added for loading animation consistency
import { XIcon } from "lucide-react"; // Added for consistent icon usage

const BASE_URL =
  "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings"; // Replace with valid ngrok URL

export default function OrderlistAdmin() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for filters
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [therapistFilter, setTherapistFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchAllBookings = async () => {
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
          timeout: 10000, // Add timeout to avoid hanging requests
        });

        console.log("API Response:", response.data);

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
          console.log("Formatted Orders:", formattedData);
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
  }, []); // Empty dependency array to run once on mount

  // Filter data based on filters
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
      Completed: "bg-green-100 border border-green-500 text-green-900", // Changed to green
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
          className="text-center bg-white border-gray-100 p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
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
          className="bg-white border-gray-200 p-6 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <div className="w-20 h-20 mx-auto mb-6 text-[#3D021E]">
            <svg
              className="h-20 w-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#3D021E] mb-2">{error}</h2>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Order List
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your booking orders
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-center gap-2">
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

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300"
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirm">Confirm</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Therapist Filter */}
              <input
                type="text"
                placeholder="Filter by Skin Therapist"
                value={therapistFilter}
                onChange={(e) => setTherapistFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300"
              />

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300"
              />

              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-[#3D021E] hover:text-[#4A0404] transition-colors"
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
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Skin Therapist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.therapist}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.detail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
          <div className="flex items-center justify-end px-6 py-3 border-t border-gray-200">
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
