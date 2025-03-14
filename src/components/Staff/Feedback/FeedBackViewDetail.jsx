import PropTypes from "prop-types";
import React from "react";
import { useLocation } from "react-router-dom";

const FeedBackViewDetail = () => {
  const location = useLocation();
  const { feedback = {} } = location.state || {};

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Feedback Details
      </h2>
      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Feedback ID
              </h3>
              <p className="mt-1 text-gray-600">{feedback.id || "N/A"}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Booking ID
              </h3>
              <p className="mt-1 text-gray-600">
                {feedback.bookingId || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Customer Name
              </h3>
              <p className="mt-1 text-gray-600">
                {feedback.customer || "Unknown Customer"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Customer Email
              </h3>
              <p className="mt-1 text-gray-600">
                {feedback.email || "Email not available"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Specialist Name
              </h3>
              <p className="mt-1 text-gray-600">
                {feedback.service || "Dịch vụ ID: N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        i < feedback.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Created At
              </h3>
              <p className="mt-1 text-gray-600">
                {feedback.createdAt || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Feedback Status
              </h3>
              <p className="mt-1 text-gray-600">
                {feedback.feedbackStatus || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Comment</h3>
          <p className="mt-1 text-gray-600">
            {feedback.message || "No comment available"}
          </p>
        </div>
      </div>

      <button
        onClick={handleBack}
        className="mt-6 px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
      >
        Back to List
      </button>
    </div>
  );
};

FeedBackViewDetail.propTypes = {
  feedback: PropTypes.shape({
    id: PropTypes.number,
    bookingId: PropTypes.number,
    customer: PropTypes.string,
    email: PropTypes.string,
    service: PropTypes.string,
    rating: PropTypes.number,
    message: PropTypes.string,
    createdAt: PropTypes.string,
    feedbackStatus: PropTypes.string,
  }),
};

export default FeedBackViewDetail;
