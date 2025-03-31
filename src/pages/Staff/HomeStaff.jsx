import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { parseISO } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
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
  const [loadingAppointments, setLoadingAppointments] = useState(false); // Chỉ dùng cho lịch hẹn
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isStaff = () => {
    try {
      const token = getToken();
      if (!token) return false;
      const decodedToken = jwtDecode(token);
      return decodedToken.role === "STAFF" || decodedToken.isStaff === true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isStaff()) {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }
        setError("Access denied. Only staff can view bookings.");
        return;
      }

      // Chỉ fetch dữ liệu nếu đang ở trang cần hiển thị lịch hẹn
      if (
        location.pathname === "/staff/home" ||
        location.pathname === "/staff/appointments"
      ) {
        try {
          setLoadingAppointments(true);
          const token = getToken();
          const response = await axios.get(
            "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          const data = Array.isArray(response.data)
            ? response.data
            : [response.data];
          const fetchedBookings = data.filter(
            (booking) => booking && typeof booking === "object"
          );

          const mappedAppointments = fetchedBookings.map((booking) => ({
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
            status: booking.status.toUpperCase(),
          }));

          setAppointments(mappedAppointments);
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setError(
            error.response?.data?.message || "Failed to fetch bookings."
          );
        } finally {
          setTimeout(() => setLoadingAppointments(false), 1500); // Simulate delay for UX
        }
      }
    };

    fetchBookings();
  }, [navigate, location.pathname]); // Thêm location.pathname vào dependency để chạy lại khi đổi trang

  const handleStatusUpdate = (bookingId, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) =>
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
              <BookingCalendar
                appointments={appointments}
                onAppointmentSelect={setSelectedAppointment}
                selectedAppointmentId={selectedAppointment}
                loading={loadingAppointments}
                error={error}
              />
            </div>
            <div className="w-full md:w-96 border rounded-lg bg-white shadow">
              {selectedAppointment ? (
                <BookingDetails
                  bookingId={selectedAppointment}
                  onStatusUpdate={handleStatusUpdate}
                  loading={loadingAppointments}
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

  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-white border-gray-100 p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
          />
        </div>
        <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
          Loading Appointments...
        </h3>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Please wait while we fetch your data
        </p>
      </motion.div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {loadingAppointments &&
          (location.pathname === "/staff/home" ||
            location.pathname === "/staff/appointments") ? (
            renderLoading()
          ) : error &&
            (location.pathname === "/staff/home" ||
              location.pathname === "/staff/appointments") ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}
