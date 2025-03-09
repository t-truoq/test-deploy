// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { format } from "date-fns";

// // Mock authentication context (replace with your actual auth logic)
// const isStaff = true; // Replace with actual staff check (e.g., from context or token)

// export function BookingCalendar() {
//   const [bookings, setBookings] = useState([]);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch all bookings using axios
//   useEffect(() => {
//     const fetchBookings = async () => {
//       const token = localStorage.getItem("token");
//       if (!isStaff) {
//         setError("Access denied. Only staff can view bookings.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = response.data;
//         setBookings(Array.isArray(data) ? data : [data]);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         setError(
//           error.response?.data?.message ||
//             "Failed to fetch bookings. Please try again later."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="flex h-screen gap-4 p-4">
//       {/* Bookings Table */}
//       <div className="w-1/2 bg-white rounded-lg border shadow p-4 overflow-auto">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointments</h2>
//         {loading ? (
//           <div className="text-center py-8 text-gray-500">Loading...</div>
//         ) : error ? (
//           <div className="text-center py-8 text-red-500">{error}</div>
//         ) : bookings.length > 0 ? (
//           <div className="space-y-3">
//             {bookings.map((booking) => (
//               <div
//                 key={booking.bookingId}
//                 className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                   selectedBookingId === booking.bookingId
//                     ? "border-pink-500 bg-pink-50"
//                     : "hover:border-pink-300"
//                 }`}
//                 onClick={() => setSelectedBookingId(booking.bookingId)}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="font-medium text-gray-800">
//                     Booking ID: {booking.bookingId}
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
//                       booking.status === "PENDING"
//                         ? "bg-yellow-500"
//                         : booking.status === "CONFIRMED"
//                         ? "bg-green-500"
//                         : booking.status === "CANCELLED"
//                         ? "bg-red-500"
//                         : "bg-gray-500"
//                     }`}
//                   >
//                     {booking.status}
//                   </span>
//                 </div>
//                 <div className="text-sm text-gray-500 mb-1">
//                   {format(new Date(booking.bookingDate), "MMM d, yyyy")} •{" "}
//                   {booking.timeSlot}
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <div className="text-gray-700">
//                     {booking.serviceNames.join(", ")}
//                   </div>
//                   <div className="text-gray-500">
//                     Specialist ID: {booking.specialistId}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             No bookings found
//           </div>
//         )}
//       </div>

