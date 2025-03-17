"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { EditClientModal } from "./EditClientModal";

const API_URL =
  "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users";

export function StaffClients() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

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

  const handleSaveEditedClient = (updatedClient) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setEditingClient(null);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
            Loading clients...
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
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors mt-4"
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
              Clients
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your client database
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg overflow-hidden">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <EditClientModal
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          client={editingClient}
          onSave={handleSaveEditedClient}
        />
      </div>
    </div>
  );
}
