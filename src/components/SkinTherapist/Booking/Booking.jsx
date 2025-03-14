"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import BookingCard from "./BookingCard";
import BookingDialog from "./BookingDialog";

const BASE_URL =
  "https://a66f-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/bookings/specialist";

function Booking() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [localAppointments, setLocalAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
        });

        console.log("Bookings API Response:", response.data);

        if (Array.isArray(response.data)) {
          const specialistBookings = response.data.map((booking) => ({
            id: booking.bookingId.toString(),
            clientName: booking.customerName || "Unknown Customer", // Sử dụng customerName từ API, fallback nếu null
            service: booking.serviceNames
              ? booking.serviceNames.join(", ")
              : "N/A",
            date: booking.bookingDate,
            time: booking.timeSlot.split("-")[0],
            duration: calculateDuration(booking.timeSlot),
            status: booking.status.toLowerCase().replace("_", " "),
          }));
          setLocalAppointments(specialistBookings);
        } else {
          throw new Error("Bookings data is not an array");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.");
          } else if (error.response.status === 404) {
            setError("No bookings found for this specialist.");
          } else {
            setError(error.response.data.message || "Failed to load bookings.");
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(error.message || "Failed to load bookings.");
        }
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchBookings();
  }, [hasFetched]);

  const calculateDuration = (timeSlot) => {
    if (!timeSlot || !timeSlot.includes("-")) return "N/A";
    const [start, end] = timeSlot.split("-");
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);
    const diffMs = endDate - startDate;
    const minutes = Math.round(diffMs / 60000);
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const filteredAppointmentsByDate = Object.keys(
    localAppointments.reduce((acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    }, {})
  ).reduce((acc, date) => {
    if (activeTab === "upcoming") {
      acc[date] = localAppointments.filter(
        (a) => a.date === date && a.status === "pending"
      );
    } else if (activeTab === "confirmed") {
      acc[date] = localAppointments.filter(
        (a) => a.date === date && a.status === "confirmed"
      );
    } else {
      acc[date] = localAppointments.filter((a) => a.date === date);
    }
    return acc;
  }, {});

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A0404] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-6 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`mr-8 py-2 text-sm font-medium border-b-2 ${
              activeTab === "upcoming"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`mr-8 py-2 text-sm font-medium border-b-2 ${
              activeTab === "confirmed"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 text-sm font-medium border-b-2 ${
              activeTab === "all"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Appointments
          </button>
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
                  <BookingCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedAppointment && (
        <BookingDialog
          appointment={selectedAppointment}
          onClose={() => setIsDialogOpen(false)}
          formatDate={formatDate}
          isOpen={isDialogOpen}
        />
      )}
    </div>
  );
}

export default Booking;
