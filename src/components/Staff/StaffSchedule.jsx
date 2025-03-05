import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";

const staffMembers = [
  { id: 1, name: "Sarah Johnson", specialties: ["Massage", "Facial"] },
  { id: 2, name: "David Wilson", specialties: ["Massage", "Body Treatment"] },
  {
    id: 3,
    name: "Lisa Martinez",
    specialties: ["Facial", "Manicure", "Pedicure"],
  },
  { id: 4, name: "Michael Brown", specialties: ["Massage", "Body Treatment"] },
];

const services = [
  { id: 1, name: "Swedish Massage", duration: 60, category: "Massage" },
  { id: 2, name: "Deep Tissue Massage", duration: 90, category: "Massage" },
  { id: 3, name: "Facial Treatment", duration: 60, category: "Facial" },
  { id: 4, name: "Manicure", duration: 45, category: "Manicure" },
  { id: 5, name: "Pedicure", duration: 60, category: "Pedicure" },
  { id: 6, name: "Body Wrap", duration: 90, category: "Body Treatment" },
];

const timeSlots = [
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

export function StaffSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState({});
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(currentWeek), i)
  );

  const handleScheduleService = (timeSlot) => {
    if (selectedStaff && selectedService && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setSchedule((prev) => ({
        ...prev,
        [selectedStaff.id]: {
          ...prev[selectedStaff.id],
          [dateStr]: [
            ...(prev[selectedStaff.id]?.[dateStr] || []),
            { serviceId: selectedService.id, startTime: timeSlot },
          ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
        },
      }));
      setIsModalOpen(false);
      setSelectedStaff(null);
      setSelectedService(null);
      setSelectedDate(null);
    }
  };

  const removeScheduledService = (staffId, date, index) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSchedule((prev) => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [dateStr]: prev[staffId][dateStr].filter((_, i) => i !== index),
      },
    }));
  };

  const openModal = (staff, date) => {
    setSelectedStaff(staff);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Staff Schedule</h2>
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
              <th className="border p-2">Skin theoripist</th>
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
                      {schedule[staff.id]?.[format(day, "yyyy-MM-dd")]?.map(
                        (scheduledService, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 p-1 rounded"
                          >
                            <span className="text-sm">
                              {
                                services.find(
                                  (s) => s.id === scheduledService.serviceId
                                )?.name
                              }{" "}
                              - {scheduledService.startTime}
                            </span>
                            <button
                              onClick={() =>
                                removeScheduledService(staff.id, day, index)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                      <button
                        onClick={() => openModal(staff, day)}
                        className="w-full p-1 border rounded text-sm bg-pink-100 hover:bg-pink-200 text-pink-600"
                      >
                        + Add Service
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
            <h3 className="text-xl font-bold mb-4">Schedule Service</h3>
            <div className="mb-4">
              <p className="font-medium">Staff: {selectedStaff?.name}</p>
              <p className="font-medium">
                Date: {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Select Service:</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedService?.id || ""}
                onChange={(e) =>
                  setSelectedService(
                    services.find(
                      (s) => s.id === Number.parseInt(e.target.value)
                    )
                  )
                }
              >
                <option value="">Choose a service</option>
                {services
                  .filter((service) =>
                    selectedStaff?.specialties.includes(service.category)
                  )
                  .map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </option>
                  ))}
              </select>
            </div>
            {selectedService && (
              <div className="mb-4">
                <label className="block mb-2">Select Time:</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleScheduleService(slot)}
                      className="p-2 border rounded hover:bg-pink-100"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-4 p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
