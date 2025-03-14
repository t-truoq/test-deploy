import { useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import axios from "axios";

export function BookingDetails({ bookingId, onStatusUpdate }) {
  const [booking, setBooking] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const serviceDurationMap = {
    "Lấy Nhân Mụn Chuẩn Y Khoa": 45,
    "Exo Booster": 30,
    "Oil Control & Acne Care, Acne Control Facial": 60,
    "Premium Hair Cut": 60,
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        const response = await axios.get(
          `https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = response.data;
        console.log("Booking data:", data);

        const enhancedBooking = {
          ...data,
          services: Array.isArray(data.serviceNames)
            ? data.serviceNames.map((name, index) => ({
                id: index + 1,
                name,
                duration: serviceDurationMap[name] || 0,
                price: data.totalPrice / (data.serviceNames.length || 1) || 0,
              }))
            : [],
        };

        const totalDuration = enhancedBooking.services.reduce(
          (sum, service) => sum + (service.duration || 0),
          0
        );

        // Chuẩn hóa trạng thái từ BE
        const status = data.status.toUpperCase();

        setBooking({ ...enhancedBooking, totalDuration, status });
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch booking details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token for status update:", token, "New Status:", newStatus);
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      let endpoint = "";
      switch (newStatus.toUpperCase()) {
        case "CANCELLED":
          endpoint = `/api/bookings/${bookingId}/cancel`;
          break;
        case "COMPLETED":
          endpoint = `/api/bookings/${bookingId}/checkout`;
          break;
        case "CONFIRMED":
          endpoint = `/api/bookings/${bookingId}/confirm`;
          break;
        case "IN_PROGRESS":
          endpoint = `/api/bookings/${bookingId}/checkin`; // Dùng endpoint /checkin
          break;
        default:
          endpoint = `/api/bookings/${bookingId}/confirm`;
          break;
      }

      const response = await axios({
        method: "POST",
        url: `https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        data: { status: newStatus.toUpperCase() },
      });

      if (response.status === 200) {
        const updatedStatus = newStatus.toUpperCase();
        setBooking((prev) => ({
          ...prev,
          status: updatedStatus,
        }));
        setIsStatusDialogOpen(false);
        if (onStatusUpdate) {
          onStatusUpdate(bookingId, updatedStatus);
          console.log("Status updated to:", updatedStatus);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking status. Please try again later."
      );
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!booking) {
    return (
      <div className="p-6 text-center text-gray-500">Appointment not found</div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            Pending
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            Cancelled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
            COMPLETED
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Appointment Details
            </h2>
            <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Date</span>
              <span className="flex items-center gap-1 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {format(new Date(booking.bookingDate), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Time</span>
              <span className="flex items-center gap-1 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {booking.timeSlot} (Total: {booking.totalDuration || 0} min)
              </span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            {booking.services.map((service, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Service {index + 1}
                </span>
                <span className="font-medium text-gray-800">
                  {service.name} ({service.duration} min) - $
                  {service.price.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Price</span>
              <span className="font-medium text-gray-800">
                ${booking.totalPrice || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Specialist ID</span>
              <span className="text-gray-800">
                {booking.specialistId || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t">
        <div className="flex gap-2">
          {/* Add additional buttons if needed */}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            Edit Status
          </button>
        </div>
      </div>

      {isStatusDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Edit Appointment Status
            </h3>
            <p className="text-gray-600 mb-4">
              Change the status of this appointment.
            </p>
            <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-800">
                  {booking.serviceNames.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.bookingDate), "MMMM d, yyyy")} at{" "}
                  {booking.timeSlot}
                </p>
              </div>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {/* <button
                    className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("PENDING")}
                  >
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    Pending
                  </button> */}
                  <button
                    className="px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("CONFIRMED")}
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Confirm
                  </button>
                  <button
                    className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("IN_PROGRESS")}
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    In Progress
                  </button>
                  <button
                    className="px-4 py-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("COMPLETED")}
                  >
                    <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                    Completed
                  </button>
                  <button
                    className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("CANCELLED")}
                  >
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

BookingDetails.propTypes = {
  bookingId: PropTypes.string.isRequired,
  onStatusUpdate: PropTypes.func,
};

BookingDetails.defaultProps = {
  onStatusUpdate: () => {},
};
