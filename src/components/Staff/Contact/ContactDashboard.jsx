"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { EyeIcon, MoreVerticalIcon, XIcon } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export function ContactDashboard() {
  const [contacts, setContacts] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusEditContact, setStatusEditContact] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

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
        "https://9ee6-2405-4802-8132-b860-a51b-6c41-f6c4-bde2.ngrok-free.app/api/contact",
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
        `https://9ee6-2405-4802-8132-b860-a51b-6c41-f6c4-bde2.ngrok-free.app/api/contact/${id}/status?status=${status}`,
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
      setStatusEditContact(null);
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
              {contact.status}
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
    const calculateDropdownPosition = (triggerElement) => {
      if (!triggerElement) return;
      const rect = triggerElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 160;

      if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left - 160,
        });
      } else {
        setDropdownPosition({
          top: rect.top - dropdownHeight + window.scrollY,
          left: rect.left - 160,
        });
      }
    };

    const toggleDropdown = (id, e) => {
      if (dropdownOpen === id) {
        setDropdownOpen(null);
      } else {
        setDropdownOpen(id);
        calculateDropdownPosition(e.currentTarget);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target)
        ) {
          setDropdownOpen(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const handleScroll = () => {
        if (dropdownOpen && triggerRef.current) {
          calculateDropdownPosition(triggerRef.current);
        }
      };
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }, [dropdownOpen]);

    // Animation variants for the loading spinner and text
    const spinnerVariants = {
      initial: { opacity: 0, scale: 0.8 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    };

    const textVariants = {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeInOut",
          delay: 0.2,
        },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <motion.div
                      variants={spinnerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex justify-center items-center min-h-[300px]"
                    >
                      <motion.div
                        className="text-center bg-white border-gray-100 p-8 rounded-xl shadow-lg border backdrop-blur-sm"
                        variants={spinnerVariants}
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
                        <motion.h3
                          variants={textVariants}
                          className="text-xl text-[#3D021E] font-medium"
                        >
                          Loading contacts...
                        </motion.h3>
                        <motion.p
                          variants={textVariants}
                          className="text-gray-500 mt-2"
                        >
                          Please wait while we fetch your data
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No contacts found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {contact.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setStatusEditContact(contact)}
                        className={`inline-flex px-4 py-2 text-sm font-medium rounded-lg ${getStatusColor(
                          contact.status
                        )} focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-colors`}
                      >
                        {contact.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          ref={dropdownOpen === contact.id ? triggerRef : null}
                          onClick={(e) => toggleDropdown(contact.id, e)}
                          className="text-gray-500 hover:text-[#3D021E] focus:outline-none transition-colors"
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        {dropdownOpen === contact.id && (
                          <div
                            ref={dropdownRef}
                            style={{
                              position: "fixed",
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                            }}
                            className="bg-white rounded-md shadow-lg border border-gray-200 z-50 w-48"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedContact(contact);
                                  setDropdownOpen(null);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                              >
                                <EyeIcon className="h-4 w-4 mr-2 text-[#3D021E]" />
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
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

        {selectedContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
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
          </motion.div>
        )}

        {statusEditContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-[#3D021E] mb-4">
                Edit Contact Status
              </h3>
              <p className="text-gray-600 mb-6">
                Update the status for {statusEditContact.fullName}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg ${
                    statusEditContact.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  } transition-colors`}
                  onClick={() => {
                    handleStatusChange(statusEditContact.id, "PENDING");
                  }}
                >
                  PENDING
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    statusEditContact.status === "CONTACTED"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  } transition-colors`}
                  onClick={() => {
                    handleStatusChange(statusEditContact.id, "CONTACTED");
                  }}
                >
                  CONTACTED
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStatusEditContact(null)}
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
