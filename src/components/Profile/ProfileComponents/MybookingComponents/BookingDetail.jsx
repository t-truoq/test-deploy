// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Calendar, Clock, CreditCard, ArrowLeft } from "lucide-react";

// const BookingDetail = () => {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchBookingDetail = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No token found. Please login again.");
//         }

//         const response = await axios.get(
//           `https://c12e-2405-4802-8132-b860-c0f1-9db4-3f51-d919.ngrok-free.app/api/bookings/${bookingId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Booking detail response:", response.data);
//         setBooking(response.data);
//       } catch (error) {
//         console.error("Error fetching booking detail:", error);
//         if (error.response && error.response.status === 401) {
//           setError("Unauthorized: Please login again.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);
//         } else {
//           setError(error.response?.data.message || "Failed to load booking details.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookingDetail();
//   }, [bookingId, navigate]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return "N/A";
//     return timeString;
//   };

//   if (loading) {
//     return <div>Loading booking details...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600">{error}</div>;
//   }

//   if (!booking) {
//     return <div>No booking found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <button
//           onClick={() => navigate("/my-bookings")}
//           className="mb-6 flex items-center text-rose-600 hover:text-rose-700"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to My Bookings
//         </button>
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking #{booking.bookingId}</h1>
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <div className="flex items-start mb-4">
//                 <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Booking Date</p>
//                   <p className="font-medium text-gray-800">{formatDate(booking.bookingDate)}</p>
//                 </div>
//               </div>
//               <div className="flex items-start mb-4">
//                 <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Time Slot</p>
//                   <p className="font-medium text-gray-800">{booking.timeSlot}</p>
//                 </div>
//               </div>
//               <div className="flex items-start mb-4">
//                 <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Total Price</p>
//                   <p className="font-medium text-gray-800">${booking.totalPrice || "N/A"}</p>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Status</p>
//               <p className="font-medium text-gray-800">{booking.status}</p>
//               {booking.checkInTime && (
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-500">Check-in Time</p>
//                   <p className="font-medium text-gray-800">{formatTime(booking.checkInTime)}</p>
//                 </div>
//               )}
//               {booking.checkOutTime && (
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-500">Check-out Time</p>
//                   <p className="font-medium text-gray-800">{formatTime(booking.checkOutTime)}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="mt-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
//             {booking.services && booking.services.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {booking.services.map((service) => (
//                   <li key={service.serviceId} className="py-3 flex justify-between">
//                     <div>
//                       <p className="font-medium text-gray-800">{service.name}</p>
//                       <p className="text-sm text-gray-600">{service.duration} minutes</p>
//                     </div>
//                     <p className="font-semibold text-gray-800">${service.price.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-600">No services found for this booking.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingDetail;