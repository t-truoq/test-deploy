"use client";

import axios from "axios";
import { motion } from "framer-motion";
import {
  XIcon,
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export function ContactDashboard() {
  const [contacts, setContacts] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [confirmStatusChange, setConfirmStatusChange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      showToast({
        title: "Unauthorized",
        message: "Please log in to view contacts.",
        type: "error",
      });
      return;
    }
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/contact",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showToast({
        title: "Error",
        message:
          error.response?.status === 403
            ? "You do not have permission to view contacts."
            : "Failed to load contacts. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    if (!token) {
      showToast({
        title: "Unauthorized",
        message: "Please log in to update status.",
        type: "error",
      });
      return;
    }

    const currentContact = contacts.find((c) => c.id === id);
    if (currentContact.status === "CONTACTED") {
      showToast({
        title: "Status Change Denied",
        message: "Cannot change status back to Pending once Contacted.",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.put(
        `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/contact/${id}/status?status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setContacts(
        contacts.map((contact) =>
          contact.id === id
            ? { ...contact, status, updatedAt: response.data.updatedAt }
            : contact
        )
      );
      showToast({
        title: "Status Updated",
        message: `${currentContact.fullName}'s status changed to ${status}.`,
        type: status === "CONTACTED" ? "success" : "info",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      showToast({
        title: "Error",
        message: "Failed to update status. Please try again.",
        type: "error",
      });
    }
  };

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "CONTACTED":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const filteredContacts = contacts
    .filter(
      (contact) => statusFilter === "all" || contact.status === statusFilter
    )
    .sort((a, b) => {
      if (dateFilter === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (dateFilter === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return 0;
    });

  const resetFilters = () => {
    setDateFilter("all");
    setStatusFilter("all");
  };

  const ContactDetail = ({ contact, onClose }) => {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">ID:</span>{" "}
              {contact.id}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">Status:</span>{" "}
              <span
                className={`inline-flex px-2 py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(
                  contact.status
                )} border`}
              >
                {contact.status.charAt(0) +
                  contact.status.slice(1).toLowerCase()}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">Full Name:</span>{" "}
              {contact.fullName}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">Email:</span>{" "}
              {contact.email}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">Phone Number:</span>{" "}
              {contact.phoneNumber}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">Created At:</span>{" "}
              {formatDate(contact.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900">
              <span className="font-medium text-gray-500">Updated At:</span>{" "}
              {formatDate(contact.updatedAt)}
            </p>
          </div>
          <div>
            <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap">
              <span className="font-medium text-gray-500">Message:</span>{" "}
              {contact.message}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  ContactDetail.propTypes = {
    contact: PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullName: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const ContactList = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white border-gray-100 p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
              />
            </div>
            <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
              Loading contacts...
            </h3>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Please wait while we fetch your data
            </p>
          </motion.div>
        </div>
      );
    }

    if (contacts.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No contacts found
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-gray-200 border-b">
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="text-sm text-[#3D021E] font-medium flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>

                {/* Date Filter */}
                <div className="relative w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg w-full sm:min-w-[140px] ${
                      dateFilter !== "all"
                        ? "text-[#3D021E] border-[#3D021E]"
                        : "text-gray-700 border-gray-300"
                    } bg-white border`}
                    onClick={() => {
                      setShowDateDropdown(!showDateDropdown);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {dateFilter === "all"
                        ? "All Dates"
                        : dateFilter === "newest"
                        ? "Newest First"
                        : "Oldest First"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  {showDateDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-1 w-full sm:w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dateFilter === "all"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setDateFilter("all");
                          setShowDateDropdown(false);
                        }}
                      >
                        All Dates
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dateFilter === "newest"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setDateFilter("newest");
                          setShowDateDropdown(false);
                        }}
                      >
                        Newest First
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dateFilter === "oldest"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setDateFilter("oldest");
                          setShowDateDropdown(false);
                        }}
                      >
                        Oldest First
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg w-full sm:min-w-[140px] ${
                      statusFilter !== "all"
                        ? "text-[#3D021E] border-[#3D021E]"
                        : "text-gray-700 border-gray-300"
                    } bg-white border`}
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowDateDropdown(false);
                    }}
                  >
                    {statusFilter === "CONTACTED" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : statusFilter === "PENDING" ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Filter className="w-4 h-4" />
                    )}
                    <span>
                      {statusFilter === "all"
                        ? "All Status"
                        : statusFilter === "CONTACTED"
                        ? "Contacted"
                        : "Pending"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  {showStatusDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-1 w-full sm:w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "all"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setStatusFilter("all");
                          setShowStatusDropdown(false);
                        }}
                      >
                        All Status
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "CONTACTED"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setStatusFilter("CONTACTED");
                          setShowStatusDropdown(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Contacted
                        </div>
                      </button>
                      <button
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "PENDING"
                            ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                            : "text-gray-700"
                        } hover:bg-[#F8F2F5]`}
                        onClick={() => {
                          setStatusFilter("PENDING");
                          setShowStatusDropdown(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-yellow-500" />
                          Pending
                        </div>
                      </button>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-[#3D021E] hover:text-[#4A0404] transition-colors font-medium"
                  onClick={resetFilters}
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  Phone
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/80"
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.fullName}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">
                      {contact.phoneNumber}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {contact.status === "CONTACTED" ? (
                      <span
                        className={`px-2 sm:px-3 py-1 inline-flex text-xs sm:text-sm font-medium rounded-full ${getStatusColor(
                          contact.status
                        )}`}
                      >
                        {contact.status.charAt(0) +
                          contact.status.slice(1).toLowerCase()}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmStatusChange({
                            id: contact.id,
                            newStatus:
                              contact.status === "PENDING"
                                ? "CONTACTED"
                                : "PENDING",
                            fullName: contact.fullName,
                          });
                        }}
                        className={`px-2 sm:px-3 py-1 inline-flex text-xs sm:text-sm font-medium rounded-full ${getStatusColor(
                          contact.status
                        )} focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-colors`}
                      >
                        {contact.status.charAt(0) +
                          contact.status.slice(1).toLowerCase()}
                      </button>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {formatDate(contact.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-6 border-gray-200 bg-white border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-7xl mx-auto space-y-6">
        {!isLoading && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Contacts
            </h2>
          </div>
        )}
        <ContactList />
        {toast && (
          <div
            className={`fixed bottom-4 right-4 p-3 sm:p-4 rounded-lg shadow-lg max-w-[90%] sm:max-w-md z-50 border-l-4 ${
              toast.type === "success"
                ? "bg-green-100 border-green-500"
                : toast.type === "error"
                ? "bg-red-100 border-red-500"
                : "bg-blue-100 border-blue-500"
            }`}
          >
            <div className="flex items-start">
              <div className="ml-2 sm:ml-3">
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
          </div>
        )}

        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-[#3D021E]">
                  Contact Details
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 hover:text-[#3D021E] transition-colors"
                >
                  <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <ContactDetail
                contact={selectedContact}
                onClose={() => setSelectedContact(null)}
              />
            </div>
          </div>
        )}

        {confirmStatusChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#3D021E] mb-4">
                Confirm Status Change
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to change the status of{" "}
                {confirmStatusChange.fullName} to{" "}
                {confirmStatusChange.newStatus.charAt(0) +
                  confirmStatusChange.newStatus.slice(1).toLowerCase()}
                ?
              </p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    handleStatusChange(
                      confirmStatusChange.id,
                      confirmStatusChange.newStatus
                    );
                    setConfirmStatusChange(null);
                  }}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors text-sm sm:text-base"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmStatusChange(null)}
                  className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
