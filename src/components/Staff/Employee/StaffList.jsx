"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import PropTypes from "prop-types";
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
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
});

const API_URL =
  "https://af95-118-69-182-149.ngrok-free.app/api/users/specialists";
const STATUS_API_URL =
  "https://af95-118-69-182-149.ngrok-free.app/api/users/specialists";

export function StaffList() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
        createdAt: new Date(member.createdAt).toLocaleDateString(),
        updatedAt: new Date(member.updatedAt).toLocaleDateString(),
        status: (member.status || "ACTIVE").toLowerCase(),
      }));

      setStaff(mappedStaff);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      setError(
        error.message || "Failed to load specialists. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (specialistId, newStatus) => {
    if (newStatus !== "active" && newStatus !== "inactive") {
      throw new Error("Invalid status. Status must be 'active' or 'inactive'.");
    }

    const apiStatus = newStatus === "active" ? "ACTIVE" : "INACTIVE";
    const confirmed = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );

    if (!confirmed) return;

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
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Failed to update status. Please try again.");
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
      .join("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading specialists...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
        <div className="mt-2">
          {error.includes("Unauthorized") ||
          error.includes("authentication token") ? (
            <button
              onClick={handleLoginRedirect}
              className="ml-2 text-blue-600 hover:underline"
            >
              Login
            </button>
          ) : (
            <button
              onClick={fetchSpecialists}
              className="ml-2 text-blue-600 hover:underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!staff.length) {
    return (
      <div className="p-6 text-center text-red-600">No specialists found</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Skin Therapists</h2>
        <p className="mt-1 text-sm text-gray-600">View your skin therapists</p>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search skin therapists by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr
                  key={member.userId}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-800 text-sm font-medium">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.updatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative flex items-center justify-end gap-2">
                      <select
                        value={member.status}
                        onChange={(e) =>
                          toggleStatus(member.userId, e.target.value)
                        }
                        className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === member.userId
                              ? null
                              : member.userId
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {dropdownOpen === member.userId && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
