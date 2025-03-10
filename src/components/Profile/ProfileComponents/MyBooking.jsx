// "use client";

// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Calendar,
//   Clock,
//   CreditCard,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ArrowRight,
//   Home,
//   Package,
//   RefreshCw,
//   User,
//   Eye,
//   DollarSign,
//   Timer,
//   X,
//   CreditCardIcon,
//   ChevronRight,
// } from "lucide-react";

// const MyBooking = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorPopup, setErrorPopup] = useState("");
//   const [refresh, setRefresh] = useState(false);
//   const [searchDate, setSearchDate] = useState("");
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [bookingDate, setBookingDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [selectedSpecialist, setSelectedSpecialist] = useState("");
//   const [specialists, setSpecialists] = useState([]);
//   const [isBooking, setIsBooking] = useState(false);
//   const [confirmedBooking, setConfirmedBooking] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [isPaying, setIsPaying] = useState(false);

//   // Fetch bookings, selected services, and specialists
//   useEffect(() => {
//     const storedServiceIds = localStorage.getItem("selectedServiceIdsForBooking");
//     console.log("Retrieved selectedServiceIds from localStorage:", storedServiceIds);

//     const storedServices = localStorage.getItem("selectedServicesForBooking");
//     console.log("Retrieved selectedServices from localStorage:", storedServices);
//     if (storedServices) {
//       try {
//         const parsedServices = JSON.parse(storedServices);
//         if (Array.isArray(parsedServices) && parsedServices.length > 0) {
//           setSelectedServices(parsedServices);
//         } else {
//           setSelectedServices([]);
//         }
//       } catch (error) {
//         console.error("Error parsing selectedServices from localStorage:", error);
//         setSelectedServices([]);
//       }
//     }

//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No token found. Please login again.");

//         const response = await axios.get(
//           "https://f23c-118-69-182-149.ngrok-free.app/api/bookings/user",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Fetch bookings response:", response.data);
//         if (Array.isArray(response.data)) {
//           const sortedBookings = [...response.data].sort((a, b) => {
//             const dateA = new Date(a.createdAt || a.bookingDate);
//             const dateB = new Date(b.createdAt || b.bookingDate);
//             return dateB - dateA;
//           });
//           setBookings(sortedBookings);

//           if (sortedBookings.length === 0) {
//             const defaultBooking = {
//               bookingId: 1,
//               bookingDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//               timeSlot: "14:00-15:00",
//               status: "COMPLETED",
//               paymentStatus: "SUCCESS",
//               totalPrice: 50.0,
//               createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//             };
//             setBookings([defaultBooking]);
//           }
//         } else {
//           throw new Error("Invalid response format: Expected an array of bookings");
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         if (error.response) {
//           if (error.response.status === 401) {
//             setErrorPopup("Unauthorized: Please login again.");
//             setTimeout(() => navigate("/login"), 2000);
//           } else if (error.response.status === 403) {
//             setErrorPopup("You do not have permission to access your bookings.");
//           } else if (error.response.status === 404) {
//             setErrorPopup("No bookings found.");
//           } else {
//             setErrorPopup(error.response.data.message || "Failed to load bookings. Please try again.");
//           }
//         } else if (error.request) {
//           setErrorPopup("Unable to connect to server. CORS issue or server error. Please try again.");
//         } else {
//           setErrorPopup(error.message || "Failed to load bookings. Please try again.");
//         }
//       }
//     };

//     const fetchSpecialists = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No token found. Please login again.");

//         const response = await axios.get(
//           "https://f23c-118-69-182-149.ngrok-free.app/api/users/specialists/active",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Fetch specialists response:", response.data);
//         if (Array.isArray(response.data)) {
//           setSpecialists(response.data);
//         } else {
//           throw new Error("Invalid response format: Expected an array of specialists");
//         }
//       } catch (error) {
//         console.error("Error fetching specialists:", error);
//         setErrorPopup("Failed to load specialists. Please try again.");
//         setSpecialists([]);
//       }
//     };

//     Promise.all([fetchBookings(), fetchSpecialists()]).finally(() => setLoading(false));
//   }, [navigate, refresh]);

//   // Handle payment redirect
//   useEffect(() => {
//     const params = Object.fromEntries(searchParams);
//     const vnp_ResponseCode = params["vnp_ResponseCode"];
//     const vnp_TxnRef = params["vnp_TxnRef"];
//     const lastPaidBookingId = localStorage.getItem("lastPaidBookingId");

//     if (vnp_ResponseCode === "00" && (vnp_TxnRef || lastPaidBookingId)) {
//       const bookingId = lastPaidBookingId
//         ? parseInt(lastPaidBookingId)
//         : parseInt(vnp_TxnRef.split("-")[1]);
//       const booking = bookings.find((b) => b.bookingId === bookingId);
//       if (booking) {
//         setSelectedBooking(booking);
//         fetchBookingDetails(bookingId).then((details) => {
//           if (details) {
//             setBookingDetails({ ...details, paymentStatus: "SUCCESS" });
//             setIsPopupOpen(true);
//             localStorage.removeItem("lastPaidBookingId");
//           }
//         });
//       }
//     } else if (vnp_ResponseCode && vnp_ResponseCode !== "00") {
//       setErrorPopup("Payment failed. Please try again.");
//     }
//   }, [searchParams, bookings]);

//   useEffect(() => {
//     setRefresh((prev) => !prev);
//   }, [location]);

//   const filteredBookings = searchDate
//     ? bookings.filter((booking) => {
//         const bookingDateFormatted = new Date(booking.bookingDate).toISOString().split("T")[0];
//         return bookingDateFormatted === searchDate;
//       })
//     : bookings;

//   const checkBookingConflict = (bookingDate, startTime, services) => {
//     const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
//     const startDateTime = new Date(`${bookingDate}T${startTime}:00`);
//     const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000);
//     const timeSlot = `${startTime}-${endDateTime.toTimeString().slice(0, 5)}`;

//     return bookings.some((booking) => {
//       if (booking.status === "CANCELLED" || booking.bookingId === 1) return false;
//       const existingDate = new Date(booking.bookingDate).toISOString().split("T")[0];
//       const existingTimeSlot = booking.timeSlot;
//       return existingDate === bookingDate && existingTimeSlot === timeSlot;
//     });
//   };

//   const handleConfirmBooking = async () => {
//     if (!bookingDate || !startTime) {
//       setErrorPopup("Please select a booking date and start time.");
//       return;
//     }

//     if (isBooking) {
//       setErrorPopup("Booking in progress... Please wait.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setErrorPopup("No token found. Please login again.");
//       setTimeout(() => navigate("/login"), 2000);
//       return;
//     }

//     if (checkBookingConflict(bookingDate, startTime, selectedServices)) {
//       setErrorPopup("You already have a booking at this time.");
//       return;
//     }

//     const bookingData = {
//       specialistId: selectedSpecialist ? Number(selectedSpecialist) : null,
//       bookingDate,
//       startTime,
//       serviceIds: selectedServices.map((service) => Number(service.serviceId)),
//     };

//     console.log("Booking data to be sent:", bookingData);

//     setIsBooking(true);
//     setErrorPopup("");

//     try {
//       const response = await axios.post(
//         "https://f23c-118-69-182-149.ngrok-free.app/api/bookings",
//         bookingData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Booking response:", response.data);

//       setConfirmedBooking({
//         services: [...selectedServices],
//         bookingDate,
//         startTime,
//         totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0),
//       });

//       setSelectedServices([]);
//       localStorage.removeItem("selectedServicesForBooking");
//       setBookingDate("");
//       setStartTime("");
//       setSelectedSpecialist("");
//       setRefresh((prev) => !prev);
//       setErrorPopup("");
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       const errorMessage = error.response?.data.message || "Failed to create booking. Please try again.";
//       const errorCode = error.response?.data.errorCode;

//       switch (errorCode) {
//         case "UNAUTHENTICATED":
//           setErrorPopup("Unauthorized: Please login again.");
//           setTimeout(() => navigate("/login"), 2000);
//           break;
//         case "SERVICE_NOT_EXISTED":
//           setErrorPopup("One or more selected services do not exist.");
//           break;
//         case "BOOKING_SERVICE_LIMIT_EXCEEDED":
//           setErrorPopup("Too many services selected. Maximum limit exceeded.");
//           break;
//         case "TIME_SLOT_OUTSIDE_WORKING_HOURS":
//           setErrorPopup("Selected time is outside working hours (8:00 - 20:00).");
//           break;
//         case "BOOKING_DATE_IN_PAST":
//           setErrorPopup("Booking date cannot be in the past.");
//           break;
//         case "BOOKING_DATE_TOO_FAR_IN_FUTURE":
//           setErrorPopup("Booking date is too far in the future.");
//           break;
//         case "BOOKING_TIME_CONFLICT":
//           setErrorPopup("You already have a booking at this time.");
//           break;
//         case "SKIN_THERAPIST_NOT_EXISTED":
//           setErrorPopup("Selected specialist does not exist.");
//           break;
//         case "SPECIALIST_NOT_ACTIVE":
//           setErrorPopup("Selected specialist is not active.");
//           break;
//         case "TIME_SLOT_UNAVAILABLE":
//           setErrorPopup("Selected specialist is not available at this time.");
//           break;
//         default:
//           setErrorPopup(errorMessage);
//       }
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const handleCancelBooking = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setErrorPopup("No token found. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }

//       const booking = bookings.find((b) => b.bookingId === bookingId);
//       if (!booking) {
//         setErrorPopup("Booking not found.");
//         return;
//       }

//       if (bookingId === 1) {
//         setErrorPopup("Cannot cancel the default booking.");
//         return;
//       }

//       const [startTime] = booking.timeSlot.split("-");
//       const bookingStartDateTime = new Date(`${booking.bookingDate}T${startTime}:00`);
//       const currentDateTime = new Date();
//       const timeDifference = (bookingStartDateTime - currentDateTime) / (1000 * 60 * 60);

//       if (timeDifference < 24) {
//         setErrorPopup("Cannot cancel booking less than 24 hours before start time.");
//         return;
//       }

//       await axios.post(
//         `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/cancel`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setBookings((prevBookings) =>
//         prevBookings.map((b) => (b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b))
//       );
//       setRefresh((prev) => !prev);
//     } catch (error) {
//       console.error("Error canceling booking:", error);
//       if (error.response) {
//         if (error.response.status === 401) {
//           setErrorPopup("Unauthorized: Please login again.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else if (error.response.status === 403) {
//           setErrorPopup("You do not have permission to cancel this booking.");
//         } else {
//           setErrorPopup(error.response.data.message || "Failed to cancel booking. Please try again.");
//         }
//       } else {
//         setErrorPopup("Failed to cancel booking. Please try again.");
//       }
//     }
//   };

//   const handleCheckIn = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setErrorPopup("No token found. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }

//       if (bookingId === 1) {
//         setErrorPopup("Cannot check-in the default booking.");
//         return;
//       }

//       await axios.post(
//         `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkin`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setBookings((prevBookings) =>
//         prevBookings.map((b) =>
//           b.bookingId === bookingId ? { ...b, checkInTime: new Date().toISOString(), status: "IN_PROGRESS" } : b
//         )
//       );
//       setRefresh((prev) => !prev);
//     } catch (error) {
//       console.error("Error checking in booking:", error);
//       if (error.response) {
//         if (error.response.status === 401) {
//           setErrorPopup("Unauthorized: Please login again.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else {
//           setErrorPopup(error.response.data.message || "Failed to check-in booking. Please try again.");
//         }
//       } else {
//         setErrorPopup("Failed to check-in booking. Please try again.");
//       }
//     }
//   };

//   const handleCheckOut = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setErrorPopup("No token found. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }

//       if (bookingId === 1) {
//         setErrorPopup("Cannot check-out the default booking.");
//         return;
//       }

//       await axios.post(
//         `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setBookings((prevBookings) =>
//         prevBookings.map((b) =>
//           b.bookingId === bookingId ? { ...b, checkOutTime: new Date().toISOString(), status: "COMPLETED" } : b
//         )
//       );
//       setRefresh((prev) => !prev);
//     } catch (error) {
//       console.error("Error checking out booking:", error);
//       if (error.response) {
//         if (error.response.status === 401) {
//           setErrorPopup("Unauthorized: Please login again.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else {
//           setErrorPopup(error.response.data.message || "Failed to check-out booking. Please try again.");
//         }
//       } else {
//         setErrorPopup("Failed to check-out booking. Please try again.");
//       }
//     }
//   };

//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setErrorPopup("No token found. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//         return null;
//       }
  
//       const booking = bookings.find((b) => b.bookingId === bookingId);
//       if (!booking) {
//         setErrorPopup("Booking not found.");
//         return null;
//       }
  
//       // Mock data for default booking
//       if (bookingId === 1) {
//         return {
//           ...booking,
//           services: [{ id: 1, name: "Default Facial", duration: 60, price: 50.0 }],
//           specialist: { name: "Default Specialist", userId: 999, specialization: "Skin Therapist" },
//           totalDuration: 60,
//           totalPrice: 50.0,
//         };
//       }
  
//       // Fetch details from API
//       const response = await axios.get(
//         `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       const bookingData = Array.isArray(response.data) ? response.data[0] : response.data;
//       console.log("Full booking data from API:", JSON.stringify(bookingData, null, 2));
  
//       // Fallback duration map for known services
//       const serviceDurationMap = {
//         "Lấy Nhân Mụn Chuẩn Y Khoa": 45, // Assuming 45 minutes
//         "Exo Booster": 30, // Assuming 30 minutes
//         // Add more services as needed
//       };
  
//       // Map services data with enhanced duration handling
//       let services = [];
//       if (bookingData.services && Array.isArray(bookingData.services)) {
//         services = bookingData.services.map((service, index) => {
//           const duration = service.duration != null ? Number(service.duration) : (service.durationMinutes || serviceDurationMap[service.name] || 0);
//           const price = service.price != null ? Number(service.price) : 0;
//           console.log(`Service ${index + 1}: name=${service.name}, duration=${duration}, price=${price}`);
//           return {
//             id: service.id || index + 1,
//             name: service.name || `Service #${index + 1}`,
//             duration: service.duration,
//             price: service.price,
//           };
//         });
//       } else if (bookingData.serviceNames && Array.isArray(bookingData.serviceNames)) {
//         services = bookingData.serviceNames.map((name, index) => {
//           const duration = bookingData.durations && Array.isArray(bookingData.durations) && bookingData.durations[index] != null
//             ? Number(bookingData.durations[index])
//             : (bookingData.serviceDurations && Array.isArray(bookingData.serviceDurations) && bookingData.serviceDurations[index] != null
//               ? Number(bookingData.serviceDurations[index])
//               : (serviceDurationMap[name] || 0)); // Use the duration map as a fallback
//           const price = bookingData.servicePrices && Array.isArray(bookingData.servicePrices) && bookingData.servicePrices[index] != null
//             ? Number(bookingData.servicePrices[index])
//             : (bookingData.totalPrice / (bookingData.serviceNames.length || 1) || 0);
//           console.log(`Service ${index + 1} (fallback): name=${name}, duration=${duration}, price=${price}`);
//           return {
//             id: index + 1,
//             name,
//             duration,
//             price,
//           };
//         });
//       } else {
//         console.warn("No services or serviceNames found in bookingData:", JSON.stringify(bookingData, null, 2));
//         services = [];
//       }
  
//       // Log services array for debugging
//       console.log("Mapped services array:", services);
  
//       // Find specialist based on specialistId from fetched specialists list
//       const specialistId = bookingData.specialistId || booking.specialistId || null;
//       const specialistFromList = specialists.find((spec) => spec.userId === specialistId);
  
//       const specialist = specialistFromList || {
//         name: bookingData.specialistName || "Not assigned",
//         userId: specialistId || 0,
//         specialization: bookingData.specialization || "Skin Therapist",
//       };
  
//       console.log("Specialist ID from booking:", specialistId);
//       console.log("Found specialist from list:", specialistFromList);
  
//       // Calculate totalDuration with validation
//       const totalDuration = services.reduce((sum, service) => {
//         const duration = Number.isFinite(Number(service.duration)) ? Number(service.duration) : 0;
//         console.log(`Adding duration: ${duration} (from service ${service.name})`);
//         return sum + duration;
//       }, 0);
  
//       console.log("Calculated totalDuration:", totalDuration);
  
//       return {
//         ...booking,
//         services,
//         specialist,
//         totalDuration,
//         totalPrice: bookingData.totalPrice != null ? Number(bookingData.totalPrice) : booking.totalPrice || 0,
//       };
//     } catch (error) {
//       console.error("Error fetching booking details:", error);
//       setErrorPopup("Failed to fetch booking details. Please try again.");
//       return null;
//     }
//   };

//   const handleViewDetails = async (booking) => {
//     setSelectedBooking(booking);
//     const details = await fetchBookingDetails(booking.bookingId);
//     if (details) {
//       setBookingDetails(details);
//       setIsPopupOpen(true);
//     }
//   };

//   const closePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedBooking(null);
//     setBookingDetails(null);
//   };

//   const closeErrorPopup = () => setErrorPopup("");

//   const handlePayment = async () => {
//     try {
//       setIsPaying(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setErrorPopup("No token found. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }

//       if (!selectedBooking || !bookingDetails) {
//         setErrorPopup("No booking selected for payment.");
//         return;
//       }

//       if (!selectedBooking.checkInTime) {
//         setErrorPopup("Please check-in before payment.");
//         return;
//       }

//       const amount = Math.round(selectedBooking.totalPrice);
//       const orderInfo = `Booking-${selectedBooking.bookingId}`;

//       const paymentData = { amount, orderInfo };

//       console.log("Payment data to be sent:", paymentData);

//       const response = await axios.post(
//         "https://f23c-118-69-182-149.ngrok-free.app/api/v1/vnpay/create-payment",
//         paymentData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Payment response:", response.data);

//       if (response.data && response.data.code === 0 && response.data.result) {
//         localStorage.setItem("lastPaidBookingId", selectedBooking.bookingId);
//         window.location.href = response.data.result;
//       } else {
//         setErrorPopup("Payment URL not received from server or payment creation failed.");
//       }
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//       setErrorPopup(error.response?.data.message || "Failed to initiate payment. Please try again.");
//     } finally {
//       setIsPaying(false);
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-amber-100 text-amber-800";
//       case "CONFIRMED":
//         return "bg-blue-100 text-blue-800";
//       case "IN_PROGRESS":
//         return "bg-emerald-100 text-emerald-800";
//       case "COMPLETED":
//         return "bg-teal-100 text-teal-800";
//       case "CANCELLED":
//         return "bg-rose-100 text-rose-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPaymentBadgeClass = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-amber-100 text-amber-800";
//       case "SUCCESS":
//         return "bg-emerald-100 text-emerald-800";
//       case "FAILED":
//         return "bg-rose-100 text-rose-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A");
//   const formatTime = (timeString) => (timeString ? timeString : "N/A");

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 mx-auto text-rose-600 animate-spin" />
//           <p className="mt-4 text-lg font-medium text-gray-700">Loading your bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <nav className="py-4 mb-4">
//           <ol className="flex items-center space-x-2 text-sm">
//             <li>
//               <Link to="/" className="text-gray-600 hover:text-rose-600 flex items-center">
//                 <Home className="w-4 h-4 mr-1" /> Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/services" className="text-gray-600 hover:text-rose-600 flex items-center">
//                 <ChevronRight className="w-4 h-4 mr-1" /> Services
//               </Link>
//             </li>
//             <li className="text-gray-400">
//               <ChevronRight className="w-3 h-3" />
//             </li>
//             <li className="text-rose-600 font-medium">My Bookings</li>
//           </ol>
//         </nav>

//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
//           <p className="text-gray-600">View and manage all your service appointments</p>
//         </div>

//         {confirmedBooking && (
//           <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
//             <div className="flex items-center mb-4">
//               <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//               <h2 className="text-xl font-semibold text-gray-900">Booking Confirmed</h2>
//             </div>
//             <div className="bg-green-50 rounded-lg p-4 mb-4">
//               <div className="flex items-start mb-2">
//                 <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Booking Date</p>
//                   <p className="font-medium text-gray-800">{formatDate(confirmedBooking.bookingDate)}</p>
//                 </div>
//               </div>
//               <div className="flex items-start mb-2">
//                 <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Start Time</p>
//                   <p className="font-medium text-gray-800">{formatTime(confirmedBooking.startTime)}</p>
//                 </div>
//               </div>
//               <ul className="divide-y divide-green-100">
//                 {confirmedBooking.services.map((service) => (
//                   <li key={service.serviceId} className="py-3 flex justify-between">
//                     <div>
//                       <p className="font-medium text-gray-800">{service.name}</p>
//                       <p className="text-sm text-gray-600">{service.duration} minutes</p>
//                     </div>
//                     <p className="font-semibold text-green-600">${service.price.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-3 pt-3 border-t border-green-100 flex justify-between">
//                 <p className="font-medium text-gray-800">Total</p>
//                 <p className="font-semibold text-green-600">${confirmedBooking.totalPrice.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {selectedServices.length > 0 && (
//           <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
//             <div className="flex items-center mb-4">
//               <Package className="w-5 h-5 text-rose-600 mr-2" />
//               <h2 className="text-xl font-semibold text-gray-900">Selected Services</h2>
//             </div>
//             <div className="bg-rose-50 rounded-lg p-4 mb-4">
//               <ul className="divide-y divide-rose-100">
//                 {selectedServices.map((service) => (
//                   <li key={service.serviceId} className="py-3 flex justify-between">
//                     <div>
//                       <p className="font-medium text-gray-800">{service.name}</p>
//                       <p className="text-sm text-gray-600">{service.duration} minutes</p>
//                     </div>
//                     <p className="font-semibold text-rose-600">${service.price.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-3 pt-3 border-t border-rose-100 flex justify-between">
//                 <p className="font-medium text-gray-800">Total</p>
//                 <p className="font-semibold text-rose-600">
//                   ${selectedServices.reduce((sum, service) => sum + service.price, 0).toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <Calendar className="w-4 h-4 inline mr-1" /> Booking Date
//                 </label>
//                 <input
//                   type="date"
//                   value={bookingDate}
//                   onChange={(e) => setBookingDate(e.target.value)}
//                   min={new Date().toISOString().split("T")[0]}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <Clock className="w-4 h-4 inline mr-1" /> Start Time
//                 </label>
//                 <input
//                   type="time"
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                   min="08:00"
//                   max="20:00"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <User className="w-4 h-4 inline mr-1" /> Specialist (Optional)
//                 </label>
//                 <select
//                   value={selectedSpecialist}
//                   onChange={(e) => setSelectedSpecialist(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 >
//                   <option value="">Auto-assign</option>
//                   {specialists.map((specialist) => (
//                     <option key={specialist.userId} value={specialist.userId}>
//                       {specialist.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <button
//               onClick={handleConfirmBooking}
//               disabled={isBooking}
//               className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
//                 isBooking ? "bg-gray-400 text-white cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
//               }`}
//             >
//               {isBooking ? (
//                 <>
//                   <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
//                   Booking in progress...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5 mr-2" />
//                   Confirm Booking
//                 </>
//               )}
//             </button>
//           </div>
//         )}

//         <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
//           <div className="flex items-center mb-4">
//             <Calendar className="w-5 h-5 text-rose-600 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-900">Filter by Date</h2>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-grow">
//               <input
//                 type="date"
//                 id="searchDate"
//                 value={searchDate}
//                 onChange={(e) => setSearchDate(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//               />
//             </div>
//             {searchDate && (
//               <button
//                 onClick={() => setSearchDate("")}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
//               >
//                 <XCircle className="w-4 h-4 mr-2" /> Clear Filter
//               </button>
//             )}
//           </div>
//         </div>

//         {filteredBookings.length === 0 && selectedServices.length === 0 && !confirmedBooking ? (
//           <div className="bg-white rounded-xl shadow-md p-8 text-center">
//             <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
//             <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
//             <Link
//               to="/services"
//               className="inline-flex items-center px-5 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
//             >
//               Book a service now <ArrowRight className="ml-2 w-4 h-4" />
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredBookings.map((booking, index) => {
//               const displayNumber = filteredBookings.length - index;
//               return (
//                 <div
//                   key={booking.bookingId}
//                   className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow"
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                     <div className="flex-grow">
//                       <div className="flex items-center mb-4">
//                         <h3 className="text-xl font-semibold text-gray-900 mr-3">Booking #{displayNumber}</h3>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
//                             booking.status
//                           )}`}
//                         >
//                           {booking.status}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-3">
//                           <div className="flex items-start">
//                             <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                             <div>
//                               <p className="text-sm text-gray-500">Date</p>
//                               <p className="font-medium text-gray-800">{formatDate(booking.bookingDate)}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-start">
//                             <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                             <div>
//                               <p className="text-sm text-gray-500">Time slot</p>
//                               <p className="font-medium text-gray-800">{formatTime(booking.timeSlot)}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-start">
//                             <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                             <div>
//                               <p className="text-sm text-gray-500">Total Price</p>
//                               <p className="font-medium text-gray-800">${booking.totalPrice || "N/A"}</p>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="space-y-3">
//                           <div>
//                             <p className="text-sm text-gray-500">Payment Status</p>
//                             <span
//                               className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
//                                 booking.paymentStatus
//                               )}`}
//                             >
//                               {booking.paymentStatus}
//                             </span>
//                           </div>
//                           {booking.checkInTime && (
//                             <div>
//                               <p className="text-sm text-gray-500">Check-in Time</p>
//                               <p className="font-medium text-gray-800">{new Date(booking.checkInTime).toLocaleString()}</p>
//                             </div>
//                           )}
//                           {booking.checkOutTime && (
//                             <div>
//                               <p className="text-sm text-gray-500">Check-out Time</p>
//                               <p className="font-medium text-gray-800">{new Date(booking.checkOutTime).toLocaleString()}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex flex-col gap-3 min-w-[140px]">
//                       {booking.bookingId !== 1 && booking.status === "PENDING" && (
//                         <button
//                           onClick={() => handleCancelBooking(booking.bookingId)}
//                           className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200"
//                         >
//                           <XCircle className="w-4 h-4 mr-2" /> Cancel
//                         </button>
//                       )}
//                       {booking.bookingId !== 1 && booking.status === "CONFIRMED" && !booking.checkInTime && (
//                         <button
//                           onClick={() => handleCheckIn(booking.bookingId)}
//                           className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
//                         >
//                           <CheckCircle className="w-4 h-4 mr-2" /> Check-in
//                         </button>
//                       )}
//                       {booking.bookingId !== 1 && booking.status === "IN_PROGRESS" && !booking.checkOutTime && (
//                         <button
//                           onClick={() => handleCheckOut(booking.bookingId)}
//                           className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                           <CheckCircle className="w-4 h-4 mr-2" /> Check-out
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleViewDetails(booking)}
//                         className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                       >
//                         <Eye className="w-4 h-4 mr-2" /> View Details
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {errorPopup && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
//             <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
//               <div className="flex flex-col items-center">
//                 <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
//                 <p className="text-lg font-medium text-gray-800 mb-6 text-center">{errorPopup}</p>
//                 <button
//                   onClick={closeErrorPopup}
//                   className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {isPopupOpen && selectedBooking && bookingDetails && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000] p-4">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
//               <div className="w-full md:w-2/3 p-6 overflow-y-auto">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
//                   <button onClick={closePopup} className="text-gray-500 hover:text-rose-600">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-3 mb-6">
//                   {filteredBookings.findIndex((b) => b.bookingId === selectedBooking.bookingId) !== -1 && (
//                     <span className="text-lg font-semibold text-gray-800">
//                       Booking #{filteredBookings.length - filteredBookings.findIndex((b) => b.bookingId === selectedBooking.bookingId)}
//                     </span>
//                   )}
//                   <span
//                     className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
//                       selectedBooking.status
//                     )}`}
//                   >
//                     {selectedBooking.status}
//                   </span>
//                 </div>
//                 <div className="bg-rose-50 rounded-xl p-5 mb-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="flex items-start">
//                       <Calendar className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-600">Date</p>
//                         <p className="font-medium text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <Clock className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-600">Time</p>
//                         <p className="font-medium text-gray-900">{formatTime(selectedBooking.timeSlot)}</p>
//                       </div>
//                     </div>
//                     {bookingDetails.specialist && (
//                       <div className="flex items-start">
//                         <User className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                         <div>
//                           <p className="text-sm text-gray-600">Specialist</p>
//                           <p className="font-medium text-gray-900">{bookingDetails.specialist.name || "Not assigned"}</p>
//                           <p className="text-xs text-gray-500">{bookingDetails.specialist.specialization}</p>
//                         </div>
//                       </div>
//                     )}
//                     <div className="flex items-start">
//                       <Timer className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-600">Total Duration</p>
//                         <p className="font-medium text-gray-900">{bookingDetails.totalDuration} minutes</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                     <Package className="w-5 h-5 text-rose-600 mr-2" /> Services
//                   </h3>
//                   <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//                     <ul className="divide-y divide-gray-200">
//                       {bookingDetails.services.map((service, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-50">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium text-gray-900">{service.name || `Service #${index + 1}`}</h4>
//                               <p className="text-sm text-gray-600 flex items-center mt-1">
//                                 <Timer className="w-4 h-4 mr-1 text-gray-400" /> {service.duration || 0} minutes
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-semibold text-rose-600">${service.price ? service.price.toFixed(2) : "0.00"}</p>
//                             </div>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
//                       <p className="font-medium text-gray-800">Total</p>
//                       <p className="font-bold text-rose-600 text-lg">${selectedBooking.totalPrice.toFixed(2)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
//                 {selectedBooking.status !== "CANCELLED" && (
//                   <>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                       <CreditCardIcon className="w-5 h-5 text-rose-600 mr-2" /> Payment
//                     </h3>
//                     <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-gray-600">Status</p>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
//                             bookingDetails.paymentStatus
//                           )}`}
//                         >
//                           {bookingDetails.paymentStatus}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-gray-600">Method</p>
//                         <p className="font-medium text-gray-800">VNPay</p>
//                       </div>
//                       <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                         <p className="font-medium text-gray-800">Total</p>
//                         <p className="font-bold text-rose-600">${selectedBooking.totalPrice.toFixed(2)}</p>
//                       </div>
//                     </div>
//                     {selectedBooking.bookingId !== 1 &&
//                       bookingDetails.paymentStatus === "PENDING" &&
//                       selectedBooking.status !== "CANCELLED" && (
//                         <button
//                           onClick={handlePayment}
//                           disabled={isPaying}
//                           className={`w-full flex items-center justify-center py-3 rounded-lg font-medium transition-colors ${
//                             isPaying ? "bg-gray-400 text-white cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
//                           } mb-4`}
//                         >
//                           {isPaying ? (
//                             <>
//                               <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Processing...
//                             </>
//                           ) : (
//                             <>
//                               <DollarSign className="w-5 h-5 mr-2" /> Pay Now
//                             </>
//                           )}
//                         </button>
//                       )}
//                   </>
//                 )}
//                 {selectedBooking.status === "CANCELLED" && (
//                   <div className="bg-rose-50 rounded-xl p-4 mb-6">
//                     <div className="flex items-center">
//                       <XCircle className="w-5 h-5 text-rose-600 mr-2" />
//                       <h3 className="text-lg font-semibold text-rose-700">Booking Cancelled</h3>
//                     </div>
//                     <p className="text-gray-600 mt-2">This booking has been cancelled and no payment is required.</p>
//                   </div>
//                 )}
//                 <div className="space-y-3 mt-auto">
//                   {selectedBooking.bookingId !== 1 && selectedBooking.status === "PENDING" && (
//                     <button
//                       onClick={() => {
//                         handleCancelBooking(selectedBooking.bookingId);
//                         closePopup();
//                       }}
//                       className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200"
//                     >
//                       <XCircle className="w-4 h-4 mr-2" /> Cancel Booking
//                     </button>
//                   )}
//                   {selectedBooking.bookingId !== 1 && selectedBooking.status === "CONFIRMED" && !selectedBooking.checkInTime && (
//                     <button
//                       onClick={() => {
//                         handleCheckIn(selectedBooking.bookingId);
//                         closePopup();
//                       }}
//                       className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-2" /> Check-in
//                     </button>
//                   )}
//                   {selectedBooking.bookingId !== 1 && selectedBooking.status === "IN_PROGRESS" && !selectedBooking.checkOutTime && (
//                     <button
//                       onClick={() => {
//                         handleCheckOut(selectedBooking.bookingId);
//                         closePopup();
//                       }}
//                       className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-2" /> Check-out
//                     </button>
//                   )}
//                   <button
//                     onClick={closePopup}
//                     className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyBooking;


"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Home,
  Package,
  RefreshCw,
  User,
  Eye,
  DollarSign,
  Timer,
  X,
  CreditCardIcon,
  ChevronRight,
} from "lucide-react";

const MyBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorPopup, setErrorPopup] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [specialists, setSpecialists] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // Fetch bookings, selected services, and specialists
  useEffect(() => {
    const storedServiceIds = localStorage.getItem("selectedServiceIdsForBooking");
    console.log("Retrieved selectedServiceIds from localStorage:", storedServiceIds);

    const storedServices = localStorage.getItem("selectedServicesForBooking");
    console.log("Retrieved selectedServices from localStorage:", storedServices);
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices);
        } else {
          setSelectedServices([]);
        }
      } catch (error) {
        console.error("Error parsing selectedServices from localStorage:", error);
        setSelectedServices([]);
      }
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          "https://f23c-118-69-182-149.ngrok-free.app/api/bookings/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch bookings response:", response.data);
        if (Array.isArray(response.data)) {
          const sortedBookings = [...response.data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.bookingDate);
            const dateB = new Date(b.createdAt || b.bookingDate);
            return dateB - dateA;
          });
          setBookings(sortedBookings);

          if (sortedBookings.length === 0) {
            const defaultBooking = {
              bookingId: 1,
              bookingDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              timeSlot: "14:00-15:00",
              status: "COMPLETED",
              paymentStatus: "SUCCESS",
              totalPrice: 50.0,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            };
            setBookings([defaultBooking]);
          }
        } else {
          throw new Error("Invalid response format: Expected an array of bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setErrorPopup("Unauthorized: Please login again.");
            setTimeout(() => navigate("/login"), 2000);
          } else if (error.response.status === 403) {
            setErrorPopup("You do not have permission to access your bookings.");
          } else if (error.response.status === 404) {
            setErrorPopup("No bookings found.");
          } else {
            setErrorPopup(error.response.data.message || "Failed to load bookings. Please try again.");
          }
        } else if (error.request) {
          setErrorPopup("Unable to connect to server. CORS issue or server error. Please try again.");
        } else {
          setErrorPopup(error.message || "Failed to load bookings. Please try again.");
        }
      }
    };

    const fetchSpecialists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          "https://f23c-118-69-182-149.ngrok-free.app/api/users/specialists/active",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch specialists response:", response.data);
        if (Array.isArray(response.data)) {
          setSpecialists(response.data);
        } else {
          throw new Error("Invalid response format: Expected an array of specialists");
        }
      } catch (error) {
        console.error("Error fetching specialists:", error);
        setErrorPopup("Failed to load specialists. Please try again.");
        setSpecialists([]);
      }
    };

    Promise.all([fetchBookings(), fetchSpecialists()]).finally(() => setLoading(false));
  }, [navigate, refresh]);

  // Handle payment redirect
  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    const vnp_ResponseCode = params["vnp_ResponseCode"];
    const vnp_TxnRef = params["vnp_TxnRef"];
    const lastPaidBookingId = localStorage.getItem("lastPaidBookingId");

    if (vnp_ResponseCode === "00" && (vnp_TxnRef || lastPaidBookingId)) {
      const bookingId = lastPaidBookingId
        ? parseInt(lastPaidBookingId)
        : parseInt(vnp_TxnRef.split("-")[1]);
      const booking = bookings.find((b) => b.bookingId === bookingId);
      if (booking) {
        setSelectedBooking(booking);
        fetchBookingDetails(bookingId).then((details) => {
          if (details) {
            setBookingDetails({ ...details, paymentStatus: "SUCCESS" });
            setIsPopupOpen(true);
            localStorage.removeItem("lastPaidBookingId");
          }
        });
      }
    } else if (vnp_ResponseCode && vnp_ResponseCode !== "00") {
      setErrorPopup("Payment failed. Please try again.");
    }
  }, [searchParams, bookings]);

  useEffect(() => {
    setRefresh((prev) => !prev);
  }, [location]);

  const filteredBookings = searchDate
    ? bookings.filter((booking) => {
        const bookingDateFormatted = new Date(booking.bookingDate).toISOString().split("T")[0];
        return bookingDateFormatted === searchDate;
      })
    : bookings;

  const checkBookingConflict = (bookingDate, startTime, services) => {
    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
    const startDateTime = new Date(`${bookingDate}T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000);
    const timeSlot = `${startTime}-${endDateTime.toTimeString().slice(0, 5)}`;

    return bookings.some((booking) => {
      if (booking.status === "CANCELLED" || booking.bookingId === 1) return false;
      const existingDate = new Date(booking.bookingDate).toISOString().split("T")[0];
      const existingTimeSlot = booking.timeSlot;
      return existingDate === bookingDate && existingTimeSlot === timeSlot;
    });
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate || !startTime) {
      setErrorPopup("Please select a booking date and start time.");
      return;
    }

    if (isBooking) {
      setErrorPopup("Booking in progress... Please wait.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorPopup("No token found. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (checkBookingConflict(bookingDate, startTime, selectedServices)) {
      setErrorPopup("You already have a booking at this time.");
      return;
    }

    const bookingData = {
      specialistId: selectedSpecialist ? Number(selectedSpecialist) : null,
      bookingDate,
      startTime,
      serviceIds: selectedServices.map((service) => Number(service.serviceId)),
    };

    console.log("Booking data to be sent:", bookingData);

    setIsBooking(true);
    setErrorPopup("");

    try {
      const response = await axios.post(
        "https://f23c-118-69-182-149.ngrok-free.app/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking response:", response.data);

      setConfirmedBooking({
        services: [...selectedServices],
        bookingDate,
        startTime,
        totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0),
      });

      setSelectedServices([]);
      localStorage.removeItem("selectedServicesForBooking");
      setBookingDate("");
      setStartTime("");
      setSelectedSpecialist("");
      setRefresh((prev) => !prev);
      setErrorPopup("");
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error.response?.data.message || "Failed to create booking. Please try again.";
      const errorCode = error.response?.data.errorCode;

      switch (errorCode) {
        case "UNAUTHENTICATED":
          setErrorPopup("Unauthorized: Please login again.");
          setTimeout(() => navigate("/login"), 2000);
          break;
        case "SERVICE_NOT_EXISTED":
          setErrorPopup("One or more selected services do not exist.");
          break;
        case "BOOKING_SERVICE_LIMIT_EXCEEDED":
          setErrorPopup("Too many services selected. Maximum limit exceeded.");
          break;
        case "TIME_SLOT_OUTSIDE_WORKING_HOURS":
          setErrorPopup("Selected time is outside working hours (8:00 - 20:00).");
          break;
        case "BOOKING_DATE_IN_PAST":
          setErrorPopup("Booking date cannot be in the past.");
          break;
        case "BOOKING_DATE_TOO_FAR_IN_FUTURE":
          setErrorPopup("Booking date is too far in the future.");
          break;
        case "BOOKING_TIME_CONFLICT":
          setErrorPopup("You already have a booking at this time.");
          break;
        case "SKIN_THERAPIST_NOT_EXISTED":
          setErrorPopup("Selected specialist does not exist.");
          break;
        case "SPECIALIST_NOT_ACTIVE":
          setErrorPopup("Selected specialist is not active.");
          break;
        case "TIME_SLOT_UNAVAILABLE":
          setErrorPopup("Selected specialist is not available at this time.");
          break;
        default:
          setErrorPopup(errorMessage);
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const booking = bookings.find((b) => b.bookingId === bookingId);
      if (!booking) {
        setErrorPopup("Booking not found.");
        return;
      }

      if (bookingId === 1) {
        setErrorPopup("Cannot cancel the default booking.");
        return;
      }

      const [startTime] = booking.timeSlot.split("-");
      const bookingStartDateTime = new Date(`${booking.bookingDate}T${startTime}:00`);
      const currentDateTime = new Date();
      const timeDifference = (bookingStartDateTime - currentDateTime) / (1000 * 60 * 60);

      if (timeDifference < 24) {
        setErrorPopup("Cannot cancel booking less than 24 hours before start time.");
        return;
      }

      await axios.post(
        `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error canceling booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorPopup("Unauthorized: Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 403) {
          setErrorPopup("You do not have permission to cancel this booking.");
        } else {
          setErrorPopup(error.response.data.message || "Failed to cancel booking. Please try again.");
        }
      } else {
        setErrorPopup("Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleCheckIn = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (bookingId === 1) {
        setErrorPopup("Cannot check-in the default booking.");
        return;
      }

      await axios.post(
        `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.bookingId === bookingId ? { ...b, checkInTime: new Date().toISOString(), status: "IN_PROGRESS" } : b
        )
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error checking in booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorPopup("Unauthorized: Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setErrorPopup(error.response.data.message || "Failed to check-in booking. Please try again.");
        }
      } else {
        setErrorPopup("Failed to check-in booking. Please try again.");
      }
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (bookingId === 1) {
        setErrorPopup("Cannot check-out the default booking.");
        return;
      }

      await axios.post(
        `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.bookingId === bookingId ? { ...b, checkOutTime: new Date().toISOString(), status: "COMPLETED" } : b
        )
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error checking out booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorPopup("Unauthorized: Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setErrorPopup(error.response.data.message || "Failed to check-out booking. Please try again.");
        }
      } else {
        setErrorPopup("Failed to check-out booking. Please try again.");
      }
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return null;
      }
  
      const booking = bookings.find((b) => b.bookingId === bookingId);
      if (!booking) {
        setErrorPopup("Booking not found.");
        return null;
      }
  
      // Mock data for default booking
      if (bookingId === 1) {
        return {
          ...booking,
          services: [{ id: 1, name: "Default Facial", duration: 60, price: 50.0 }],
          specialist: { name: "Default Specialist", userId: 999, specialization: "Skin Therapist" },
          totalDuration: 60,
          totalPrice: 50.0,
        };
      }
  
      // Fetch details from API
      const response = await axios.get(
        `https://f23c-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
  
      const bookingData = Array.isArray(response.data) ? response.data[0] : response.data;
      console.log("Full booking data from API:", JSON.stringify(bookingData, null, 2));
  
      // Get stored services from localStorage to match duration
      const storedServices = localStorage.getItem("selectedServicesForBooking");
      let storedServicesMap = new Map();
      if (storedServices) {
        try {
          const parsedServices = JSON.parse(storedServices);
          if (Array.isArray(parsedServices)) {
            parsedServices.forEach((service) => {
              storedServicesMap.set(service.name, service.duration);
            });
          }
        } catch (error) {
          console.error("Error parsing stored services:", error);
        }
      }
  
      // Map services data with duration from API or stored services
      let services = [];
      if (bookingData.services && Array.isArray(bookingData.services)) {
        services = bookingData.services.map((service, index) => {
          const durationFromAPI = service.duration != null ? Number(service.duration) : null;
          const durationFromStored = storedServicesMap.get(service.name);
          const duration = durationFromAPI ?? durationFromStored ?? 0; // Prioritize API, then stored, then default to 0
          const price = service.price != null ? Number(service.price) : 0;
          console.log(`Service ${index + 1}: name=${service.name}, duration=${duration}, price=${price}`);
          return {
            id: service.id || index + 1,
            name: service.name || `Service #${index + 1}`,
            duration,
            price,
          };
        });
      } else if (bookingData.serviceNames && Array.isArray(bookingData.serviceNames)) {
        services = bookingData.serviceNames.map((name, index) => {
          const durationFromAPI =
            bookingData.durations && Array.isArray(bookingData.durations) && bookingData.durations[index] != null
              ? Number(bookingData.durations[index])
              : null;
          const durationFromStored = storedServicesMap.get(name);
          const duration = durationFromAPI ?? durationFromStored ?? 0; // Prioritize API, then stored, then default to 0
          const price =
            bookingData.servicePrices && Array.isArray(bookingData.servicePrices) && bookingData.servicePrices[index] != null
              ? Number(bookingData.servicePrices[index])
              : (bookingData.totalPrice / (bookingData.serviceNames.length || 1) || 0);
          console.log(`Service ${index + 1} (fallback): name=${name}, duration=${duration}, price=${price}`);
          return {
            id: index + 1,
            name,
            duration,
            price,
          };
        });
      } else {
        console.warn("No services or serviceNames found in bookingData:", JSON.stringify(bookingData, null, 2));
        services = [];
      }
  
      // Log services array for debugging
      console.log("Mapped services array:", services);
  
      // Find specialist based on specialistId from fetched specialists list
      const specialistId = bookingData.specialistId || booking.specialistId || null;
      const specialistFromList = specialists.find((spec) => spec.userId === specialistId);
  
      const specialist = specialistFromList || {
        name: bookingData.specialistName || "Not assigned",
        userId: specialistId || 0,
        specialization: bookingData.specialization || "Skin Therapist",
      };
  
      console.log("Specialist ID from booking:", specialistId);
      console.log("Found specialist from list:", specialistFromList);
  
      // Calculate totalDuration with validation
      const totalDuration = services.reduce((sum, service) => {
        const duration = Number.isFinite(Number(service.duration)) ? Number(service.duration) : 0;
        console.log(`Adding duration: ${duration} (from service ${service.name})`);
        return sum + duration;
      }, 0);
  
      console.log("Calculated totalDuration:", totalDuration);
  
      return {
        ...booking,
        services,
        specialist,
        totalDuration,
        totalPrice: bookingData.totalPrice != null ? Number(bookingData.totalPrice) : booking.totalPrice || 0,
      };
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setErrorPopup("Failed to fetch booking details. Please try again.");
      return null;
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    const details = await fetchBookingDetails(booking.bookingId);
    if (details) {
      setBookingDetails(details);
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBooking(null);
    setBookingDetails(null);
  };

  const closeErrorPopup = () => setErrorPopup("");

  const handlePayment = async () => {
    try {
      setIsPaying(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (!selectedBooking || !bookingDetails) {
        setErrorPopup("No booking selected for payment.");
        return;
      }

      if (!selectedBooking.checkInTime) {
        setErrorPopup("Please check-in before payment.");
        return;
      }

      const amount = Math.round(selectedBooking.totalPrice);
      const orderInfo = `Booking-${selectedBooking.bookingId}`;

      const paymentData = { amount, orderInfo };

      console.log("Payment data to be sent:", paymentData);

      const response = await axios.post(
        "https://f23c-118-69-182-149.ngrok-free.app/api/v1/vnpay/create-payment",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment response:", response.data);

      if (response.data && response.data.code === 0 && response.data.result) {
        localStorage.setItem("lastPaidBookingId", selectedBooking.bookingId);
        window.location.href = response.data.result;
      } else {
        setErrorPopup("Payment URL not received from server or payment creation failed.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setErrorPopup(error.response?.data.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-emerald-100 text-emerald-800";
      case "COMPLETED":
        return "bg-teal-100 text-teal-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800";
      case "FAILED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A");
  const formatTime = (timeString) => (timeString ? timeString : "N/A");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-rose-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="py-4 mb-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-rose-600 flex items-center">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-gray-600 hover:text-rose-600 flex items-center">
                <ChevronRight className="w-4 h-4 mr-1" /> Services
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-3 h-3" />
            </li>
            <li className="text-rose-600 font-medium">My Bookings</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your service appointments</p>
        </div>

        {confirmedBooking && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Booking Confirmed</h2>
            </div>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-start mb-2">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Booking Date</p>
                  <p className="font-medium text-gray-800">{formatDate(confirmedBooking.bookingDate)}</p>
                </div>
              </div>
              <div className="flex items-start mb-2">
                <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium text-gray-800">{formatTime(confirmedBooking.startTime)}</p>
                </div>
              </div>
              <ul className="divide-y divide-green-100">
                {confirmedBooking.services.map((service) => (
                  <li key={service.serviceId} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.duration} minutes</p>
                    </div>
                    <p className="font-semibold text-green-600">${service.price.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-green-100 flex justify-between">
                <p className="font-medium text-gray-800">Total</p>
                <p className="font-semibold text-green-600">${confirmedBooking.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {selectedServices.length > 0 && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Package className="w-5 h-5 text-rose-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Selected Services</h2>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 mb-4">
              <ul className="divide-y divide-rose-100">
                {selectedServices.map((service) => (
                  <li key={service.serviceId} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.duration} minutes</p>
                    </div>
                    <p className="font-semibold text-rose-600">${service.price.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-rose-100 flex justify-between">
                <p className="font-medium text-gray-800">Total</p>
                <p className="font-semibold text-rose-600">
                  ${selectedServices.reduce((sum, service) => sum + service.price, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" /> Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" /> Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  min="08:00"
                  max="20:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" /> Specialist (Optional)
                </label>
                <select
                  value={selectedSpecialist}
                  onChange={(e) => setSelectedSpecialist(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Auto-assign</option>
                  {specialists.map((specialist) => (
                    <option key={specialist.userId} value={specialist.userId}>
                      {specialist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={isBooking}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                isBooking ? "bg-gray-400 text-white cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
            >
              {isBooking ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Booking in progress...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        )}

        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-rose-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter by Date</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="date"
                id="searchDate"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            {searchDate && (
              <button
                onClick={() => setSearchDate("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" /> Clear Filter
              </button>
            )}
          </div>
        </div>

        {filteredBookings.length === 0 && selectedServices.length === 0 && !confirmedBooking ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
            <Link
              to="/services"
              className="inline-flex items-center px-5 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Book a service now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => {
              const displayNumber = filteredBookings.length - index;
              return (
                <div
                  key={booking.bookingId}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">Booking #{displayNumber}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium text-gray-800">{formatDate(booking.bookingDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Time slot</p>
                              <p className="font-medium text-gray-800">{formatTime(booking.timeSlot)}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Total Price</p>
                              <p className="font-medium text-gray-800">${booking.totalPrice || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Payment Status</p>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                                booking.paymentStatus
                              )}`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                          {booking.checkInTime && (
                            <div>
                              <p className="text-sm text-gray-500">Check-in Time</p>
                              <p className="font-medium text-gray-800">{new Date(booking.checkInTime).toLocaleString()}</p>
                            </div>
                          )}
                          {booking.checkOutTime && (
                            <div>
                              <p className="text-sm text-gray-500">Check-out Time</p>
                              <p className="font-medium text-gray-800">{new Date(booking.checkOutTime).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[140px]">
                      {booking.bookingId !== 1 && booking.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Cancel
                        </button>
                      )}
                      {booking.bookingId !== 1 && booking.status === "CONFIRMED" && !booking.checkInTime && (
                        <button
                          onClick={() => handleCheckIn(booking.bookingId)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Check-in
                        </button>
                      )}
                      {booking.bookingId !== 1 && booking.status === "IN_PROGRESS" && !booking.checkOutTime && (
                        <button
                          onClick={() => handleCheckOut(booking.bookingId)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Check-out
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {errorPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              <div className="flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-lg font-medium text-gray-800 mb-6 text-center">{errorPopup}</p>
                <button
                  onClick={closeErrorPopup}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isPopupOpen && selectedBooking && bookingDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000] p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-2/3 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  <button onClick={closePopup} className="text-gray-500 hover:text-rose-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {filteredBookings.findIndex((b) => b.bookingId === selectedBooking.bookingId) !== -1 && (
                    <span className="text-lg font-semibold text-gray-800">
                      Booking #{filteredBookings.length - filteredBookings.findIndex((b) => b.bookingId === selectedBooking.bookingId)}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="bg-rose-50 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium text-gray-900">{formatTime(selectedBooking.timeSlot)}</p>
                      </div>
                    </div>
                    {bookingDetails.specialist && (
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Specialist</p>
                          <p className="font-medium text-gray-900">{bookingDetails.specialist.name || "Not assigned"}</p>
                          <p className="text-xs text-gray-500">{bookingDetails.specialist.specialization}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Timer className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Total Duration</p>
                        <p className="font-medium text-gray-900">{bookingDetails.totalDuration} minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 text-rose-600 mr-2" /> Services
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {bookingDetails.services.map((service, index) => (
                        <li key={index} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name || `Service #${index + 1}`}</h4>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Timer className="w-4 h-4 mr-1 text-gray-400" /> {service.duration || 0} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-rose-600">${service.price ? service.price.toFixed(2) : "0.00"}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
                      <p className="font-medium text-gray-800">Total</p>
                      <p className="font-bold text-rose-600 text-lg">${selectedBooking.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
                {selectedBooking.status !== "CANCELLED" && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCardIcon className="w-5 h-5 text-rose-600 mr-2" /> Payment
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                            bookingDetails.paymentStatus
                          )}`}
                        >
                          {bookingDetails.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">Method</p>
                        <p className="font-medium text-gray-800">VNPay</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <p className="font-medium text-gray-800">Total</p>
                        <p className="font-bold text-rose-600">${selectedBooking.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    {selectedBooking.bookingId !== 1 &&
                      bookingDetails.paymentStatus === "PENDING" &&
                      selectedBooking.status !== "CANCELLED" && (
                        <button
                          onClick={handlePayment}
                          disabled={isPaying}
                          className={`w-full flex items-center justify-center py-3 rounded-lg font-medium transition-colors ${
                            isPaying ? "bg-gray-400 text-white cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
                          } mb-4`}
                        >
                          {isPaying ? (
                            <>
                              <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-5 h-5 mr-2" /> Pay Now
                            </>
                          )}
                        </button>
                      )}
                  </>
                )}
                {selectedBooking.status === "CANCELLED" && (
                  <div className="bg-rose-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-rose-600 mr-2" />
                      <h3 className="text-lg font-semibold text-rose-700">Booking Cancelled</h3>
                    </div>
                    <p className="text-gray-600 mt-2">This booking has been cancelled and no payment is required.</p>
                  </div>
                )}
                <div className="space-y-3 mt-auto">
                  {selectedBooking.bookingId !== 1 && selectedBooking.status === "PENDING" && (
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.bookingId);
                        closePopup();
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Cancel Booking
                    </button>
                  )}
                  {selectedBooking.bookingId !== 1 && selectedBooking.status === "CONFIRMED" && !selectedBooking.checkInTime && (
                    <button
                      onClick={() => {
                        handleCheckIn(selectedBooking.bookingId);
                        closePopup();
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Check-in
                    </button>
                  )}
                  {selectedBooking.bookingId !== 1 && selectedBooking.status === "IN_PROGRESS" && !selectedBooking.checkOutTime && (
                    <button
                      onClick={() => {
                        handleCheckOut(selectedBooking.bookingId);
                        closePopup();
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Check-out
                    </button>
                  )}
                  <button
                    onClick={closePopup}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;