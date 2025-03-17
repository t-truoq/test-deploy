import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

export default function FeedbackList({ filter }) {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view feedback");
        navigate("/signin");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        };

        const feedbackResponse = await axios.get(
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks/specialist/feedbacks",
          { headers }
        );

        if (
          typeof feedbackResponse.data === "string" &&
          feedbackResponse.data.startsWith("<!DOCTYPE")
        ) {
          throw new Error(
            "API returned HTML instead of JSON. Please check the server or ngrok."
          );
        }

        const mappedData = feedbackResponse.data.map((item) => ({
          id: item.feedbackId,
          customer: item.customerName || `Customer ID: ${item.customerId}`,
          avatar: "/placeholder.svg?height=40&width=40",
          service: item.specialistName || "Specialist not specified",
          message: item.comment || "No comment",
          rating: item.rating || 0,
          date: item.createdAt ? item.createdAt.split("T")[0] : "N/A",
          createdAt: item.createdAt,
        }));

        setFeedbackItems(mappedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setError("Unable to load feedback data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
      ));
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredItems =
    filter === 0
      ? feedbackItems
      : feedbackItems.filter((item) => item.rating === filter);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center border"
      >
        <div className="w-20 h-20 mx-auto mb-6 text-[#3D021E]">
          <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#3D021E] mb-2">{error}</h2>
        <button
          onClick={() => navigate("/signin")}
          className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
        >
          Login
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#3D021E]">
 
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-500">
          No feedback found matching the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Specialist
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D021E] to-[#6D0F3D] flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(item.customer)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.customer}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="text-gray-500 hover:text-[#3D021E] focus:outline-none transition-colors"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Feedback Details
              </h2>
              <div className="space-y-4">
                <div>
                  <strong>Feedback ID:</strong> {selectedFeedback.id}
                </div>
                <div>
                  <strong>Customer:</strong> {selectedFeedback.customer}
                </div>
                <div>
                  <strong>Specialist:</strong> {selectedFeedback.service}
                </div>
                <div>
                  <strong>Rating:</strong>
                  <div className="flex items-center gap-1">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                </div>
                <div>
                  <strong>Created At:</strong> {selectedFeedback.createdAt}
                </div>
                <div>
                  <strong>Comment:</strong>
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {selectedFeedback.message}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

FeedbackList.propTypes = {
  filter: PropTypes.number.isRequired,
};