"use client";

import { useState } from "react";
import BookingCard from "./BookingCard";
import BookingDialog from "./BookingDialog";

// Mock data for appointments
const appointments = [
  {
    id: "1",
    clientName: "Nguyen Van A",
    service: "Facial Treatment",
    date: "2025-03-09",
    time: "10:00 AM",
    duration: "60 min",
    status: "pending",
  },
  {
    id: "2",
    clientName: "Tran Thi B",
    service: "Skin Consultation",
    date: "2025-03-09",
    time: "1:30 PM",
    duration: "45 min",
    status: "pending",
  },
  {
    id: "3",
    clientName: "Le Van C",
    service: "Acne Treatment",
    date: "2025-03-10",
    time: "9:15 AM",
    duration: "90 min",
    status: "confirmed",
  },
  {
    id: "4",
    clientName: "Pham Thi D",
    service: "Anti-aging Treatment",
    date: "2025-03-10",
    time: "2:00 PM",
    duration: "75 min",
    status: "pending",
  },
  {
    id: "5",
    clientName: "Hoang Van E",
    service: "Skin Brightening",
    date: "2025-03-11",
    time: "11:30 AM",
    duration: "60 min",
    status: "confirmed",
  },
];

function Booking() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [localAppointments, setLocalAppointments] = useState(appointments);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Group appointments by date
  const appointmentsByDate = localAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {});

  const confirmAppointment = (id) => {
    setLocalAppointments(
      localAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "confirmed" }
          : appointment
      )
    );
    setIsDialogOpen(false);
  };

  const filteredAppointmentsByDate = Object.keys(appointmentsByDate).reduce(
    (acc, date) => {
      if (activeTab === "upcoming") {
        acc[date] = appointmentsByDate[date].filter(
          (a) => a.status === "pending"
        );
      } else if (activeTab === "confirmed") {
        acc[date] = appointmentsByDate[date].filter(
          (a) => a.status === "confirmed"
        );
      } else {
        acc[date] = appointmentsByDate[date];
      }
      return acc;
    },
    {}
  );

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
      </div>

      {/* Tabs */}
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

      {/* Appointments List */}
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
          onConfirm={confirmAppointment}
          formatDate={formatDate}
          isOpen={isDialogOpen}
        />
      )}
    </div>
  );
}

export default Booking;
