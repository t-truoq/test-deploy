"use client";
import PropTypes from "prop-types";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

function BookingDialog({
  appointment,
  onClose,
  onConfirm,
  formatDate,
  isOpen,
}) {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Appointment Details</h3>
          <p className="text-sm text-gray-500">
            Review the appointment details below
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex items-start space-x-3">
            <UserIcon />
            <div>
              <p className="font-medium">{appointment.clientName}</p>
              <p className="text-sm text-gray-500">{appointment.service}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CalendarIcon />
            <div>
              <p className="font-medium">{formatDate(appointment.date)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <ClockIcon />
            <div>
              <p className="font-medium">{appointment.time}</p>
              <p className="text-sm text-gray-500">
                Duration: {appointment.duration}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPinIcon />
            <div>
              <p className="font-medium">{appointment.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                appointment.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {appointment.status === "confirmed"
                ? "Confirmed"
                : "Pending Confirmation"}
            </span>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          {appointment.status === "pending" ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(appointment.id)}
                className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700"
              >
                Confirm Appointment
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

BookingDialog.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["pending", "confirmed"]).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default BookingDialog;
