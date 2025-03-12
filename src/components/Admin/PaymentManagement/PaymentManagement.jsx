"use client";

import { useState, useEffect } from "react";
import { Printer, Send, Filter, ChevronDown } from "lucide-react";
import axios from "axios";

const BASE_URL =
  "https://f820-2405-4802-8132-b860-a51b-6c41-f6c4-bde2.ngrok-free.app/api/bookings";

export default function Payment() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [costFilter, setCostFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCostDropdown, setShowCostDropdown] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchCompletedBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
        });

        console.log("API Response:", response.data); // Debug the API response

        if (Array.isArray(response.data)) {
          const completedBookings = response.data
            .filter((booking) => booking.status === "COMPLETED")
            .map((booking) => ({
              id: booking.bookingId,
              service: booking.serviceNames
                ? booking.serviceNames.join(", ")
                : "N/A",
              time: booking.timeSlot, // Assuming timeSlot can represent duration
              cost: booking.totalPrice != null ? booking.totalPrice : 0, // Fallback to 0 if null
              date: booking.bookingDate,
            }));
          setBookings(completedBookings);
        } else {
          throw new Error("Bookings data is not an array");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          if (error.response.status === 302) {
            setError(
              "Redirect detected. Please check authentication or server configuration."
            );
          } else if (error.response.status === 401) {
            setError("Unauthorized: Please login again.");
          } else if (error.response.status === 404) {
            setError("No completed bookings found.");
          } else {
            setError(error.response.data.message || "Failed to load bookings.");
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(error.message || "Failed to load bookings.");
        }
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchCompletedBookings();
  }, [hasFetched]);

  // Filter treatments based on selected filters
  const filteredTreatments = bookings.sort((a, b) => {
    // Date sorting
    if (dateFilter === "newest") return new Date(b.date) - new Date(a.date);
    if (dateFilter === "oldest") return new Date(a.date) - new Date(b.date);

    // Cost sorting
    if (costFilter === "lowToHigh") return a.cost - b.cost;
    if (costFilter === "highToLow") return b.cost - a.cost;

    return 0;
  });

  const totalAmount = filteredTreatments.reduce(
    (sum, treatment) => sum + treatment.cost,
    0
  );

  const resetFilters = () => {
    setDateFilter("all");
    setCostFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A0404] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-6 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Filters - Centered */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          Filter By
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border rounded-md min-w-[100px] bg-white"
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowCostDropdown(false);
            }}
          >
            Date
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDateDropdown && (
            <div className="absolute top-full mt-1 w-[150px] bg-white border rounded-md shadow-lg z-10">
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  dateFilter === "all" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setDateFilter("all");
                  setShowDateDropdown(false);
                }}
              >
                All Dates
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  dateFilter === "newest" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setDateFilter("newest");
                  setShowDateDropdown(false);
                }}
              >
                Newest First
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  dateFilter === "oldest" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setDateFilter("oldest");
                  setShowDateDropdown(false);
                }}
              >
                Oldest First
              </button>
            </div>
          )}
        </div>

        {/* Skin therapist Filter - Static for now */}
        <button className="flex items-center justify-between gap-2 px-4 py-2 text-sm border rounded-md min-w-[120px] bg-white">
          Skin therapist
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Cost Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border rounded-md min-w-[100px] bg-white"
            onClick={() => {
              setShowCostDropdown(!showCostDropdown);
              setShowDateDropdown(false);
            }}
          >
            Cost
            <ChevronDown className="w-4 h-4" />
          </button>

          {showCostDropdown && (
            <div className="absolute top-full mt-1 w-[150px] bg-white border rounded-md shadow-lg z-10">
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  costFilter === "all" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setCostFilter("all");
                  setShowCostDropdown(false);
                }}
              >
                All Prices
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  costFilter === "lowToHigh" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setCostFilter("lowToHigh");
                  setShowCostDropdown(false);
                }}
              >
                Low to High
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  costFilter === "highToLow" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setCostFilter("highToLow");
                  setShowCostDropdown(false);
                }}
              >
                High to Low
              </button>
            </div>
          )}
        </div>

        <button
          className="text-red-500 text-sm hover:text-red-600"
          onClick={resetFilters}
        >
          Reset Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Serial No.
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Service
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Skin therapist
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Time
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Cost
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map((treatment) => (
              <tr key={treatment.id} className="border-b">
                <td className="py-4 px-4 text-sm text-gray-900">
                  {treatment.id}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {treatment.service}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900"></td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {treatment.time}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  ${treatment.cost}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          <Printer className="w-4 h-4" />
        </button>
        <div className="text-sm">
          <span className="font-medium">Total = </span>
          <span className="font-semibold">${totalAmount.toFixed(2)}</span>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-[#3D021E] text-white rounded-md hover:bg-[#3D021E]/90">
          Send
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
