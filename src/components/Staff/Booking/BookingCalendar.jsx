"use client";

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

// Mock data for appointments
const appointments = [
  {
    id: "1",
    clientName: "Emma Thompson",
    service: "Deep Tissue Massage",
    duration: 60,
    time: "10:00 AM",
    date: new Date(2025, 2, 3),
    therapist: "Sarah Johnson",
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    service: "Hot Stone Therapy",
    duration: 90,
    time: "1:00 PM",
    date: new Date(2025, 2, 3),
    therapist: "David Wilson",
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Olivia Davis",
    service: "Facial Treatment",
    duration: 45,
    time: "3:30 PM",
    date: new Date(2025, 2, 3),
    therapist: "Lisa Martinez",
    status: "pending",
  },
  {
    id: "4",
    clientName: "James Wilson",
    service: "Swedish Massage",
    duration: 60,
    time: "11:00 AM",
    date: new Date(2025, 2, 4),
    therapist: "Sarah Johnson",
    status: "confirmed",
  },
  {
    id: "5",
    clientName: "Sophia Rodriguez",
    service: "Aromatherapy",
    duration: 75,
    time: "2:15 PM",
    date: new Date(2025, 2, 4),
    therapist: "David Wilson",
    status: "cancelled",
  },
];

export function BookingCalendar({
  onAppointmentSelect,
  selectedAppointmentId,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 3));
  const [view, setView] = useState("day");
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });
    setCalendarDays(days);
  }, [selectedDate]);

  const filteredAppointments = appointments.filter((appointment) => {
    if (view === "day") {
      return appointment.date.toDateString() === selectedDate.toDateString();
    } else {
      const endDate = addDays(selectedDate, 6);
      return appointment.date >= selectedDate && appointment.date <= endDate;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Calendar */}
        <div className="bg-white rounded-lg border shadow p-4 h-full">
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

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              const hasAppointments = appointments.some((apt) =>
                isSameDay(apt.date, day)
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

        {/* Appointments List */}
        <div className="bg-white rounded-lg border shadow p-4 h-full overflow-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Appointments
            </h2>
            <p className="text-sm text-gray-500">
              {filteredAppointments.length} appointments for{" "}
              {view === "day" ? format(selectedDate, "MMMM d") : "the week"}
            </p>
          </div>

          <div className="space-y-3">
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
                      {appointment.clientName}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {format(appointment.date, "MMM d")} • {appointment.time} •{" "}
                    {appointment.duration} min
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-700">{appointment.service}</div>
                    <div className="text-gray-500">
                      with {appointment.therapist}
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
  onAppointmentSelect: PropTypes.func.isRequired,
  selectedAppointmentId: PropTypes.string,
};
