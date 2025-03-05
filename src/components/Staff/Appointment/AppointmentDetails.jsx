"use client";

import { useState } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";

// Mock data for a single appointment
const appointments = [
  {
    id: "1",
    clientName: "Emma Thompson",
    clientEmail: "emma.thompson@example.com",
    clientPhone: "(555) 123-4567",
    service: "Deep Tissue Massage",
    duration: 60,
    price: 85,
    time: "10:00 AM",
    date: new Date(2025, 2, 3),
    therapist: "Sarah Johnson",
    status: "confirmed",
    notes: "Client prefers medium pressure. Has lower back sensitivity.",
    room: "Harmony Suite 2",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    clientEmail: "michael.chen@example.com",
    clientPhone: "(555) 987-6543",
    service: "Hot Stone Therapy",
    duration: 90,
    price: 120,
    time: "1:00 PM",
    date: new Date(2025, 2, 3),
    therapist: "David Wilson",
    status: "confirmed",
    notes: "First time trying hot stone therapy. No known allergies.",
    room: "Tranquility Room 1",
  },
  {
    id: "3",
    clientName: "Olivia Davis",
    clientEmail: "olivia.davis@example.com",
    clientPhone: "(555) 456-7890",
    service: "Facial Treatment",
    duration: 45,
    price: 65,
    time: "3:30 PM",
    date: new Date(2025, 2, 3),
    therapist: "Lisa Martinez",
    status: "pending",
    notes: "Sensitive skin. Prefers organic products only.",
    room: "Serenity Suite 3",
  },
  {
    id: "4",
    clientName: "James Wilson",
    clientEmail: "james.wilson@example.com",
    clientPhone: "(555) 234-5678",
    service: "Swedish Massage",
    duration: 60,
    price: 75,
    time: "11:00 AM",
    date: new Date(2025, 2, 4),
    therapist: "Sarah Johnson",
    status: "confirmed",
    notes: "Recovering from minor shoulder injury. Extra care needed.",
    room: "Harmony Suite 1",
  },
  {
    id: "5",
    clientName: "Sophia Rodriguez",
    clientEmail: "sophia.rodriguez@example.com",
    clientPhone: "(555) 876-5432",
    service: "Aromatherapy",
    duration: 75,
    price: 95,
    time: "2:15 PM",
    date: new Date(2025, 2, 4),
    therapist: "David Wilson",
    status: "cancelled",
    notes: "Cancelled due to illness. Reschedule for next week.",
    room: "Tranquility Room 2",
  },
];

export function AppointmentDetails({ appointmentId }) {
  const appointment = appointments.find((a) => a.id === appointmentId);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  if (!appointment) {
    return (
      <div className="p-6 text-center text-gray-500">Appointment not found</div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            Cancelled
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
            <p className="text-sm text-gray-500">View and manage appointment</p>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xl font-medium">
            {appointment.clientName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {appointment.clientName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{appointment.clientPhone}</span>
            </div>
          </div>
        </div>

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
                {format(appointment.date, "MMMM d, yyyy")}
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
                {appointment.time} ({appointment.duration} min)
              </span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Service</span>
              <span className="font-medium text-gray-800">
                {appointment.service}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Price</span>
              <span className="font-medium text-gray-800">
                ${appointment.price}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Therapist</span>
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {appointment.therapist}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Room</span>
              <span className="text-gray-800">{appointment.room}</span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h4 className="text-sm text-gray-500 mb-1">Notes</h4>
            <p className="text-sm bg-gray-100 p-3 rounded-md text-gray-800">
              {appointment.notes}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t">
        {/* Cancel Dialog */}
        {isCancelDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cancel Appointment
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </p>
              <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">
                    {appointment.service} with {appointment.clientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(appointment.date, "MMMM d, yyyy")} at{" "}
                    {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsCancelDialogOpen(false)}
                >
                  Keep Appointment
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => setIsCancelDialogOpen(false)}
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Edit Appointment
              </h3>
              <p className="text-gray-600 mb-4">
                Make changes to the appointment details.
              </p>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      defaultValue={format(appointment.date, "yyyy-MM-dd")}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="time"
                      className="text-sm font-medium text-gray-700"
                    >
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      defaultValue="10:00"
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="service"
                    className="text-sm font-medium text-gray-700"
                  >
                    Service
                  </label>
                  <select
                    id="service"
                    defaultValue={appointment.service}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Deep Tissue Massage">
                      Deep Tissue Massage
                    </option>
                    <option value="Swedish Massage">Swedish Massage</option>
                    <option value="Hot Stone Therapy">Hot Stone Therapy</option>
                    <option value="Aromatherapy">Aromatherapy</option>
                    <option value="Facial Treatment">Facial Treatment</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="therapist"
                    className="text-sm font-medium text-gray-700"
                  >
                    Therapist
                  </label>
                  <select
                    id="therapist"
                    defaultValue={appointment.therapist}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="David Wilson">David Wilson</option>
                    <option value="Lisa Martinez">Lisa Martinez</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="notes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    defaultValue={appointment.notes}
                    rows={3}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium flex items-center"
          onClick={() => setIsCancelDialogOpen(true)}
          disabled={appointment.status === "cancelled"}
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Cancel
        </button>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-pink-500 text-white rounded-md text-sm font-medium flex items-center"
            onClick={() => setIsEditDialogOpen(true)}
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
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

AppointmentDetails.propTypes = {
  appointmentId: PropTypes.string.isRequired,
};
