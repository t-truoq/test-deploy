"use client";

import { motion } from "framer-motion";
import { Search, XIcon } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define authentication token retrieval
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No auth token found in localStorage");
    return null;
  }
  return token;
};

export const StaffMemberPropType = PropTypes.shape({
  userId: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
});

const API_URL =
  "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users/specialists";
const STATUS_API_URL =
  "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users/specialists";

export function StaffList() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // Toast state
  const [confirmStatusChange, setConfirmStatusChange] = useState(null); // New state for confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const mappedStaff = data.map((member) => ({
        userId: member.userId,
        email: member.email,
        name: member.name.trim(),
        phone: member.phone,
        address: member.address,
        role: member.role,
        status: (member.status || "ACTIVE").toLowerCase(),
      }));

      setStaff(mappedStaff);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      setError(
        error.message || "Failed to load specialists. Please try again."
      );
      showToast({
        title: "Error",
        message:
          error.message || "Failed to load specialists. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (specialistId, newStatus) => {
    if (newStatus !== "active" && newStatus !== "inactive") {
      throw new Error("Invalid status. Status must be 'active' or 'inactive'.");
    }

    const apiStatus = newStatus === "active" ? "ACTIVE" : "INACTIVE";
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${STATUS_API_URL}/${specialistId}/status`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: apiStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member.userId === specialistId
            ? { ...member, status: newStatus }
            : member
        )
      );

      // Show toast on successful status update
      const memberName = staff.find(
        (member) => member.userId === specialistId
      ).name;
      showToast({
        title: "Status Updated",
        message: `${memberName}'s status changed to ${newStatus}.`,
        type: newStatus === "active" ? "success" : "info",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      showToast({
        title: "Error",
        message: error.message || "Failed to update status. Please try again.",
        type: "error",
      });
      if (error.message.includes("Unauthorized")) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery)
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Function to show toast notification
  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white border-gray-100 p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-20 h-20 rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-xl text-[#3D021E] font-medium">
            Loading specialists...
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
          <h2 className="text-2xl font-bold text-[#3D021E] mb-2">{error}</h2>
          <div className="mt-2">
            {error.includes("Unauthorized") ||
            error.includes("authentication token") ? (
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
              >
                Login
              </button>
            ) : (
              <button
                onClick={fetchSpecialists}
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

  if (!staff.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border-gray-200 p-6 rounded-xl shadow-xl max-w-md w-full text-center border">
          <h2 className="text-2xl font-bold text-[#3D021E] mb-2">
            No specialists found
          </h2>
          <button
            onClick={fetchSpecialists}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Skin Therapists
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              View your skin therapists
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <motion.tr
                    key={member.userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D021E] to-[#6D0F3D] flex items-center justify-center text-white text-sm font-medium">
                          {getInitials(member.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setConfirmStatusChange({
                            userId: member.userId,
                            newStatus:
                              member.status === "active"
                                ? "inactive"
                                : "active",
                            name: member.name,
                          })
                        }
                        className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(
                          member.status
                        )} focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-colors`}
                      >
                        {member.status.charAt(0).toUpperCase() +
                          member.status.slice(1)}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg max-w-md z-50 border-l-4 ${
              toast.type === "success"
                ? "bg-green-100 border-green-500"
                : toast.type === "error"
                ? "bg-red-100 border-red-500"
                : "bg-blue-100 border-blue-500"
            }`}
          >
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {toast.title}
                </h3>
                <div className="mt-1 text-sm text-gray-700">
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-full p-1.5"
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Confirmation Modal */}
        {confirmStatusChange && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-[#3D021E] mb-4">
                Confirm Status Change
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change the status of{" "}
                {confirmStatusChange.name} to {confirmStatusChange.newStatus}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    toggleStatus(
                      confirmStatusChange.userId,
                      confirmStatusChange.newStatus
                    );
                    setConfirmStatusChange(null);
                  }}
                  className="px-4 py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmStatusChange(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
