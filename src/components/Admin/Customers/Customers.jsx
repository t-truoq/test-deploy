"use client";

import { motion } from "framer-motion";
import { Search, MoreHorizontal, XIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Edit } from "./Edit";

const API_URL =
  "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users";

export function Customers() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({}); // Object to track open state per client ID
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const dropdownRefs = useRef({}); // Ref object to store refs for each dropdown

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownOpen).forEach((clientId) => {
        if (
          dropdownOpen[clientId] &&
          dropdownRefs.current[clientId] &&
          !dropdownRefs.current[clientId].contains(event.target)
        ) {
          console.log(`Closing dropdown for client: ${clientId}`);
          setDropdownOpen((prev) => ({ ...prev, [clientId]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          name: user.name,
          email: user.email,
          phone: user.phone || "N/A",
          address: user.address || "N/A",
          role: user.role,
          visits: 0,
        }));

      setClients(mappedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(error.message);
      showToast({
        title: "Error",
        message: error.message || "Failed to load clients.",
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
    setDropdownOpen((prev) => ({ ...prev, [client.id]: false })); // Close dropdown after action
  };

  const handleSaveEditedClient = (updatedClient) => {
    console.log("Saving edited client:", updatedClient);
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
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
    setDropdownOpen((prev) => ({ ...prev, [clientId]: false })); // Close dropdown after action
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      const deletedClient = clients.find(
        (client) => client.id === clientToDelete
      );
      setClients(clients.filter((client) => client.id !== clientToDelete));
      setClientToDelete(null);
      showToast({
        title: "Deleted",
        message: `${deletedClient.name} has been deleted.`,
        type: "info",
      });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
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
            Loading customers...
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
          <button
            onClick={fetchClients}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Customers
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              View your customer list
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D021E] to-[#6D0F3D] flex items-center justify-center text-white text-sm font-medium">
                          {getInitials(client.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current[client.id] = el)}
                      >
                        <button
                          onClick={() => {
                            console.log(
                              `Toggling dropdown for client: ${client.id}`
                            );
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [client.id]: !prev[client.id],
                            }));
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
                            transition={{ duration: 0.1 }}
                            className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 overflow-hidden ${
                              index === filteredClients.length - 1
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                          >
                            <div className="py-1" role="menu">
                              <button
                                onClick={() => handleEditClient(client)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Edit Customer
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Delete Customer
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-[#3D021E] mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this client?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setClientToDelete(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteClient}
                  className="px-4 py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors"
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
