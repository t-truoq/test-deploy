"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { AddClientModal } from "./AddClientModal";
import { EditClientModal } from "./EditClientModal";

const initialClients = [
  {
    id: "1",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    phone: "(555) 123-4567",
    visits: 8,
    lastVisit: "Feb 28, 2025",
    status: "active",
    preferredService: "Deep Tissue Massage",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "(555) 987-6543",
    visits: 3,
    lastVisit: "Mar 1, 2025",
    status: "active",
    preferredService: "Hot Stone Therapy",
  },
  {
    id: "3",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    phone: "(555) 456-7890",
    visits: 12,
    lastVisit: "Feb 15, 2025",
    status: "active",
    preferredService: "Facial Treatment",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "(555) 234-5678",
    visits: 5,
    lastVisit: "Mar 2, 2025",
    status: "active",
    preferredService: "Swedish Massage",
  },
  {
    id: "5",
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@example.com",
    phone: "(555) 876-5432",
    visits: 1,
    lastVisit: "Jan 20, 2025",
    status: "inactive",
    preferredService: "Aromatherapy",
  },
  {
    id: "6",
    name: "William Taylor",
    email: "william.taylor@example.com",
    phone: "(555) 345-6789",
    visits: 7,
    lastVisit: "Feb 10, 2025",
    status: "active",
    preferredService: "Deep Tissue Massage",
  },
  {
    id: "7",
    name: "Ava Martinez",
    email: "ava.martinez@example.com",
    phone: "(555) 654-3210",
    visits: 4,
    lastVisit: "Feb 22, 2025",
    status: "active",
    preferredService: "Hot Stone Therapy",
  },
];

export function StaffClients() {
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleSaveEditedClient = (updatedClient) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId) => {
    setClientToDelete(clientId);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      setClients(clients.filter((client) => client.id !== clientToDelete));
      setClientToDelete(null);
    }
  };

  const handleAddClient = (newClient) => {
    const client = {
      ...newClient,
      id: (clients.length + 1).toString(),
      visits: 0,
      lastVisit: "N/A",
    };
    setClients([...clients, client]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your client database
            </p>
          </div>
          <button
            className="px-4 py-2 text-white bg-pink-500 rounded-md flex items-center hover:bg-pink-600 transition-colors duration-300"
            onClick={() => setIsAddClientModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Search and Table */}
      <div className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
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
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-800 text-sm font-medium">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.preferredService}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        client.status
                      )}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === client.id ? null : client.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {dropdownOpen === client.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => handleEditClient(client)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Edit Client
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Delete Client
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

      <EditClientModal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
        onSave={handleSaveEditedClient}
      />

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAdd={handleAddClient}
      />

      {clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this client?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteClient}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
