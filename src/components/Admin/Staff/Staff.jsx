"use client";

import { motion } from "framer-motion";
import { Search, MoreHorizontal, XIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Edit } from "./Edit";

const API_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/users";

export function Staffs() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const dropdownRefs = useRef({});

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("handleClickOutside triggered, target:", event.target);
      Object.keys(dropdownOpen).forEach((clientId) => {
        if (
          dropdownOpen[clientId] &&
          dropdownRefs.current[clientId] &&
          !dropdownRefs.current[clientId].contains(event.target)
        ) {
          console.log(`Closing dropdown for client ${clientId}`);
          setDropdownOpen((prev) => ({ ...prev, [clientId]: false }));
        }
      });
    };
    document.addEventListener("click", handleClickOutside); // Changed to "click"
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      const data = JSON.parse(text);
      if (data.code !== 0) throw new Error(data.msg || "API returned an error");

      const mappedClients = data.result
        .filter((user) => user.role === "STAFF")
        .map((user) => ({
          id: user.userId.toString(),
          name: user.name || "Unknown",
          email: user.email || "N/A",
          phone: user.phone || "N/A",
          address: user.address || "N/A",
          role: user.role || "STAFF",
          visits: 0,
        }));
      setClients(mappedClients);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError(error.message);
      showToast({
        title: "Error",
        message: error.message || "Failed to load staff.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const handleEditClient = (client) => {
    console.log("Editing client:", client);
    setEditingClient(client);
    setDropdownOpen((prev) => ({ ...prev, [client.id]: false }));
  };

  const handleSaveEditedClient = (updatedClient) => {
    setClients(
      clients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    setEditingClient(null);
    showToast({
      title: "Success",
      message: `${updatedClient.name}'s details updated successfully.`,
      type: "success",
    });
  };

  const handleDeleteClient = (clientId) => {
    console.log("Deleting client ID:", clientId);
    setClientToDelete(clientId);
    setDropdownOpen((prev) => ({ ...prev, [clientId]: false }));
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      const deletedClient = clients.find((c) => c.id === clientToDelete);
      setClients(clients.filter((c) => c.id !== clientToDelete));
      setClientToDelete(null);
      showToast({
        title: "Deleted",
        message: `${deletedClient.name} has been deleted.`,
        type: "info",
      });
    }
  };

  const toggleDropdown = (clientId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [clientId]: !(prev[clientId] ?? false),
    }));
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white border-gray-100 p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
            Loading staff...
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-[#3D021E]">
            <svg
              className="h-full w-full"
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
          <button
            onClick={fetchClients}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors text-sm sm:text-base mt-4"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Staff
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Manage your staff list
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            {/* Table for medium and larger screens */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-right text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D021E] to-[#6D0F3D] flex items-center justify-center text-white text-sm font-medium">
                            {getInitials(client.name)}
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                        {client.address}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                        {client.role}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div
                          ref={(el) => {
                            dropdownRefs.current[client.id] = el;
                            console.log(
                              `Setting ref for client ${client.id}:`,
                              el
                            );
                          }}
                          className="relative"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(client.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          {dropdownOpen[client.id] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden ${
                                index === filteredClients.length - 1
                                  ? "bottom-full mb-2"
                                  : "top-full mt-2"
                              }`}
                            >
                              <div className="py-1" role="menu">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(
                                      "Edit Staff clicked for client:",
                                      client
                                    );
                                    handleEditClient(client);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Edit Staff
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(
                                      "Delete Staff clicked for client ID:",
                                      client.id
                                    );
                                    handleDeleteClient(client.id);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Delete Staff
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for small screens */}
            <div className="block md:hidden space-y-4">
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D021E] to-[#6D0F3D] flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(client.name)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.email}
                        </div>
                      </div>
                    </div>
                    <div
                      ref={(el) => {
                        dropdownRefs.current[client.id] = el;
                        console.log(`Setting ref for client ${client.id}:`, el);
                      }}
                      className="relative"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(client.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {dropdownOpen[client.id] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        >
                          <div className="py-1" role="menu">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(
                                  "Edit Staff clicked for client:",
                                  client
                                );
                                handleEditClient(client);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Edit Staff
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(
                                  "Delete Staff clicked for client ID:",
                                  client.id
                                );
                                handleDeleteClient(client.id);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Delete Staff
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Phone:</span> {client.phone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {client.address}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span> {client.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-4 rounded-lg shadow-lg max-w-[90%] sm:max-w-md z-50 border-l-4 ${
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

        {/* Edit Modal */}
        {editingClient && (
          <Edit
            isOpen={!!editingClient}
            onClose={() => setEditingClient(null)}
            client={editingClient}
            onSave={handleSaveEditedClient}
          />
        )}

        {/* Delete Confirmation Modal */}
        {clientToDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full mx-4 overflow-auto max-h-[90vh]">
              <h3 className="text-lg font-bold text-[#3D021E] mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Are you sure you want to delete this staff?
              </p>
              <div className="mt-4 sm:mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setClientToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteClient}
                  className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-md text-sm sm:text-base font-medium hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
