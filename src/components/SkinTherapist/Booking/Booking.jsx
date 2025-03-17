"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings/specialist";

function Booking() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [localAppointments, setLocalAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800"
  };

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
            duration: booking.totalDuration, // Lấy trực tiếp totalDuration từ API
            status: booking.status,
            specialistName: booking.specialistName,
            totalPrice: booking.totalPrice, // Lấy trực tiếp totalPrice từ API
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt,
            checkInTime: booking.checkInTime,
            checkOutTime: booking.checkOutTime
          }));
          setLocalAppointments(specialistBookings);
        } else {
          throw new Error("Bookings data is not an array");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.response?.data?.message || error.message || "Failed to load bookings");
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
      minute: "2-digit"
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
    acc[date] = localAppointments.filter((a) => a.date === date)
      .filter((a) => {
        switch (activeTab) {
          case "pending": return a.status === "PENDING";
          case "confirmed": return a.status === "CONFIRMED";
          case "in_progress": return a.status === "IN_PROGRESS";
          case "completed": return a.status === "COMPLETED";
          case "cancelled": return a.status === "CANCELLED";
          case "all": return true;
          default: return true;
        }
      });
    return acc;
  }, {});

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-4">
          {[
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "in_progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
            { key: "all", label: "All" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 text-sm font-medium border-b-2 ${
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

      <div className="space-y-8">
        {Object.keys(filteredAppointmentsByDate).map((date) => {
          const dateAppointments = filteredAppointmentsByDate[date];
          if (dateAppointments.length === 0) return null;

          return (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-semibold">{formatDate(date)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white p-4 rounded-lg shadow-md border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{appointment.clientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusStyles[appointment.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Time: {appointment.timeSlot}</p>
                      <p>Duration: {appointment.duration ? `${appointment.duration} min` : "N/A"}</p>
                      <p>Price: {formatPrice(appointment.totalPrice)}</p>
                      <p>Specialist: {appointment.specialistName}</p>
                      {appointment.checkInTime && (
                        <p>Check-in: {formatTime(appointment.checkInTime)}</p>
                      )}
                      {appointment.checkOutTime && (
                        <p>Check-out: {formatTime(appointment.checkOutTime)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="mt-3 text-pink-600 hover:text-pink-800 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <p><strong>Client:</strong> {selectedAppointment.clientName}</p>
            <p><strong>Service:</strong> {selectedAppointment.service}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
            <p><strong>Time:</strong> {selectedAppointment.timeSlot}</p>
            <p><strong>Duration:</strong> {selectedAppointment.duration} min</p>
            <p><strong>Price:</strong> {formatPrice(selectedAppointment.totalPrice)}</p>
            <p><strong>Specialist:</strong> {selectedAppointment.specialistName}</p>
            {selectedAppointment.checkInTime && (
              <p><strong>Check-in:</strong> {formatTime(selectedAppointment.checkInTime)}</p>
            )}
            {selectedAppointment.checkOutTime && (
              <p><strong>Check-out:</strong> {formatTime(selectedAppointment.checkOutTime)}</p>
            )}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;