"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const BASE_URL =
  "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings/specialist";

function Booking() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [localAppointments, setLocalAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile tab navigation

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const tabs = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "in_progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "all", label: "All" },
  ];

  useEffect(() => {
    if (hasFetched) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const decodedToken = jwtDecode(token);
        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
        });

        if (Array.isArray(response.data)) {
          const specialistBookings = response.data.map((booking) => ({
            id: booking.bookingId.toString(),
            clientName: booking.customerName || "Unknown Customer",
            service: booking.serviceNames?.join(", ") || "N/A",
            date: booking.bookingDate,
            timeSlot: booking.timeSlot,
            duration: booking.totalDuration,
            status: booking.status,
            specialistName: booking.specialistName,
            totalPrice: booking.totalPrice,
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt,
            checkInTime: booking.checkInTime,
            checkOutTime: booking.checkOutTime,
          }));
          setLocalAppointments(specialistBookings);
        } else {
          throw new Error("Bookings data is not an array");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load bookings"
        );
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchBookings();
  }, [hasFetched]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return (price / 1000).toLocaleString() + "K VND";
  };

  const filteredAppointmentsByDate = Object.keys(
    localAppointments.reduce((acc, appointment) => {
      if (!acc[appointment.date]) acc[appointment.date] = [];
      acc[appointment.date].push(appointment);
      return acc;
    }, {})
  ).reduce((acc, date) => {
    acc[date] = localAppointments
      .filter((a) => a.date === date)
      .filter((a) => {
        switch (activeTab) {
          case "pending":
            return a.status === "PENDING";
          case "confirmed":
            return a.status === "CONFIRMED";
          case "in_progress":
            return a.status === "IN_PROGRESS";
          case "completed":
            return a.status === "COMPLETED";
          case "cancelled":
            return a.status === "CANCELLED";
          case "all":
            return true;
          default:
            return true;
        }
      });
    return acc;
  }, {});

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null); // Clear selected appointment when closing
  };

  // Handle tab menu toggle for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Set active tab and close dropdown on mobile
  const selectTab = (tabKey) => {
    setActiveTab(tabKey);
    setIsMenuOpen(false);
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
            Loading Schedule...
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md border border-red-200 max-w-md">
          <h3 className="text-xl font-bold text-red-600 mb-3">Error</h3>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] mb-6">
        My Schedule
      </h2>

      {/* Mobile Tab Navigation (Dropdown) */}
      <div className="md:hidden relative mb-6">
        <button
          onClick={toggleMenu}
          className="w-full flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm"
        >
          <span className="font-medium text-gray-700">
            {tabs.find((tab) => tab.key === activeTab)?.label || "Filter"}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isMenuOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border">
            <div className="py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => selectTab(tab.key)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    activeTab === tab.key
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block border-b border-gray-200 mb-6">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-3 text-sm font-medium border-b-2 ${
                activeTab === tab.key
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* No appointments message */}
      {Object.keys(filteredAppointmentsByDate).length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No appointments found
          </h3>
          <p className="text-gray-500">
            There are no appointments in the selected category.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {Object.keys(filteredAppointmentsByDate).map((date) => {
          const dateAppointments = filteredAppointmentsByDate[date];
          if (dateAppointments.length === 0) return null;

          return (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 sticky top-0 bg-gray-50 py-2 z-10">
                {formatDate(date)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {appointment.clientName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate max-w-full">
                          {appointment.service}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusStyles[appointment.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <p className="text-gray-600">Time:</p>
                        <p className="font-medium">{appointment.timeSlot}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Duration:</p>
                        <p className="font-medium">
                          {appointment.duration
                            ? `${appointment.duration} min`
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Price:</p>
                        <p className="font-medium">
                          {formatPrice(appointment.totalPrice)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="mt-4 w-full text-center bg-white border border-pink-500 text-pink-600 hover:bg-pink-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog - Improved Responsive Version */}
      {isDialogOpen && selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={handleCloseDialog}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <button
                onClick={handleCloseDialog}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-xl font-bold mb-5 pr-8 text-gray-800">
                Booking Details
              </h2>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">
                    {selectedAppointment.clientName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      statusStyles[selectedAppointment.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.service}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedAppointment.date)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {selectedAppointment.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {selectedAppointment.duration} min
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {formatPrice(selectedAppointment.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600">Specialist:</span>
                  <span className="font-medium">
                    {selectedAppointment.specialistName}
                  </span>
                </div>
                {selectedAppointment.checkInTime && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {formatTime(selectedAppointment.checkInTime)}
                    </span>
                  </div>
                )}
                {selectedAppointment.checkOutTime && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {formatTime(selectedAppointment.checkOutTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 rounded-b-lg">
              <button
                onClick={handleCloseDialog}
                className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default Booking;
