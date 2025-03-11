// "use client";

// import { useState } from "react";
// import { format } from "date-fns";
// import PropTypes from "prop-types";

// // Mock data for appointments (notes and room removed)
// const appointments = [
//   {
//     id: "1",
//     clientName: "Emma Thompson",
//     clientEmail: "emma.thompson@example.com",
//     clientPhone: "(555) 123-4567",
//     service: "Deep Tissue Massage",
//     duration: 60,
//     price: 85,
//     time: "10:00 AM",
//     date: new Date(2025, 2, 3),
//     therapist: "Sarah Johnson",
//     status: "confirmed",
//   },
//   {
//     id: "2",
//     clientName: "Michael Chen",
//     clientEmail: "michael.chen@example.com",
//     clientPhone: "(555) 987-6543",
//     service: "Hot Stone Therapy",
//     duration: 90,
//     price: 120,
//     time: "1:00 PM",
//     date: new Date(2025, 2, 3),
//     therapist: "David Wilson",
//     status: "confirmed",
//   },
//   {
//     id: "3",
//     clientName: "Olivia Davis",
//     clientEmail: "olivia.davis@example.com",
//     clientPhone: "(555) 456-7890",
//     service: "Facial Treatment",
//     duration: 45,
//     price: 65,
//     time: "3:30 PM",
//     date: new Date(2025, 2, 3),
//     therapist: "Lisa Martinez",
//     status: "pending",
//   },
//   {
//     id: "4",
//     clientName: "James Wilson",
//     clientEmail: "james.wilson@example.com",
//     clientPhone: "(555) 234-5678",
//     service: "Swedish Massage",
//     duration: 60,
//     price: 75,
//     time: "11:00 AM",
//     date: new Date(2025, 2, 4),
//     therapist: "Sarah Johnson",
//     status: "confirmed",
//   },
//   {
//     id: "5",
//     clientName: "Sophia Rodriguez",
//     clientEmail: "sophia.rodriguez@example.com",
//     clientPhone: "(555) 876-5432",
//     service: "Aromatherapy",
//     duration: 75,
//     price: 95,
//     time: "2:15 PM",
//     date: new Date(2025, 2, 4),
//     therapist: "David Wilson",
//     status: "cancelled",
//   },
// ];

// export function BookingDetails({ bookingId }) {
//   const booking = appointments.find((a) => a.id === bookingId);
//   const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
//   const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

//   if (!booking) {
//     return (
//       <div className="p-6 text-center text-gray-500">Appointment not found</div>
//     );
//   }

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "confirmed":
//         return (
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
//             Confirmed
//           </span>
//         );
//       case "pending":
//         return (
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
//             Pending
//           </span>
//         );
//       case "cancelled":
//         return (
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
//             Cancelled
//           </span>
//         );
//       default:
//         return (
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
//             Unknown
//           </span>
//         );
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-4 border-b">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800">
//               Appointment Details
//             </h2>
//             <p className="text-sm text-gray-500">View and manage appointment</p>
//           </div>
//           {getStatusBadge(booking.status)}
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto p-4">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xl font-medium">
//             {booking.clientName
//               .split(" ")
//               .map((n) => n[0])
//               .join("")}
//           </div>
//           <div>
//             <h3 className="font-semibold text-lg text-gray-800">
//               {booking.clientName}
//             </h3>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-3 w-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                 />
//               </svg>
//               <span>{booking.clientPhone}</span>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Date</span>
//               <span className="flex items-center gap-1 text-gray-800">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-pink-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//                 {format(booking.date, "MMMM d, yyyy")}
//               </span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Time</span>
//               <span className="flex items-center gap-1 text-gray-800">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-pink-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 {booking.time} ({booking.duration} min)
//               </span>
//             </div>
//           </div>