//       {/* Booking Details */}
//       <div className="w-1/2">
//         {selectedBookingId ? (
//           <BookingDetails bookingId={selectedBookingId} />
//         ) : (
//           <div className="p-6 text-center text-gray-500">
//             Select a booking to view details
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function BookingDetails({ bookingId }) {
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

//   useEffect(() => {
//     const fetchBookingDetails = async () => {
//       if (!isStaff) {
//         setError("Access denied. Only staff can view booking details.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/status`,
//           {
//             headers: {
//               // Add authorization header if required
//               // Authorization: `Bearer ${yourToken}`,
//             },
//           }
//         );
//         const data = response.data;
//         setBooking(Array.isArray(data) ? data[0] : data);
//       } catch (error) {
//         console.error("Error fetching booking details:", error);
//         setError(
//           error.response?.data?.message ||
//             "Failed to fetch booking details. Please try again later."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookingDetails();
//   }, [bookingId]);

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "CONFIRMED":
//         return (
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
//             Confirmed
//           </span>
//         );
//       case "PENDING":
//         return (
//           <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
//             Pending
//           </span>
//         );
//       case "CANCELLED":
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

//   const handleStatusUpdate = async (newStatus) => {
//     if (!isStaff) {
//       setError("Access denied. Only staff can update booking status.");
//       return;
//     }

//     try {
//       let endpoint = "";
//       let method = "PATCH"; // Default method for status updates
//       switch (newStatus) {
//         case "CANCELLED":
//           endpoint = `/api/bookings/${bookingId}/cancel`;
//           method = "POST";
//           break;
//         case "CHECK_IN":
//           endpoint = `/api/bookings/${bookingId}/checkin`;
//           method = "POST";
//           break;
//         case "CHECK_OUT":
//           endpoint = `/api/bookings/${bookingId}/checkout`;
//           method = "POST";
//           break;
//         default:
//           endpoint = `/api/bookings/${bookingId}/status`;
//       }

//       const response = await axios({
//         method,
//         url: `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app${endpoint}`,
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: `Bearer ${yourToken}`, // Add if required
//         },
//         data: { status: newStatus }, // Send status in the body
//       });

//       if (response.status === 200) {
//         const updatedBooking = response.data;
//         setBooking(updatedBooking);
//         setIsStatusDialogOpen(false);
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError(
//         error.response?.data?.message ||
//           "Failed to update booking status. Please try again later."
//       );
//     }
//   };

//   if (loading) {
//     return <div className="p-6 text-center text-gray-500">Loading...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-500">{error}</div>;
//   }

//   if (!booking) {
//     return (
//       <div className="p-6 text-center text-gray-500">Booking not found</div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-white rounded-lg border shadow">
//       <div className="p-4 border-b">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800">
//               Booking Details
//             </h2>
//             <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
//           </div>
//           {getStatusBadge(booking.status)}
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto p-4">
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Date</span>
//               <span className="text-gray-800">
//                 {format(new Date(booking.bookingDate), "MMMM d, yyyy")}
//               </span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-500">Time</span>
//               <span className="text-gray-800">{booking.timeSlot}</span>
//             </div>
//           </div>

//           <hr className="border-gray-200" />

//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Services</span>
//               <span className="font-medium text-gray-800">
//                 {booking.serviceNames.join(", ")}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Total Price</span>
//               <span className="font-medium text-gray-800">
//                 ${booking.totalPrice}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Specialist ID</span>
//               <span className="text-gray-800">{booking.specialistId}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Check-In Time</span>
//               <span className="text-gray-800">
//                 {booking.checkInTime
//                   ? format(new Date(booking.checkInTime), "PPp")
//                   : "N/A"}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Check-Out Time</span>
//               <span className="text-gray-800">
//                 {booking.checkOutTime
//                   ? format(new Date(booking.checkOutTime), "PPp")
//                   : "N/A"}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-500">Payment Status</span>
//               <span className="text-gray-800">{booking.paymentStatus}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status Edit Dialog */}
//       {isStatusDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               Edit Booking Status
//             </h3>
//             <p className="text-gray-600 mb-4">Change the status of this booking.</p>
//             <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50 mb-6">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 text-blue-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <div>
//                 <p className="font-medium text-gray-800">
//                   {booking.serviceNames.join(", ")}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {format(new Date(booking.bookingDate), "MMMM d, yyyy")} at{" "}
//                   {booking.timeSlot}
//                 </p>
//               </div>
//             </div>
//             <div className="grid gap-4 mb-6">
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="status" className="text-sm font-medium text-gray-700">
//                   Status
//                 </label>
//                 <div className="grid grid-cols-1 gap-2">
//                   <button
//                     className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 flex items-center justify-center"
//                     onClick={() => handleStatusUpdate("PENDING")}
//                   >
//                     <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
//                     Pending
//                   </button>
//                   <button
//                     className="px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 flex items-center justify-center"
//                     onClick={() => handleStatusUpdate("CONFIRMED")}
//                   >
//                     <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
//                     Confirm
//                   </button>
//                   <button
//                     className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
//                     onClick={() => handleStatusUpdate("CHECK_IN")}
//                   >
//                     <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
//                     Check In
//                   </button>
//                   <button
//                     className="px-4 py-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center"
//                     onClick={() => handleStatusUpdate("CHECK_OUT")}
//                   >
//                     <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
//                     Check Out
//                   </button>
//                   <button
//                     className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
//                     onClick={() => handleStatusUpdate("CANCELLED")}
//                   >
//                     <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
//                 onClick={() => setIsStatusDialogOpen(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-end p-4 border-t">
//         <button
//           className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium flex items-center"
//           onClick={() => setIsStatusDialogOpen(true)}
//           disabled={!isStaff}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M7 11l5-5m0 0l5 5m-5-5v12"
//             />
//           </svg>
//           Edit Status
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { parseISO, format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import PropTypes from "prop-types";

export function BookingCalendar({ appointments = [], onAppointmentSelect, selectedAppointmentId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [calendarDays, setCalendarDays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        throw new Error("Invalid selected date");
      }
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      const days = eachDayOfInterval({ start, end });
      setCalendarDays(days);
    } catch (err) {
      console.error("Error generating calendar days:", err);
      setError("Failed to generate calendar. Please try again.");
    }
  }, [selectedDate]);

  const filteredAppointments = (appointments || []).filter((appointment) => {
    if (!(appointment.date instanceof Date) || isNaN(appointment.date)) {
      return false; // Skip invalid dates
    }
    if (view === "day") {
      return isSameDay(appointment.date, selectedDate);
    } else {
      const endDate = addDays(selectedDate, 6);
      return appointment.date >= selectedDate && appointment.date <= endDate;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              view === "day"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              view === "week"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Week
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate((prev) => addDays(prev, -1))}
            className="p-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="font-medium text-gray-800">
            {view === "day"
              ? format(selectedDate, "MMMM d, yyyy")
              : `${format(selectedDate, "MMM d")} - ${format(
                  addDays(selectedDate, 6),
                  "MMM d, yyyy"
                )}`}
          </span>
          <button
            onClick={() => setSelectedDate((prev) => addDays(prev, 1))}
            className="p-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Calendar */}
        <div className="bg-white rounded-lg border shadow p-4 h-full">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
            <p className="text-sm text-gray-500">
              Select a date to view appointments
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!(day instanceof Date) || isNaN(day)) {
                return (
                  <div
                    key={i}
                    className="h-10 w-full rounded-md flex items-center justify-center text-sm text-gray-300"
                  >
                    Invalid
                  </div>
                );
              }

              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, selectedDate);
              const hasAppointments = (appointments || []).some((apt) =>
                apt.date instanceof Date && !isNaN(apt.date)
                  ? isSameDay(apt.date, day)
                  : false
              );

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    h-10 w-full rounded-md flex items-center justify-center text-sm
                    ${!isCurrentMonth && "text-gray-300"}
                    ${
                      isToday(day) &&
                      !isSelected &&
                      "border border-pink-500 text-pink-500"
                    }
                    ${
                      isSelected
                        ? "bg-pink-500 text-white"
                        : "hover:bg-gray-100"
                    }
                    ${hasAppointments && !isSelected && "font-bold"}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg border shadow p-4 h-full overflow-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Appointments
            </h2>
            <p className="text-sm text-gray-500">
              {filteredAppointments.length} appointments for{" "}
              {view === "day" ? format(selectedDate, "MMMM d") : "the week"}
            </p>
          </div>

          <div className="space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAppointmentId === appointment.id
                      ? "border-pink-500 bg-pink-50"
                      : "hover:border-pink-300"
                  }`}
                  onClick={() => onAppointmentSelect(appointment.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">
                      {appointment.clientName}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {appointment.date instanceof Date && !isNaN(appointment.date)
                      ? format(appointment.date, "MMM d")
                      : "Invalid Date"}{" "}
                    • {appointment.time} • {appointment.duration} min
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-700">{appointment.service}</div>
                    <div className="text-gray-500">
                      with {appointment.therapist}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for this {view}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

BookingCalendar.propTypes = {
  appointments: PropTypes.array.isRequired,
  onAppointmentSelect: PropTypes.func,
  selectedAppointmentId: PropTypes.string,
};

// Gán giá trị mặc định cho prop
BookingCalendar.defaultProps = {
  appointments: [],
  onAppointmentSelect: () => {},
  selectedAppointmentId: null,
};