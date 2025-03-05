"use client";

import { useState } from "react";
import PropTypes from "prop-types";

export function NewAppointmentButton({ onAppointmentCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    service: "",
    date: "",
    time: "",
    staff: "",
    duration: "60",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing time
    setTimeout(() => {
      console.log("New appointment created:", formData);

      // Call the callback function
      onAppointmentCreated();

      // Close modal and reset form
      setIsOpen(false);
      setFormData({
        clientName: "",
        service: "",
        date: "",
        time: "",
        staff: "",
        duration: "60",
        notes: "",
      });
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* New Appointment Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        New Appointment
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                New Appointment
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details to create a new appointment
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client Selection */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Client
                </label>
                <select
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Select a client</option>
                  <option value="Olivia Davis">Olivia Davis</option>
                  <option value="Emma Thompson">Emma Thompson</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="David Wilson">David Wilson</option>
                </select>
              </div>

              {/* Service Selection */}
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Facial Treatment">Facial Treatment</option>
                  <option value="Deep Tissue Massage">
                    Deep Tissue Massage
                  </option>
                  <option value="Hot Stone Therapy">Hot Stone Therapy</option>
                  <option value="Manicure & Pedicure">
                    Manicure & Pedicure
                  </option>
                  <option value="Hair Styling">Hair Styling</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Staff and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="staff"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Staff
                  </label>
                  <select
                    id="staff"
                    name="staff"
                    value={formData.staff}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Select staff</option>
                    <option value="Lisa Martinez">Lisa Martinez</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="David Wilson">David Wilson</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                </div>
              </div>
              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Any special requests or client preferences..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Appointment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

NewAppointmentButton.propTypes = {
  onAppointmentCreated: PropTypes.func,
};

NewAppointmentButton.defaultProps = {
  onAppointmentCreated: () => {},
};
