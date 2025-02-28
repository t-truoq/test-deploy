"use client";

import { useState } from "react";
import { Printer, Send, Filter, ChevronDown } from "lucide-react";

const treatments = [
  {
    id: 1,
    service: "clear start prevent & glow",
    time: "30 min",
    cost: 20,
    date: "2024-02-25",
  },
  {
    id: 2,
    service: "pro clear skin treatment",
    time: "1 hour",
    cost: 50,
    date: "2024-02-24",
  },
  {
    id: 3,
    service: "clear start back treatment",
    time: "50 min",
    cost: 100,
    date: "2024-02-23",
  },
];

export default function Invoice() {
  const [dateFilter, setDateFilter] = useState("all");
  const [costFilter, setCostFilter] = useState("all");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCostDropdown, setShowCostDropdown] = useState(false);

  // Filter treatments based on selected filters
  const filteredTreatments = treatments.sort((a, b) => {
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
          <span className="font-semibold">${totalAmount}</span>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-[#3D021E] text-white rounded-md hover:bg-[#3D021E]/90">
          Send
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