//           <hr className="border-gray-200" />

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Service</span>
//               <span className="font-medium text-gray-800">
//                 {booking.service}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Price</span>
//               <span className="font-medium text-gray-800">
//                 ${booking.price}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Therapist</span>
//               <span className="flex items-center gap-1 text-gray-800">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-pink-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//                 {booking.therapist}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between p-4 border-t">
//         {/* Cancel Dialog */}
//         {isCancelDialogOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 Cancel Appointment
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Are you sure you want to cancel this appointment? This action
//                 cannot be undone.
//               </p>
//               <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50 mb-6">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-8 w-8 text-red-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                   />
//                 </svg>
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     {booking.service} with {booking.clientName}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {format(booking.date, "MMMM d, yyyy")} at {booking.time}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
//                   onClick={() => setIsCancelDialogOpen(false)}
//                 >
//                   Keep Appointment
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                   onClick={() => setIsCancelDialogOpen(false)}
//                 >
//                   Cancel Appointment
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Status Edit Dialog */}
//         {isStatusDialogOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 Edit Appointment Status
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Change the status of this appointment.
//               </p>
//               <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50 mb-6">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-8 w-8 text-blue-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     {booking.service} with {booking.clientName}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {format(booking.date, "MMMM d, yyyy")} at {booking.time}
//                   </p>
//                 </div>
//               </div>
//               <div className="grid gap-4 mb-6">
//                 <div className="flex flex-col gap-2">
//                   <label
//                     htmlFor="status"
//                     className="text-sm font-medium text-gray-700"
//                   >
//                     Status
//                   </label>
//                   <div className="grid grid-cols-1 gap-2">
//                     <button
//                       className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 flex items-center justify-center"
//                       onClick={() => setIsStatusDialogOpen(false)}
//                     >
//                       <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
//                       Pending
//                     </button>
//                     <button
//                       className="px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 flex items-center justify-center"
//                       onClick={() => setIsStatusDialogOpen(false)}
//                     >
//                       <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
//                       Confirm
//                     </button>
//                     <button
//                       className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
//                       onClick={() => setIsStatusDialogOpen(false)}
//                     >
//                       <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
//                       Check In
//                     </button>
//                     <button
//                       className="px-4 py-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center"
//                       onClick={() => setIsStatusDialogOpen(false)}
//                     >
//                       <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
//                       Check Out
//                     </button>
//                     <button
//                       className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
//                       onClick={() => setIsStatusDialogOpen(false)}
//                     >
//                       <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
//                   onClick={() => setIsStatusDialogOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Footer with Edit Status button on the right */}
//         <div className="flex gap-2">
//           {/* Empty div for left side - add buttons here if needed */}
//         </div>
//         <div className="flex gap-2">
//           <button
//             className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center"
//             onClick={() => setIsStatusDialogOpen(true)}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 11l5-5m0 0l5 5m-5-5v12"
//               />
//             </svg>
//             Edit Status
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// BookingDetails.propTypes = {
//   bookingId: PropTypes.string.isRequired,
// };

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import axios from "axios";

export function BookingDetails({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Dùng "token" như yêu cầu
        console.log("Token:", token); // Log để kiểm tra token
        if (!token) {
          throw new Error(
            "No authentication token found. Please log in again."
          );
        }

        const response = await axios.get(
          `"https://dea0-2405-4802-8132-b860-c0f1-9db4-3f51-d919.ngrok-free.app/api/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = response.data;
        console.log("Booking data:", data); // Log dữ liệu trả về từ API
        setBooking(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch booking details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem("token"); // Dùng "token" như yêu cầu
      console.log("Token for status update:", token); // Log để kiểm tra token
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      let endpoint = "";
      let method = "PATCH";
      switch (newStatus) {
        case "CANCELLED":
          endpoint = `/api/bookings/${bookingId}/cancel`;
          method = "POST";
          break;
        case "CHECK_IN":
          endpoint = `/api/bookings/${bookingId}/checkin`;
          method = "POST";
          break;
        case "CHECK_OUT":
          endpoint = `/api/bookings/${bookingId}/checkout`;
          method = "POST";
          break;
        default:
          endpoint = `/api/bookings/${bookingId}/status`;
      }

      const response = await axios({
        method,
        url: `"https://dea0-2405-4802-8132-b860-c0f1-9db4-3f51-d919.ngrok-free.app/${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        data: { status: newStatus },
      });

      if (response.status === 200) {
        setBooking(response.data);
        setIsStatusDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking status. Please try again later."
      );
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!booking) {
    return (
      <div className="p-6 text-center text-gray-500">Appointment not found</div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Appointment Details
            </h2>
            <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Date</span>
              <span className="flex items-center gap-1 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {format(new Date(booking.bookingDate), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Time</span>
              <span className="flex items-center gap-1 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {booking.timeSlot}
              </span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Service</span>
              <span className="font-medium text-gray-800">
                {booking.serviceNames.join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Price</span>
              <span className="font-medium text-gray-800">
                ${booking.totalPrice || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Specialist ID</span>
              <span className="text-gray-800">
                {booking.specialistId || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t">
        <div className="flex gap-2">{/* Có thể thêm nút khác nếu cần */}</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            Edit Status
          </button>
        </div>
      </div>

      {isStatusDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Edit Appointment Status
            </h3>
            <p className="text-gray-600 mb-4">
              Change the status of this appointment.
            </p>
            <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-800">
                  {booking.serviceNames.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.bookingDate), "MMMM d, yyyy")} at{" "}
                  {booking.timeSlot}
                </p>
              </div>
            </div>
            <div className="grid gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("PENDING")}
                  >
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    Pending
                  </button>
                  <button
                    className="px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("CONFIRMED")}
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Confirm
                  </button>
                  <button
                    className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("CHECK_IN")}
                  >
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    Check In
                  </button>
                  <button
                    className="px-4 py-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("CHECK_OUT")}
                  >
                    <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
                    Check Out
                  </button>
                  <button
                    className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
                    onClick={() => handleStatusUpdate("CANCELLED")}
                  >
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

BookingDetails.propTypes = {
  bookingId: PropTypes.string.isRequired,
};
