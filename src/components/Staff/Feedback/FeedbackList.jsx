"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Search } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedbackList({ filter }) {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const dropdownRefs = useRef({});

  const fetchClients = async () => {
    try {
      const response = await fetch(
        "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/users",
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.code !== 0) {
        throw new Error(data.msg || "API returned an error");
      }

      const mappedClients = data.result
        .filter((user) => user.role === "CUSTOMER")
        .map((user) => ({
          id: user.userId.toString(),
          name: user.name || `Khách hàng ID: ${user.userId}`,
          email: user.email || "Email không khả dụng",
          phone: user.phone || "N/A",
          address: user.address || "N/A",
        }));

      return mappedClients;
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(
        (prev) => prev || "Không thể tải dữ liệu khách hàng. Vui lòng thử lại."
      );
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem phản hồi");
        setIsLoading(false);
        return;
      }

      try {
        const fetchedClients = await fetchClients();

        const headers = {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        };

        const feedbackResponse = await axios.get(
          "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/feedbacks",
          { headers }
        );

        const mappedData = feedbackResponse.data
          .map((item) => {
            if (
              !item.feedbackId ||
              !item.customerId ||
              !item.specialistId ||
              !item.rating ||
              !item.createdAt
            ) {
              console.warn("Dữ liệu feedback thiếu trường quan trọng:", item);
              return null;
            }

            const client = fetchedClients.find(
              (c) => c.id === item.customerId.toString()
            );

            return {
              id: item.feedbackId,
              customer:
                item.customerName ||
                (client ? client.name : `Khách hàng ID: ${item.customerId}`),
              email: client ? client.email : "Email không khả dụng",
              avatar: "/placeholder.svg?height=40&width=40",
              service: item.specialistName || "Dịch vụ không xác định",
              message: item.comment || "",
              rating: item.rating || 0,
              date: item.createdAt ? item.createdAt.split("T")[0] : "N/A",
              bookingId: item.bookingId || "N/A",
              specialistId: item.specialistId,
              customerId: item.customerId,
              createdAt: item.createdAt,
            };
          })
          .filter((item) => item !== null);

        setFeedbackItems(mappedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Không thể tải dữ liệu phản hồi. Vui lòng kiểm tra API hoặc thử lại."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null) {
        const isClickInsideAnyDropdown = Object.keys(dropdownRefs.current).some(
          (id) =>
            dropdownRefs.current[id] &&
            dropdownRefs.current[id].contains(event.target)
        );

        if (!isClickInsideAnyDropdown) {
          setDropdownOpen(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

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

  const searchedItems = filteredItems.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-16 h-16 border-4 border-[#3D021E] border-t-transparent rounded-full"
            />
          </div>
          <h3 className="text-lg text-[#3D021E] font-medium">
            Loading feedback...
          </h3>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-gray-200 p-6 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <div className="w-20 h-20 mx-auto mb-6 text-[#3D021E]">
            <svg
              className="h-20 w-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D021E] mb-2">
            {error}
          </h2>
          <div className="mt-2">
            {error.includes("đăng nhập") ? (
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!searchedItems.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="bg-white border-gray-200 p-6 rounded-xl shadow-xl max-w-md w-full text-center border">
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D021E] mb-2">
            No feedback found
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer or email..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300 bg-gray-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
          <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Email
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
            {searchedItems.map((item, index) => (
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
                  {item.email}
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
                  <div
                    className="relative"
                    ref={(el) => (dropdownRefs.current[item.id] = el)}
                  >
                    <button
                      onClick={() =>
                        setDropdownOpen(
                          dropdownOpen === item.id ? null : item.id
                        )
                      }
                      className="text-gray-500 hover:text-[#3D021E] focus:outline-none transition-colors"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen === item.id && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: index === searchedItems.length - 1 ? 10 : -10,
                          }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: index === searchedItems.length - 1 ? 10 : -10,
                          }}
                          className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${
                            index === searchedItems.length - 1
                              ? "bottom-full mb-2"
                              : "top-full mt-2"
                          }`}
                        >
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => {
                                setSelectedFeedback(
                                  selectedFeedback?.id === item.id ? null : item
                                );
                                setDropdownOpen(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              role="menuitem"
                            >
                              View Details
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {searchedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D021E] to-[#6D0F3D] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(item.customer)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {item.customer}
                    </div>
                    <div className="text-xs text-gray-600">{item.email}</div>
                  </div>
                </div>
                <div ref={(el) => (dropdownRefs.current[item.id] = el)}>
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === item.id ? null : item.id)
                    }
                    className="text-gray-500 hover:text-[#3D021E]"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <strong>Specialist:</strong> {item.service}
              </div>
              <div className="mt-1 flex items-center gap-1">
                {renderStars(item.rating)}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <strong>Date:</strong> {item.date}
              </div>
              <AnimatePresence>
                {dropdownOpen === item.id && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: index === searchedItems.length - 1 ? 10 : -10,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: index === searchedItems.length - 1 ? 10 : -10,
                    }}
                    className={`rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                      index === searchedItems.length - 1 ? "mb-2" : "mt-2"
                    }`}
                  >
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          setSelectedFeedback(
                            selectedFeedback?.id === item.id ? null : item
                          );
                          setDropdownOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Responsive Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Feedback Details
              </h2>
              <div className="space-y-4 text-sm sm:text-base">
                <div>
                  <strong>Feedback ID:</strong> {selectedFeedback.id || "N/A"}
                </div>
                <div>
                  <strong>Booking ID:</strong>{" "}
                  {selectedFeedback.bookingId || "N/A"}
                </div>
                <div>
                  <strong>Customer:</strong>{" "}
                  {selectedFeedback.customer || "Unknown Customer"}
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  {selectedFeedback.email || "Email not available"}
                </div>
                <div>
                  <strong>Specialist:</strong>{" "}
                  {selectedFeedback.service || "Dịch vụ không xác định"}
                </div>
                <div>
                  <strong>Rating:</strong>
                  <div className="flex items-center gap-1">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {selectedFeedback.createdAt || "N/A"}
                </div>
                <div>
                  <strong>Comment:</strong>
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {selectedFeedback.message || "No comment available"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="mt-4 px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
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
