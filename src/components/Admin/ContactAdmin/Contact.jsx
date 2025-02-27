"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  CheckCircle,
  MoreHorizontal,
  ChevronDown,
  Check,
  Mail,
  Calendar,
} from "lucide-react";

// Sample data
const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    message: "Interested in spa packages for a group event",
    date: "2024-02-23",
    status: "new",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 (555) 234-5678",
    message: "Question about massage services",
    date: "2024-02-22",
    status: "read",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "+1 (555) 345-6789",
    message: "Booking inquiry for couples massage",
    date: "2024-02-21",
    status: "responded",
  },
];

export default function Contact() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const statusOptions = ["All Status", "New", "Read", "Responded"];
  const dateOptions = [
    "All Time",
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);

    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".filter-dropdown") &&
        !event.target.closest(".action-dropdown")
      ) {
        setIsStatusDropdownOpen(false);
        setIsDateDropdownOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      new: "bg-blue-100 text-blue-800",
      read: "bg-yellow-100 text-yellow-800",
      responded: "bg-green-100 text-green-800",
    };
    return styles[status];
  };

  const handleActionClick = (contactId, action) => {
    console.log(`${action} for contact ${contactId}`);
    setActiveDropdown(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-end items-center gap-4">
        <div className="relative filter-dropdown">
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="inline-flex items-center justify-between h-10 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[140px]"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {dateFilter}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {isDateDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[140px] rounded-md bg-white shadow-lg border border-gray-200 py-1 z-20">
              {dateOptions.map((date) => (
                <button
                  key={date}
                  onClick={() => {
                    setDateFilter(date);
                    setIsDateDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  {date}
                  {dateFilter === date && (
                    <Check className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative filter-dropdown">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="inline-flex items-center justify-between h-10 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[140px]"
          >
            {statusFilter}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[140px] rounded-md bg-white shadow-lg border border-gray-200 py-1 z-20">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  {status}
                  {statusFilter === status && (
                    <Check className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">
            Total Messages
          </div>
          <div className="mt-2 text-3xl font-semibold">24</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">New Messages</div>
          <div className="mt-2 text-3xl font-semibold text-blue-600">8</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-500">Response Rate</div>
          <div className="mt-2 text-3xl font-semibold text-green-600">92%</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.email}</div>
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {contact.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        contact.status
                      )}`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative action-dropdown">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === contact.id ? null : contact.id
                          )
                        }
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {activeDropdown === contact.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() =>
                                handleActionClick(contact.id, "mark-read")
                              }
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
                            >
                              <CheckCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                              Mark as Read
                            </button>
                            <button
                              onClick={() =>
                                handleActionClick(contact.id, "send-response")
                              }
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
                            >
                              <Mail className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                              Send Response
                            </button>
                            <button
                              onClick={() =>
                                handleActionClick(contact.id, "delete")
                              }
                              className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                            >
                              <Trash2 className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                              Delete
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
