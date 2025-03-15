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
        "https://beautya-gr2-production.up.railway.app/api/contact",
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
    try {
      const response = await axios.put(
        `https://beautya-gr2-production.up.railway.app/api/contact/${id}/status?status=${status}`,
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
        message: `${
          contacts.find((c) => c.id === id).fullName
        }'s status changed to ${status}.`,
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
    return new Date(dateString).toLocaleString();
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

  // Filter contacts based on selected filters
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
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ID</h3>
            <p className="mt-1 text-sm text-gray-900">{contact.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span
              className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                contact.status
              )} border`}
            >
              {contact.status.charAt(0) + contact.status.slice(1).toLowerCase()}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
            <p className="mt-1 text-sm text-gray-900">{contact.fullName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="mt-1 text-sm text-gray-900">{contact.phoneNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(contact.createdAt)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(contact.updatedAt)}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Message</h3>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
            {contact.message}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors"
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
              Loading contacts...
            </h3>
            <p className="text-gray-500 mt-2">
              Please wait while we fetch your data
            </p>
          </motion.div>
        </div>
      );
    }

    if (contacts.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="text-center py-8 text-gray-500">
            No contacts found
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-gray-200 border-b">
          <div className="flex flex-col md:flex-row justify-end gap-4">
            {/* Filters (moved to the right) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-[#3D021E] font-medium flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filters
              </div>

              {/* Date Filter */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-lg min-w-[140px] ${
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
                    className="absolute top-full mt-1 w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
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
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-lg min-w-[140px] ${
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
                    className="absolute top-full mt-1 w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden"
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <tr
                  key={contact.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/80"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        setConfirmStatusChange({
                          id: contact.id,
                          newStatus:
                            contact.status === "PENDING"
                              ? "CONTACTED"
                              : "PENDING",
                          fullName: contact.fullName,
                        })
                      }
                      className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(
                        contact.status
                      )} focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-colors`}
                    >
                      {contact.status.charAt(0) +
                        contact.status.slice(1).toLowerCase()}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contact.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-gray-200 bg-white border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
            Contacts
          </h2>
        </div>
        <ContactList />
        {toast && (
          <div
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
          </div>
        )}

        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#3D021E]">
                  Contact Details
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 hover:text-[#3D021E] transition-colors"
                >
                  <XIcon className="h-6 w-6" />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-[#3D021E] mb-4">
                Confirm Status Change
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change the status of{" "}
                {confirmStatusChange.fullName} to{" "}
                {confirmStatusChange.newStatus.charAt(0) +
                  confirmStatusChange.newStatus.slice(1).toLowerCase()}
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    handleStatusChange(
                      confirmStatusChange.id,
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
          </div>
        )}
      </div>
    </div>
  );
}
