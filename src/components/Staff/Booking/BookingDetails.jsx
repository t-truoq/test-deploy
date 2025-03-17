import { useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import axios from "axios";

export function BookingDetails({ bookingId, onStatusUpdate }) {
  const [booking, setBooking] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    specialistId: "",
    serviceIds: [],
    bookingDate: "",
    startTime: "",
  });
  const [servicesList, setServicesList] = useState([]);
  const [specialistsList, setSpecialistsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        // Fetch the list of services
        const servicesResponse = await axios.get(
          `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/services`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setServicesList(servicesResponse.data);

        // Fetch the booking details
        const bookingResponse = await axios.get(
          `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = bookingResponse.data;

       
        const services = Array.isArray(data.serviceNames)
          ? data.serviceNames.map((name, index) => ({
              id: index + 1,
              name,
              duration: data.serviceDurations[name] || 0,
              price: data.servicePrices[name] || 0,
            }))
          : [];

        const enhancedBooking = {
          ...data,
          services,
          totalDuration: data.totalDuration || services.reduce((sum, service) => sum + (service.duration || 0), 0),
        };
        const status = data.status.toUpperCase();
        setBooking({ ...enhancedBooking, status });

        // Fetch the list of specialists
        const specialistsResponse = await axios.get(
          `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users/specialists/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setSpecialistsList(specialistsResponse.data);

        // Initialize the edit form
        const initialServiceIds = Array.isArray(data.serviceNames)
          ? data.serviceNames
              .map((name) =>
                servicesList.find((s) => s.name === name)?.serviceId
              )
              .filter(Boolean)
          : [];

        setEditForm({
          specialistId: data.specialistId ? String(data.specialistId) : "",
          serviceIds: initialServiceIds.map(String),
          bookingDate: data.bookingDate || "",
          startTime: data.timeSlot ? data.timeSlot.split("-")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch data. Please try again later."
        );
        setIsErrorDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
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
          endpoint = `/api/bookings/${bookingId}/checkin`;
          break;
        default:
          endpoint = `/api/bookings/${bookingId}/confirm`;
          break;
      }

      const response = await axios({
        method: "POST",
        url: `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app${endpoint}`,
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
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking status. Please try again later."
      );
      setIsErrorDialogOpen(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const requestBody = {
        specialistId: editForm.specialistId
          ? Number(editForm.specialistId)
          : null,
        bookingDate: editForm.bookingDate,
        startTime: editForm.startTime,
        serviceIds: editForm.serviceIds.map(Number),
      };

      const response = await axios.put(
        `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings/${bookingId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (response.status === 200) {
        const updatedData = response.data;

        // Map updated service data
        const services = Array.isArray(updatedData.serviceNames)
          ? updatedData.serviceNames.map((name, index) => ({
              id: index + 1,
              name,
              duration: updatedData.serviceDurations[name] || 0,
              price: updatedData.servicePrices[name] || 0,
            }))
          : [];

        const enhancedBooking = {
          ...updatedData,
          services,
          totalDuration: updatedData.totalDuration || services.reduce((sum, service) => sum + (service.duration || 0), 0),
        };
        setBooking({
          ...enhancedBooking,
          status: updatedData.status
            ? updatedData.status.toUpperCase()
            : booking.status,
        });

        const updatedServiceIds = Array.isArray(updatedData.serviceNames)
          ? updatedData.serviceNames
              .map((name) =>
                servicesList.find((s) => s.name === name)?.serviceId
              )
              .filter(Boolean)
          : [];

        setEditForm({
          specialistId: updatedData.specialistId
            ? String(updatedData.specialistId)
            : "",
          serviceIds: updatedServiceIds.map(String),
          bookingDate: updatedData.bookingDate || "",
          startTime: updatedData.timeSlot
            ? updatedData.timeSlot.split("-")[0]
            : "",
        });

        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking. Please try again later."
      );
      setIsErrorDialogOpen(true);
    }
  };

  const toggleService = (serviceId) => {
    setEditForm((prev) => {
      const serviceIds = prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId];
      return { ...prev, serviceIds };
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const isEditAllowed = () => {
    return booking?.status !== "IN_PROGRESS" && booking?.status !== "COMPLETED";
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
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
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
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
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
            Completed
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
  // Find the specialist name from the specialistsList
  const specialistName = booking.specialistName || "Unknown"; // Use specialistName from API response

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
                {booking.timeSlot}
              </span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            {booking.services.length > 0 ? (
              booking.services.map((service, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Service {index + 1}
                  </span>
                  <span className="font-medium text-gray-800">
                    {service.name} ({service.duration} min) - $
                    {service.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No services available</div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Price</span>
              <span className="font-medium text-gray-800">
                ${booking.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Specialist</span>
              <span className="text-gray-800">{specialistName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-white rounded-md text-sm font-medium flex items-center ${
              isEditAllowed()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => isEditAllowed() && setIsEditDialogOpen(true)}
            disabled={!isEditAllowed()}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Booking
          </button>
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
    {/* ... previous code ... */}
    <div className="grid gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="status"
          className="text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            className="px-4 py-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center"
            onClick={() => handleStatusUpdate("CONFIRMED")}
          >
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
            Confirm
          </button>
          <button
            className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
            onClick={() => handleStatusUpdate("IN_PROGRESS")}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            Check In
          </button>
          <button
            className="px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 flex items-center justify-center"
            onClick={() => handleStatusUpdate("COMPLETED")}
          >
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Check Out
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

      {isEditDialogOpen && isEditAllowed() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Booking Details
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Specialist
                </label>
                <select
                  value={editForm.specialistId}
                  onChange={(e) =>
                    handleEditChange("specialistId", e.target.value)
                  }
                  className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a specialist</option>
                  {specialistsList.map((specialist) => (
                    <option
                      key={specialist.userId}
                      value={String(specialist.userId)}
                    >
                      {specialist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Services
                </label>
                <div className="mt-1 max-h-32 overflow-y-auto border rounded-md p-2">
                  {servicesList.map((service) => (
                    <div
                      key={service.serviceId}
                      className="flex items-center space-x-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={editForm.serviceIds.includes(
                          String(service.serviceId)
                        )}
                        onChange={() =>
                          toggleService(String(service.serviceId))
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {service.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Selected Services
                </label>
                <div className="mt-1 border rounded-md p-2 min-h-[50px] bg-gray-50">
                  {editForm.serviceIds.length > 0 ? (
                    editForm.serviceIds.map((serviceId) => {
                      const service = servicesList.find(
                        (s) => String(s.serviceId) === serviceId
                      );
                      return (
                        <div
                          key={serviceId}
                          className="flex items-center justify-between bg-white p-1 mb-1 rounded-md shadow-sm"
                        >
                          <span className="text-sm text-gray-700">
                            {service?.name || "Unknown"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleService(serviceId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">
                      No services selected
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={
                    editForm.bookingDate
                      ? format(new Date(editForm.bookingDate), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    handleEditChange("bookingDate", e.target.value)
                  }
                  className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) =>
                    handleEditChange("startTime", e.target.value)
                  }
                  className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isErrorDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error
            </h3>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsErrorDialogOpen(false);
                  setError(null);
                }}
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