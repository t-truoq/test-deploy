"use client";
import { X, Clock, DollarSign } from "lucide-react";

const BookingSummaryPanel = ({ selectedServices, onRemoveService, onBookServices, onClearAllServices }) => {
  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);

  // Calculate total duration in minutes (if duration is available)
  const totalDurationMinutes = selectedServices.reduce((sum, service) => sum + (service.duration || 0), 0);

  // Convert minutes to hours and minutes format
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>

      {selectedServices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No services selected yet</p>
          <p className="text-sm mt-2">Select services from the list to see your booking details</p>
        </div>
      ) : (
        <>
          {/* Selected Services List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-700">Selected Services</h3>
              <button
                onClick={onClearAllServices}
                className="text-sm text-pink-700 hover:text-pink-800 transition-colors font-medium"
              >
                Clear All Services
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              <ul className="space-y-3">
                {selectedServices.map((service) => (
                  <li
                    key={service.serviceId}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        {service.duration && (
                          <>
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            <span>{formatDuration(service.duration)}</span>
                            <span className="mx-2">•</span>
                          </>
                        )}
                        <DollarSign className="w-3.5 h-3.5 mr-1" />
                        <span>${service.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveService(service.serviceId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${service.name}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            {totalDurationMinutes > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Duration:</span>
                <span className="font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  {formatDuration(totalDurationMinutes)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-bold text-lg text-pink-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={onBookServices}
            className="w-full py-3 rounded-lg font-medium text-white bg-pink-700 hover:bg-pink-800 transition-colors"
          >
            Book Selected Services ({selectedServices.length})
          </button>
        </>
      )}

      {/* Add custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default BookingSummaryPanel;