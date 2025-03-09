import PropTypes from "prop-types";

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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

function BookingCard({ appointment, onViewDetails }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{appointment.service}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{appointment.clientName}</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center">
            <ClockIcon />
            <span className="ml-2">
              {appointment.time} ({appointment.duration})
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => onViewDetails(appointment)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

BookingCard.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["pending", "confirmed"]).isRequired,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default BookingCard;
