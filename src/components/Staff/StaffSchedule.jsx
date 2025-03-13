import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import axios from "axios";

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

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesResponse, servicesResponse] = await Promise.all([
          axios.get(
            `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/schedules/busy`,
            {
              headers: {
                "ngrok-skip-browser-warning": "true",
              },
            }
          ),
          axios.get(
            `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/services`,
            {
              headers: {
                "ngrok-skip-browser-warning": "true",
              },
            }
          ),
        ]);
        console.log("Schedules data:", schedulesResponse.data);
        console.log("Services data:", servicesResponse.data);
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
        setBusySchedules([]);
        setServices([]);
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

  const handleCreateBooking = async () => {
    console.log("handleCreateBooking triggered");
    if (
      !selectedStaffId ||
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime ||
      !customerName ||
      !customerEmail
    ) {
      console.log("Missing fields:", {
        selectedStaffId,
        selectedServices,
        selectedDate,
        selectedTime,
        customerName,
        customerEmail,
      });
      alert("Please fill in all required fields.");
      return;
    }

    if (selectedServices.length > 3) {
      console.log("Too many services selected:", selectedServices.length);
      alert("A booking can only include up to 3 services.");
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
      console.log(
        "Booking request to be sent:",
        JSON.stringify(bookingRequest, null, 2)
      );
      const response = await axios.post(
        `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/bookings/guest`,
        bookingRequest,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      console.log("Response received:", response.data);
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
      console.error("Error creating booking:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
      alert("Failed to create booking. Please try again.");
    }
  };

  const openModal = (staffId, date) => {
    console.log("Opening modal for staff:", staffId, "date:", date);
    setSelectedStaffId(staffId);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const availableTimeSlots = () => {
    const baseSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    if (!selectedDate || !selectedStaffId) return baseSlots;

    const busySlots = getBusySlotsForStaffAndDay(selectedStaffId, selectedDate);
    const totalDuration = selectedServices.reduce(
      (sum, service) => sum + (service?.duration || 60),
      0
    );

    return baseSlots.filter((slot) => {
      const slotStart = parseISO(
        `${format(selectedDate, "yyyy-MM-dd")}T${slot}`
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
    });
  };

  const handleServiceChange = (serviceId) => {
    const service = services.find(
      (s) => s.serviceId === Number.parseInt(serviceId)
    );
    if (!service) {
      console.error(`Service with serviceId ${serviceId} not found`);
      return;
    }

    if (selectedServices.some((s) => s.serviceId === service.serviceId)) {
      setSelectedServices(
        selectedServices.filter((s) => s.serviceId !== service.serviceId)
      );
    } else if (selectedServices.length < 3) {
      setSelectedServices([...selectedServices, service]);
    } else {
      alert("You can only select up to 3 services per booking.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Staff Schedule Manager</h2>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentWeek((prev) => addDays(prev, -7))}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Previous Week
        </button>
        <span className="text-lg font-semibold">
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </span>
        <button
          onClick={() => setCurrentWeek((prev) => addDays(prev, 7))}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Next Week
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Skin Therapist</th>
              {weekDays.map((day) => (
                <th key={day.toString()} className="border p-2">
                  {format(day, "EEE dd/MM")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id}>
                <td className="border p-2 font-medium">{staff.name}</td>
                {weekDays.map((day) => (
                  <td key={day.toString()} className="border p-2">
                    <div className="space-y-2">
                      {getBusySlotsForStaffAndDay(staff.id, day).map(
                        (schedule, index) => (
                          <div key={index} className="bg-gray-100 p-1 rounded">
                            <span className="text-sm">
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
                      <button
                        onClick={() => openModal(staff.id, day)}
                        className="w-full p-1 border rounded text-sm bg-pink-100 hover:bg-pink-200 text-pink-600"
                      >
                        + Add Booking
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Guest Booking</h3>
            <div className="mb-4">
              <p className="font-medium">
                Staff:{" "}
                {staffMembers.find((s) => s.id === selectedStaffId)?.name}
              </p>
              <p className="font-medium">
                Date: {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Customer Email:</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter customer email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Customer Phone (optional):</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter customer phone"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Select Services (max 3):</label>
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
                    <label htmlFor={`service-${service.serviceId}`}>
                      {service.name} ({service.duration} min)
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {selectedServices.length > 0 && (
              <div className="mb-4">
                <label className="block mb-2">Select Start Time:</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Choose a time</option>
                  {availableTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={handleCreateBooking}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
