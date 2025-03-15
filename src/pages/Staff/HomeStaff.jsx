import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { parseISO } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { StaffClients } from "../../components/Staff/Client/StaffClient";
import { StaffList } from "../../components/Staff/Employee/StaffList";
import { StaffSchedule } from "../../components/Staff/StaffSchedule";
import AppSidebar from "../../components/Staff/Sidebar";
import { Header } from "../../components/Staff/Header/Header";
import { BookingCalendar } from "../../components/Staff/Booking/BookingCalendar";
import { BookingDetails } from "../../components/Staff/Booking/BookingDetails";

const getToken = () => {
  return localStorage.getItem("token");
};

export default function HomeStaff() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isStaff = () => {
    try {
      const token = getToken();
      if (!token) {
        return false;
      }
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error(
          "Invalid token format: Token must have 3 parts separated by dots."
        );
      }
      const decodedToken = jwtDecode(token);
      return decodedToken.role === "STAFF" || decodedToken.isStaff === true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const staff = isStaff();
      if (!staff) {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }
        setError("Access denied. Only staff can view bookings.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = getToken();
        const response = await axios.get(
          "https://beautya-gr2-production.up.railway.app/api/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        console.log("API response data:", response.data);
        const data = response.data;
        const fetchedBookings = Array.isArray(data)
          ? data.filter((booking) => booking && typeof booking === "object")
          : [data].filter((booking) => booking && typeof booking === "object");
        console.log("Fetched bookings:", fetchedBookings);

        const mappedAppointments = fetchedBookings.map((booking) => {
          // Chuẩn hóa trạng thái từ BE
          const status = booking.status.toUpperCase();
          return {
            id: booking.bookingId ? booking.bookingId.toString() : "unknown",
            clientName: booking.clientName || booking.bookingId || "Unknown",
            service: booking.serviceNames
              ? booking.serviceNames.join(", ")
              : "Unknown Service",
            duration: booking.totalDuration || 60,
            time: booking.timeSlot || "N/A",
            date: booking.bookingDate
              ? parseISO(booking.bookingDate)
              : new Date(),
            therapist: booking.specialistId || "Unknown",
            status: status,
          };
        });

        setAppointments(mappedAppointments);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch bookings. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleStatusUpdate = (bookingId, newStatus) => {
    console.log("Updating status for bookingId:", bookingId, "to:", newStatus);
    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === bookingId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/staff/home":
      case "/staff/appointments":
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <BookingCalendar
                  appointments={appointments}
                  onAppointmentSelect={setSelectedAppointment}
                  selectedAppointmentId={selectedAppointment}
                />
              )}
            </div>
            <div className="w-full md:w-96 border rounded-lg bg-white shadow">
              {selectedAppointment ? (
                <BookingDetails
                  bookingId={selectedAppointment}
                  onStatusUpdate={handleStatusUpdate}
                />
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Select an appointment to view details
                </div>
              )}
            </div>
          </div>
        );
      case "/staff/clients":
        return <StaffClients />;
      case "/staff/skintherapist":
        return <StaffList />;
      case "/staff/schedule":
        return <StaffSchedule />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">{renderContent()}</main>
      </div>
    </div>
  );
}
