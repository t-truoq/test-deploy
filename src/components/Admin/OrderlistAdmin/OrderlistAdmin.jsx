import { useState } from "react";

export default function OrderlistAdmin() {
  const [orders] = useState([
    {
      id: "00001",
      name: "Christine Brooks",
      therapist: "Kutch Green Apt",
      date: "04 Sep 2019",
      detail: "clear start back treatment",
      status: "Completed",
    },
    {
      id: "00002",
      name: "Rosie Pearson",
      therapist: "Immanuel Ferry",
      date: "28 May 2019",
      detail: "clear start back treatment",
      status: "Processing",
    },
    {
      id: "00003",
      name: "Darrell Caldwell",
      therapist: "Frida Ports",
      date: "23 Nov 2019",
      detail: "clear start back treatment",
      status: "Rejected",
    },
    {
      id: "00004",
      name: "Gilbert Johnston",
      therapist: "Destiny Lake Suite",
      date: "05 Feb 2019",
      detail: "clear start back treatment",
      status: "Completed",
    },
    {
      id: "00005",
      name: "Alan Cain",
      therapist: "Mylene Throughway",
      date: "29 Jul 2019",
      detail: "clear start back treatment",
      status: "Processing",
    },
    {
      id: "00006",
      name: "Alfred Murray",
      therapist: "Weimann Mountain",
      date: "15 Aug 2019",
      detail: "clear start back treatment",
      status: "Completed",
    },
    {
      id: "00007",
      name: "Maggie Sullivan",
      therapist: "New Scottsberg",
      date: "21 Dec 2019",
      detail: "pro clear skin treatment",
      status: "Processing",
    },
    {
      id: "00008",
      name: "Rosie Todd",
      therapist: "New Jon",
      date: "30 Apr 2019",
      detail: "pro clear skin treatment",
      status: "On Hold",
    },
    {
      id: "00009",
      name: "Dollie Hines",
      therapist: "Lyla Forge Suite",
      date: "09 Jan 2019",
      detail: "pro clear skin treatment",
      status: "In Transit",
    },
  ]);

  const getStatusColor = (status) => {
    const colors = {
      Completed: "bg-emerald-100 text-emerald-800",
      Processing: "bg-purple-100 text-purple-800",
      Rejected: "bg-red-100 text-red-800",
      "On Hold": "bg-orange-100 text-orange-800",
      "In Transit": "bg-pink-100 text-pink-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 4h18M3 12h18M3 20h18" />
              </svg>
              Filter By
            </button>

            <select className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option>Newest</option>
              <option>Oldest</option>
            </select>

            <select className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option>Clear Start</option>
              <option>Pro Clear</option>
            </select>

            <select className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option>Completed</option>
              <option>Processing</option>
              <option>Rejected</option>
              <option>On Hold</option>
              <option>In Transit</option>
            </select>

            <button className="px-3 py-2 text-sm text-rose-600 hover:text-rose-700">
              Reset Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skin Therapist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.therapist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.detail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-gray-200">
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
