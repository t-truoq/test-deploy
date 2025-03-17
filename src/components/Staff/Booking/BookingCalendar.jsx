import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import PropTypes from "prop-types";

export function BookingCalendar({
  appointments = [],
  onAppointmentSelect,
  selectedAppointmentId,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [calendarDays, setCalendarDays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        throw new Error("Invalid selected date");
      }
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      const days = eachDayOfInterval({ start, end });
      setCalendarDays(days);
    } catch (err) {
      console.error("Error generating calendar days:", err);
      setError("Failed to generate calendar. Please try again.");
    }
  }, [selectedDate]);

  const filteredAppointments = (appointments || []).filter((appointment) => {
    if (!(appointment.date instanceof Date) || isNaN(appointment.date)) {
      return false;
    }
    if (view === "day") {
      return isSameDay(appointment.date, selectedDate);
    } else {
      const endDate = addDays(selectedDate, 6);
      return appointment.date >= selectedDate && appointment.date <= endDate;
    }
  });

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-purple-500";  // Changed from green to purple
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-green-500";   // Changed from purple to green
      case "IN_PROGRESS":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              view === "day"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              view === "week"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Week
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate((prev) => addDays(prev, -1))}
            className="p-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="font-medium text-gray-800">
            {view === "day"
              ? format(selectedDate, "MMMM d, yyyy")
              : `${format(selectedDate, "MMM d")} - ${format(
                  addDays(selectedDate, 6),
                  "MMM d, yyyy"
                )}`}
          </span>
          <button
            onClick={() => setSelectedDate((prev) => addDays(prev, 1))}
            className="p-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Container cho calendar với chiều cao cố định */}
        <div className="bg-white rounded-lg border shadow p-4 h-[400px] flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
            <p className="text-sm text-gray-500">
              Select a date to view appointments
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Container cho các ngày với chiều cao cố định và overflow */}
          <div className="grid grid-cols-7 gap-1 flex-1 overflow-auto">
            {calendarDays.map((day, i) => {
              if (!(day instanceof Date) || isNaN(day)) {
                return (
                  <div
                    key={i}
                    className="h-10 w-full rounded-md flex items-center justify-center text-sm text-gray-300"
                  >
                    Invalid
                  </div>
                );
              }

              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              const hasAppointments = (appointments || []).some((apt) =>
                apt.date instanceof Date && !isNaN(apt.date)
                  ? isSameDay(apt.date, day)
                  : false
              );

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    h-10 w-full rounded-md flex items-center justify-center text-sm
                    ${!isCurrentMonth && "text-gray-300"}
                    ${
                      isToday(day) &&
                      !isSelected &&
                      "border border-pink-500 text-pink-500"
                    }
                    ${
                      isSelected
                        ? "bg-pink-500 text-white"
                        : "hover:bg-gray-100"
                    }
                    ${hasAppointments && !isSelected && "font-bold"}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Container cho appointments với chiều cao cố định */}
        <div className="bg-white rounded-lg border shadow p-4 h-[400px] flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Appointments
            </h2>
            <p className="text-sm text-gray-500">
              {filteredAppointments.length} appointments for{" "}
              {view === "day" ? format(selectedDate, "MMMM d") : "the week"}
            </p>
          </div>

          {/* Container cho danh sách appointments với scroll */}
          <div className="flex-1 overflow-auto space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAppointmentId === appointment.id
                      ? "border-pink-500 bg-pink-50"
                      : "hover:border-pink-300"
                  }`}
                  onClick={() => onAppointmentSelect(appointment.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">
                      {appointment.clientName || "Unknown"}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {appointment.date instanceof Date &&
                    !isNaN(appointment.date)
                      ? format(appointment.date, "MMM d")
                      : "Invalid Date"}{" "}
                    • {appointment.time} • {appointment.duration} min
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-700">
                      {appointment.service || "Unknown"}
                    </div>
                    <div className="text-gray-500">
                      with {appointment.therapist || "Unknown"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for this {view}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

BookingCalendar.propTypes = {
  appointments: PropTypes.array.isRequired,
  onAppointmentSelect: PropTypes.func,
  selectedAppointmentId: PropTypes.string,
};

BookingCalendar.defaultProps = {
  appointments: [],
  onAppointmentSelect: () => {},
  selectedAppointmentId: null,
};
