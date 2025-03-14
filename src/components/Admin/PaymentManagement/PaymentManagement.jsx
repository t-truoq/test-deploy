"use client";

import { useState, useEffect } from "react";
import { Printer, Send, Filter, ChevronDown } from "lucide-react";
import axios from "axios";

const BASE_URL =
  "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/v1/vnpay";

export default function PaymentStaff() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debug token
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

        console.log("API Response:", response.data); // Debug full response

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid or empty response from payments API");
        }

        const paymentData = response.data.map((payment) => ({
          paymentId: payment.paymentId || "N/A",
          amount: payment.amount ? Number(payment.amount) : 0,
          paymentMethod: payment.paymentMethod || "N/A",
          paymentTime: payment.paymentTime || "N/A",
          status: payment.status || "N/A",
          transactionId: payment.transactionId || "N/A",
          bookingId: payment.bookingId || "N/A",
        }));
        setPayments(paymentData);
      } catch (error) {
        console.error("Detailed Error:", error); // Log full error
        console.log("Server Response:", error.response?.data); // Log server response details
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setError(
                "Bad request. Please check the token or API endpoint. Details: " +
                  (error.response.data?.message || "No additional details")
              );
              break;
            case 401:
              setError("Unauthorized: Please login again.");
              break;
            case 404:
              setError("No payment data found.");
              break;
            default:
              setError(
                `API error (Status: ${error.response.status}) - ${error.message}`
              );
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(error.message || "An unexpected error occurred.");
        }
        // Fallback to mock data if API fails
        if (!payments.length) {
          console.log("Using mock data due to API failure");
          const mockData = [
            {
              paymentId: "9007199254740991",
              amount: 0,
              paymentMethod: "string", // Placeholder, replace with actual method if available
              paymentTime: "2025-03-12T15:14:42.819Z",
              status: "PENDING",
              transactionId: "9007199254740991",
              bookingId: "9007199254740991",
            },
          ];
          setPayments(mockData);
        }
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchPayments();
  }, [hasFetched]);

  // Filter payments based on selected filters
  const filteredPayments = payments
    .filter(
      (payment) => statusFilter === "all" || payment.status === statusFilter
    )
    .sort((a, b) => {
      if (dateFilter === "newest") {
        return new Date(b.paymentTime || 0) - new Date(a.paymentTime || 0);
      }
      if (dateFilter === "oldest") {
        return new Date(a.paymentTime || 0) - new Date(b.paymentTime || 0);
      }
      return 0;
    });

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  const resetFilters = () => {
    setDateFilter("all");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A0404] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading payments...</p>
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
          <button
            className="px-4 py-2 bg-[#3D021E] text-white rounded-md hover:bg-[#3D021E]/90"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
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
              setShowStatusDropdown(false);
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

        {/* Status Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border rounded-md min-w-[120px] bg-white"
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowDateDropdown(false);
            }}
          >
            Status
            <ChevronDown className="w-4 h-4" />
          </button>

          {showStatusDropdown && (
            <div className="absolute top-full mt-1 w-[150px] bg-white border rounded-md shadow-lg z-10">
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  statusFilter === "all" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setStatusFilter("all");
                  setShowStatusDropdown(false);
                }}
              >
                All Status
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  statusFilter === "PENDING" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setStatusFilter("PENDING");
                  setShowStatusDropdown(false);
                }}
              >
                Pending
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  statusFilter === "SUCCESS" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setStatusFilter("SUCCESS");
                  setShowStatusDropdown(false);
                }}
              >
                Success
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  statusFilter === "FAILED" ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setStatusFilter("FAILED");
                  setShowStatusDropdown(false);
                }}
              >
                Failed
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
                Payment ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Payment method
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Time
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Transaction ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                Booking ID
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.paymentId} className="border-b">
                <td className="py-4 px-4 text-sm text-gray-900">
                  {payment.paymentId}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {payment.paymentMethod}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {payment.paymentTime
                    ? new Date(payment.paymentTime).toLocaleString()
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {payment.status}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {payment.transactionId}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {payment.bookingId}
                </td>
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
