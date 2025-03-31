"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, X } from "lucide-react";

export function StaffSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [busySchedules, setBusySchedules] = useState([]);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i)
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [schedulesResponse, servicesResponse] = await Promise.all([
          axios.get(
            `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/schedules/busy`,
            {
              headers: { "ngrok-skip-browser-warning": "true" },
            }
          ),
          axios.get(
            `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/services`,
            {
              headers: { "ngrok-skip-browser-warning": "true" },
            }
          ),
        ]);
        const schedulesData = Array.isArray(schedulesResponse.data)
          ? schedulesResponse.data
          : [];
        const servicesData = Array.isArray(servicesResponse.data)
          ? servicesResponse.data
          : [];
        setBusySchedules(schedulesData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load schedules and services.");
        setBusySchedules([]);
        setServices([]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500); // Delay giống BookingStaff.jsx
      }
    };
    fetchData();
  }, [currentWeek]);

  const staffMembers =
    busySchedules && Array.isArray(busySchedules)
      ? [
          ...new Map(
            busySchedules.map((schedule) => [
              schedule.specialistId,
              { id: schedule.specialistId, name: schedule.specialistName },
            ])
          ).values(),
        ]
      : [];

  const getBusySlotsForStaffAndDay = (staffId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return busySchedules.filter(
      (schedule) =>
        schedule.specialistId === staffId && schedule.date === dateStr
    );
  };

  const isTimeSlotAvailable = (startTime) => {
    if (!selectedDate || !selectedStaffId || !startTime) return true;

    const busySlots = getBusySlotsForStaffAndDay(selectedStaffId, selectedDate);
    const totalDuration = selectedServices.reduce(
      (sum, service) => sum + (service?.duration || 60),
      0
    );

    const slotStart = parseISO(
      `${format(selectedDate, "yyyy-MM-dd")}T${startTime}`
    );
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + totalDuration);

    return !busySlots.some((busy) => {
      const [busyStart, busyEnd] = busy.timeSlot.split("-");
      const busyStartTime = parseISO(`${busy.date}T${busyStart}`);
      const busyEndTime = parseISO(`${busy.date}T${busyEnd}`);
      return (
        (slotStart >= busyStartTime && slotStart < busyEndTime) ||
        (slotEnd > busyStartTime && slotEnd <= busyEndTime) ||
        (slotStart <= busyStartTime && slotEnd >= busyEndTime)
      );
    });
  };

  const handleCreateBooking = async () => {
    if (
      !selectedStaffId ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime ||
      !customerName ||
      !customerEmail
    ) {
      alert(
        "Please fill in all required fields, including at least one service."
      );
      return;
    }

    if (!isTimeSlotAvailable(selectedTime)) {
      alert(
        "The selected time slot is not available. Please choose another time."
      );
      return;
    }

    const bookingRequest = {
      specialistId: selectedStaffId,
      bookingDate: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTime,
      serviceIds: selectedServices.map((s) => s.serviceId),
      customerName,
      customerEmail,
      customerPhone: customerPhone || "N/A",
    };

    try {
      const response = await axios.post(
        `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings/guest`,
        bookingRequest,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      setBusySchedules((prev) => [
        ...prev,
        {
          specialistId: selectedStaffId,
          specialistName: staffMembers.find((s) => s.id === selectedStaffId)
            ?.name,
          date: bookingRequest.bookingDate,
          timeSlot: response.data.timeSlot,
          serviceIds: bookingRequest.serviceIds,
          availability: false,
        },
      ]);
      setIsModalOpen(false);
      setSelectedStaffId(null);
      setSelectedServices([]);
      setSelectedDate(null);
      setSelectedTime("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const openModal = (staffId, date) => {
    setSelectedStaffId(staffId);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleServiceChange = (serviceId) => {
    const service = services.find(
      (s) => s.serviceId === Number.parseInt(serviceId)
    );
    if (!service) return;

    if (selectedServices.some((s) => s.serviceId === service.serviceId)) {
      setSelectedServices(
        selectedServices.filter((s) => s.serviceId !== service.serviceId)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  if (isLoading) {
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
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
            Loading schedules...
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
          className="bg-white border-gray-200 p-6 sm:p-10 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-[#3D021E]"
          >
            <svg
              className="h-full w-full"
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
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D021E] mb-2">
            Error
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] hover:from-[#4A0404] hover:to-[#7D1F4D] text-white rounded-lg transition-colors duration-300 shadow-md flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
            onClick={() => window.location.reload()}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] mb-4 sm:mb-6">
          Schedule Manager
        </h2>

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentWeek((prev) => addDays(prev, -7))}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors text-sm sm:text-base"
          >
            Previous Week
          </motion.button>
          <span className="text-base sm:text-lg font-semibold text-gray-700">
            {format(weekDays[0], "MMM d")} -{" "}
            {format(weekDays[6], "MMM d, yyyy")}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentWeek((prev) => addDays(prev, 7))}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors text-sm sm:text-base"
          >
            Next Week
          </motion.button>
        </div>

        {/* Table for medium and larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                <th className="border border-gray-200 p-3 sm:p-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Skin Therapist
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.toString()}
                    className="border border-gray-200 p-3 sm:p-4 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    {format(day, "EEE dd/MM")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 sm:p-4 font-medium text-sm text-gray-900">
                    {staff.name}
                  </td>
                  {weekDays.map((day) => (
                    <td
                      key={day.toString()}
                      className="border border-gray-200 p-3 sm:p-4"
                    >
                      <div className="space-y-2">
                        {getBusySlotsForStaffAndDay(staff.id, day).map(
                          (schedule, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 p-2 rounded text-xs sm:text-sm text-gray-700"
                            >
                              <span>
                                {schedule.serviceIds?.length > 0
                                  ? schedule.serviceIds
                                      .map(
                                        (id) =>
                                          services.find(
                                            (s) => s.serviceId === id
                                          )?.name
                                      )
                                      .join(", ")
                                  : "Booked"}{" "}
                                - {schedule.timeSlot}
                              </span>
                            </div>
                          )
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(staff.id, day)}
                          className="w-full p-2 border rounded text-xs sm:text-sm bg-[#F8F2F5] hover:bg-[#E8D2D5] text-[#3D021E] transition-colors"
                        >
                          + Add Booking
                        </motion.button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card layout for small screens */}
        <div className="block md:hidden space-y-4">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {staff.name}
              </h3>
              <div className="space-y-3">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {format(day, "EEE dd/MM")}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {getBusySlotsForStaffAndDay(staff.id, day).map(
                        (schedule, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 p-2 rounded text-xs text-gray-700"
                          >
                            <span>
                              {schedule.serviceIds?.length > 0
                                ? schedule.serviceIds
                                    .map(
                                      (id) =>
                                        services.find((s) => s.serviceId === id)
                                          ?.name
                                    )
                                    .join(", ")
                                : "Booked"}{" "}
                              - {schedule.timeSlot}
                            </span>
                          </div>
                        )
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(staff.id, day)}
                        className="w-full p-2 border rounded text-xs bg-[#F8F2F5] hover:bg-[#E8D2D5] text-[#3D021E] transition-colors"
                      >
                        + Add Booking
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#3D021E]">
                  Add Guest Booking
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4 text-sm text-gray-700">
                <p className="font-medium">
                  Staff:{" "}
                  {staffMembers.find((s) => s.id === selectedStaffId)?.name}
                </p>
                <p className="font-medium">
                  Date: {format(selectedDate, "MMMM d, yyyy")}
                </p>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Customer Name:
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border rounded text-sm focus:ring-[#3D021E] focus:border-[#3D021E] outline-none focus:ring-2"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Customer Email:
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2 border rounded text-sm focus:ring-[#3D021E] focus:border-[#3D021E] outline-none focus:ring-2"
                  placeholder="Enter customer email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Customer Phone (optional):
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 border rounded text-sm focus:ring-[#3D021E] focus:border-[#3D021E] outline-none focus:ring-2"
                  placeholder="Enter customer phone"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Services:
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {services.map((service) => (
                    <div key={service.serviceId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`service-${service.serviceId}`}
                        checked={selectedServices.some(
                          (s) => s.serviceId === service.serviceId
                        )}
                        onChange={() => handleServiceChange(service.serviceId)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`service-${service.serviceId}`}
                        className="text-sm text-gray-700"
                      >
                        {service.name} ({service.duration} min)
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Enter Start Time:
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded text-sm focus:ring-[#3D021E] focus:border-[#3D021E] outline-none focus:ring-2"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min="09:00"
                    max="17:00"
                    step="1800" // Bước nhảy 30 phút
                    required
                  />
                </div>
              )}
              <div className="flex justify-between gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateBooking}
                  className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors text-sm"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm text-gray-700"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
