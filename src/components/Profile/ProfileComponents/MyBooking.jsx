// import { useState, useEffect } from "react"
// import { Link, useNavigate, useLocation } from "react-router-dom"
// import axios from "axios"
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
// } from "lucide-react"

// const MyBooking = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [bookings, setBookings] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [refresh, setRefresh] = useState(false)
//   const [searchDate, setSearchDate] = useState("")
//   const [selectedServices, setSelectedServices] = useState([])
//   const [bookingDate, setBookingDate] = useState("")
//   const [startTime, setStartTime] = useState("")
//   const [selectedSpecialist, setSelectedSpecialist] = useState("")
//   const [specialists, setSpecialists] = useState([])
//   const [isBooking, setIsBooking] = useState(false)
//   const [confirmedBooking, setConfirmedBooking] = useState(null)
//   const [isPopupOpen, setIsPopupOpen] = useState(false)
//   const [selectedBooking, setSelectedBooking] = useState(null)
//   const [bookingDetails, setBookingDetails] = useState(null)

//   // Fetch bookings, selected services, and specialists from localStorage/API
//   useEffect(() => {
//     const storedServices = localStorage.getItem("selectedServicesForBooking")
//     console.log("Retrieved selectedServices from localStorage:", storedServices)
//     if (storedServices) {
//       try {
//         const parsedServices = JSON.parse(storedServices)
//         if (Array.isArray(parsedServices) && parsedServices.length > 0) {
//           setSelectedServices(parsedServices)
//         } else {
//           setSelectedServices([])
//         }
//       } catch (error) {
//         console.error("Error parsing selectedServices from localStorage:", error)
//         setSelectedServices([])
//       }
//     }

//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           throw new Error("No token found. Please login again.")
//         }

//         const response = await axios.get("https://b64a-118-69-182-149.ngrok-free.app/api/bookings/user", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         })

//         console.log("Fetch bookings response:", response.data)
//         if (Array.isArray(response.data)) {
//           const sortedBookings = [...response.data].sort((a, b) => {
//             const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.bookingDate)
//             const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.bookingDate)
//             return dateB - dateA
//           })
//           setBookings(sortedBookings)
//         } else {
//           throw new Error("Invalid response format: Expected an array of bookings")
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error)
//         if (error.response) {
//           if (error.response.status === 401) {
//             setError("Unauthorized: Please login again.")
//             setTimeout(() => {
//               navigate("/login")
//             }, 2000)
//           } else if (error.response.status === 403) {
//             setError("You do not have permission to access your bookings.")
//           } else if (error.response.status === 404) {
//             setError("No bookings found.")
//           } else {
//             setError(error.response.data.message || "Failed to load bookings. Please try again.")
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. CORS issue or server error. Please try again.")
//         } else {
//           setError(error.message || "Failed to load bookings. Please try again.")
//         }
//       }
//     }

//     const fetchSpecialists = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           throw new Error("No token found. Please login again.")
//         }

//         const response = await axios.get("https://b64a-118-69-182-149.ngrok-free.app/api/users/specialists/active", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         })

//         console.log("Fetch specialists response:", response.data)
//         if (Array.isArray(response.data)) {
//           setSpecialists(response.data)
//         } else {
//           throw new Error("Invalid response format: Expected an array of specialists")
//         }
//       } catch (error) {
//         console.error("Error fetching specialists:", error)
//         setError("Failed to load specialists. Please try again.")
//         setSpecialists([])
//       }
//     }

//     Promise.all([fetchBookings(), fetchSpecialists()]).finally(() => {
//       setLoading(false)
//     })
//   }, [navigate, refresh])

//   useEffect(() => {
//     setRefresh((prev) => !prev)
//   }, [location])

//   const filteredBookings = searchDate
//     ? bookings.filter((booking) => {
//         const bookingDateFormatted = new Date(booking.bookingDate).toISOString().split("T")[0]
//         return bookingDateFormatted === searchDate
//       })
//     : bookings

//   const checkBookingConflict = (bookingDate, startTime, services) => {
//     const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)
//     const startDateTime = new Date(`${bookingDate}T${startTime}:00`)
//     const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000)
//     const timeSlot = `${startTime}-${endDateTime.toTimeString().slice(0, 5)}`

//     return bookings.some((booking) => {
//       if (booking.status === "CANCELLED") return false
//       const existingDate = new Date(booking.bookingDate).toISOString().split("T")[0]
//       const existingTimeSlot = booking.timeSlot
//       return existingDate === bookingDate && existingTimeSlot === timeSlot
//     })
//   }

//   const handleConfirmBooking = async () => {
//     if (!bookingDate || !startTime) {
//       setError("Please select a booking date and start time.")
//       return
//     }

//     if (isBooking) {
//       alert("Booking in progress... Please wait.")
//       return
//     }

//     const token = localStorage.getItem("token")
//     if (!token) {
//       setError("No token found. Please login again.")
//       setTimeout(() => {
//         navigate("/login")
//       }, 2000)
//       return
//     }

//     if (checkBookingConflict(bookingDate, startTime, selectedServices)) {
//       setError("You already have a booking at this time.")
//       return
//     }

//     const bookingData = {
//       specialistId: selectedSpecialist ? Number(selectedSpecialist) : null,
//       bookingDate: bookingDate,
//       startTime: startTime,
//       serviceIds: selectedServices.map((service) => Number(service.serviceId)),
//     }

//     console.log("Booking data to be sent:", bookingData)

//     setIsBooking(true)
//     setError("")

//     try {
//       const response = await axios.post("https://b64a-118-69-182-149.ngrok-free.app/api/bookings", bookingData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "ngrok-skip-browser-warning": "true",
//           "Content-Type": "application/json",
//         },
//       })

//       console.log("Booking response:", response.data)

//       setConfirmedBooking({
//         services: [...selectedServices],
//         bookingDate,
//         startTime,
//         totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0),
//       })

//       setSelectedServices([])
//       localStorage.removeItem("selectedServicesForBooking")
//       setBookingDate("")
//       setStartTime("")
//       setSelectedSpecialist("")
//       setRefresh((prev) => !prev)
//       alert("Booking confirmed successfully!")
//     } catch (error) {
//       console.error("Error creating booking:", error)
//       if (error.response) {
//         const errorCode = error.response.data.errorCode
//         const errorMessage = error.response.data.message || "An error occurred."
//         switch (errorCode) {
//           case "UNAUTHENTICATED":
//             setError("Unauthorized: Please login again.")
//             setTimeout(() => {
//               navigate("/login")
//             }, 2000)
//             break
//           case "SERVICE_NOT_EXISTED":
//             setError("One or more selected services do not exist.")
//             break
//           case "BOOKING_SERVICE_LIMIT_EXCEEDED":
//             setError("Too many services selected. Maximum limit exceeded.")
//             break
//           case "TIME_SLOT_OUTSIDE_WORKING_HOURS":
//             setError("Selected time is outside working hours (8:00 - 20:00).")
//             break
//           case "BOOKING_DATE_IN_PAST":
//             setError("Booking date cannot be in the past.")
//             break
//           case "BOOKING_DATE_TOO_FAR_IN_FUTURE":
//             setError("Booking date is too far in the future.")
//             break
//           case "BOOKING_TIME_CONFLICT":
//             setError("You already have a booking at this time.")
//             break
//           case "SKIN_THERAPIST_NOT_EXISTED":
//             setError("Selected specialist does not exist.")
//             break
//           case "SPECIALIST_NOT_ACTIVE":
//             setError("Selected specialist is not active.")
//             break
//           case "TIME_SLOT_UNAVAILABLE":
//             setError("Selected specialist is not available at this time.")
//             break
//           default:
//             setError(errorMessage || "Failed to create booking. Please try again.")
//         }
//       } else {
//         setError("Failed to connect to server. Please try again.")
//       }
//     } finally {
//       setIsBooking(false)
//     }
//   }

//   const handleCancelBooking = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No token found. Please login again.")
//       }

//       const response = await axios.post(
//         `https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/cancel`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       console.log("Cancel booking response:", response.data)
//       setRefresh((prev) => !prev)
//     } catch (error) {
//       console.error("Error canceling booking:", error)
//       if (error.response) {
//         if (error.response.status === 401) {
//           setError("Unauthorized: Please login again.")
//           setTimeout(() => {
//             navigate("/login")
//           }, 2000)
//         } else if (error.response.status === 403) {
//           setError("You do not have permission to cancel this booking.")
//         } else {
//           setError(error.response.data.message || "Failed to cancel booking. Please try again.")
//         }
//       } else {
//         setError("Failed to cancel booking. Please try again.")
//       }
//     }
//   }

//   const handleCheckIn = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No token found. Please login again.")
//       }

//       const response = await axios.post(
//         `https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkin`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       console.log("Check-in booking response:", response.data)
//       setRefresh((prev) => !prev)
//       alert("Check-in successful!")
//     } catch (error) {
//       console.error("Error checking in booking:", error)
//       if (error.response) {
//         if (error.response.status === 401) {
//           setError("Unauthorized: Please login again.")
//           setTimeout(() => {
//             navigate("/login")
//           }, 2000)
//         } else {
//           setError(error.response.data.message || "Failed to check-in booking. Please try again.")
//         }
//       } else {
//         setError("Failed to check-in booking. Please try again.")
//       }
//     }
//   }

//   const handleCheckOut = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No token found. Please login again.")
//       }

//       const response = await axios.post(
//         `https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       console.log("Check-out booking response:", response.data)
//       setRefresh((prev) => !prev)
//       alert("Check-out successful!")
//     } catch (error) {
//       console.error("Error checking out booking:", error)
//       if (error.response) {
//         if (error.response.status === 401) {
//           setError("Unauthorized: Please login again.")
//           setTimeout(() => {
//             navigate("/login")
//           }, 2000)
//         } else {
//           setError(error.response.data.message || "Failed to check-out booking. Please try again.")
//         }
//       } else {
//         setError("Failed to check-out booking. Please try again.")
//       }
//     }
//   }

//   // Fetch booking details including services and specialist info
//   const fetchBookingDetails = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No token found. Please login again.")
//       }

//       // Simulating API call to get booking details
//       // In a real app, you would make an actual API call like:
//       // const response = await axios.get(`https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}`, {
//       //   headers: {
//       //     Authorization: `Bearer ${token}`,
//       //     "ngrok-skip-browser-warning": "true",
//       //     "Content-Type": "application/json",
//       //   },
//       // });

//       // For demo purposes, we'll create mock data based on the booking
//       const booking = bookings.find((b) => b.bookingId === bookingId)
//       if (!booking) {
//         throw new Error("Booking not found")
//       }

//       // Mock services data with duration and price
//       const mockServices = [
//         {
//           id: 1,
//           name: "Facial Treatment",
//           duration: 60,
//           price: 89.99,
//         },
//         {
//           id: 2,
//           name: "Deep Cleansing",
//           duration: 45,
//           price: 69.99,
//         },
//         {
//           id: 3,
//           name: "Anti-Aging Treatment",
//           duration: 75,
//           price: 129.99,
//         },
//       ]

//       // Get random services (1-3) for this booking
//       const numServices = Math.floor(Math.random() * 3) + 1
//       const selectedMockServices = mockServices.slice(0, numServices)

//       // Mock specialist data
//       const specialist =
//         specialists.length > 0
//           ? specialists[Math.floor(Math.random() * specialists.length)]
//           : { name: "Jane Smith", userId: 123, specialization: "Skin Therapist" }

//       const bookingDetails = {
//         ...booking,
//         services: selectedMockServices,
//         specialist: specialist,
//         totalDuration: selectedMockServices.reduce((sum, service) => sum + service.duration, 0),
//         totalPrice: selectedMockServices.reduce((sum, service) => sum + service.price, 0),
//       }

//       return bookingDetails
//     } catch (error) {
//       console.error("Error fetching booking details:", error)
//       return null
//     }
//   }

//   const handleViewDetails = async (booking) => {
//     setSelectedBooking(booking)
//     const details = await fetchBookingDetails(booking.bookingId)
//     setBookingDetails(details)
//     setIsPopupOpen(true)
//   }

//   const closePopup = () => {
//     setIsPopupOpen(false)
//     setSelectedBooking(null)
//     setBookingDetails(null)
//   }

//   const handlePayment = () => {
//     alert(`Redirecting to VNPay for payment of $${selectedBooking.totalPrice}`)
//     closePopup()
//   }

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-amber-100 text-amber-800"
//       case "CONFIRMED":
//         return "bg-blue-100 text-blue-800"
//       case "IN_PROGRESS":
//         return "bg-emerald-100 text-emerald-800"
//       case "COMPLETED":
//         return "bg-teal-100 text-teal-800"
//       case "CANCELLED":
//         return "bg-rose-100 text-rose-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getPaymentBadgeClass = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-amber-100 text-amber-800"
//       case "SUCCESS":
//         return "bg-emerald-100 text-emerald-800"
//       case "FAILED":
//         return "bg-rose-100 text-rose-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const formatTime = (timeString) => {
//     if (!timeString) return "N/A"
//     return timeString
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 mx-auto text-rose-600 animate-spin" />
//           <p className="mt-4 text-lg font-medium text-gray-700">Loading your bookings...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
//           <AlertCircle className="w-16 h-16 mx-auto text-rose-600 mb-4" />
//           <p className="text-lg font-medium text-gray-800 mb-4">{error}</p>
//           <Link
//             to="/login"
//             className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
//           >
//             Go to Login
//             <ArrowRight className="ml-2 w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Breadcrumb */}
//         <nav className="py-4 mb-4">
//           <ol className="flex items-center space-x-2 text-sm">
//             <li>
//               <Link to="/" className="text-gray-600 hover:text-rose-600 flex items-center">
//                 <Home className="w-4 h-4 mr-1" />
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/services" className="text-gray-600 hover:text-rose-600 flex items-center">
//                 <ChevronRight className="w-4 h-4 mr-1" />
//                 Services
//               </Link>
//             </li>
//             <li className="text-gray-400">
//               <ChevronRight className="w-3 h-3" />
//             </li>
//             <li className="text-rose-600 font-medium">My Bookings</li>
//           </ol>
//         </nav>

//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
//           <p className="text-gray-600">View and manage all your service appointments</p>
//         </div>

//         {/* Confirmed Booking Display */}
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

//         {/* Selected Services Card */}
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

//             {/* Booking Options */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   <Calendar className="w-4 h-4 inline mr-1" />
//                   Booking Date
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
//                   <Clock className="w-4 h-4 inline mr-1" />
//                   Start Time
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
//                   <User className="w-4 h-4 inline mr-1" />
//                   Specialist (Optional)
//                 </label>
//                 <select
//                   value={selectedSpecialist}
//                   onChange={(e) => setSelectedSpecialist(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
//                 >
//                   <option value="">Auto-assign</option>
//                   {specialists.length > 0 ? (
//                     specialists.map((specialist) => (
//                       <option key={specialist.userId} value={specialist.userId}>
//                         {specialist.name}
//                       </option>
//                     ))
//                   ) : (
//                     <option disabled>No specialists available</option>
//                   )}
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

//         {/* Search Filter */}
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
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
//               />
//             </div>
//             {searchDate && (
//               <button
//                 onClick={() => setSearchDate("")}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
//               >
//                 <XCircle className="w-4 h-4 mr-2" />
//                 Clear Filter
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Bookings List */}
//         {filteredBookings.length === 0 && selectedServices.length === 0 && !confirmedBooking ? (
//           <div className="bg-white rounded-xl shadow-md p-8 text-center">
//             <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
//             <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
//             <Link
//               to="/services"
//               className="inline-flex items-center px-5 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
//             >
//               Book a service now
//               <ArrowRight className="ml-2 w-4 h-4" />
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredBookings.map((booking) => (
//               <div
//                 key={booking.bookingId}
//                 className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                   {/* Booking Details */}
//                   <div className="flex-grow">
//                     <div className="flex items-center mb-4">
//                       <h3 className="text-xl font-semibold text-gray-900 mr-3">Booking #{booking.bookingId}</h3>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
//                           booking.status,
//                         )}`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-3">
//                         <div className="flex items-start">
//                           <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                           <div>
//                             <p className="text-sm text-gray-500">Date</p>
//                             <p className="font-medium text-gray-800">{formatDate(booking.bookingDate)}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-start">
//                           <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                           <div>
//                             <p className="text-sm text-gray-500">Time slot</p>
//                             <p className="font-medium text-gray-800">{formatTime(booking.timeSlot)}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-start">
//                           <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
//                           <div>
//                             <p className="text-sm text-gray-500">Total Price</p>
//                             <p className="font-medium text-gray-800">${booking.totalPrice || "N/A"}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         <div>
//                           <p className="text-sm text-gray-500">Payment Status</p>
//                           <span
//                             className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
//                               booking.paymentStatus,
//                             )}`}
//                           >
//                             {booking.paymentStatus}
//                           </span>
//                         </div>

//                         {booking.checkInTime && (
//                           <div>
//                             <p className="text-sm text-gray-500">Check-in Time</p>
//                             <p className="font-medium text-gray-800">{formatTime(booking.checkInTime)}</p>
//                           </div>
//                         )}

//                         {booking.checkOutTime && (
//                           <div>
//                             <p className="text-sm text-gray-500">Check-out Time</p>
//                             <p className="font-medium text-gray-800">{formatTime(booking.checkOutTime)}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-3 min-w-[140px]">
//                     {booking.status === "PENDING" && (
//                       <button
//                         onClick={() => handleCancelBooking(booking.bookingId)}
//                         className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
//                       >
//                         <XCircle className="w-4 h-4 mr-2" />
//                         Cancel
//                       </button>
//                     )}
//                     {booking.status === "CONFIRMED" && !booking.checkInTime && (
//                       <button
//                         onClick={() => handleCheckIn(booking.bookingId)}
//                         className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                       >
//                         <CheckCircle className="w-4 h-4 mr-2" />
//                         Check-in
//                       </button>
//                     )}
//                     {booking.status === "IN_PROGRESS" && !booking.checkOutTime && (
//                       <button
//                         onClick={() => handleCheckOut(booking.bookingId)}
//                         className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                       >
//                         <CheckCircle className="w-4 h-4 mr-2" />
//                         Check-out
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleViewDetails(booking)}
//                       className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//                     >
//                       <Eye className="w-4 h-4 mr-2" />
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Redesigned Popup for Booking Details */}
//       {isPopupOpen && selectedBooking && bookingDetails && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
//             {/* Left Side: Booking Details */}
//             <div className="w-full md:w-2/3 p-6 overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
//                 <button onClick={closePopup} className="text-gray-500 hover:text-rose-600 transition-colors">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Booking ID and Status */}
//               <div className="flex flex-wrap items-center gap-3 mb-6">
//                 <span className="text-lg font-semibold text-gray-800">#{selectedBooking.bookingId}</span>
//                 <span
//                   className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
//                     selectedBooking.status,
//                   )}`}
//                 >
//                   {selectedBooking.status}
//                 </span>
//               </div>

//               {/* Booking Info */}
//               <div className="bg-rose-50 rounded-xl p-5 mb-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="flex items-start">
//                     <Calendar className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-600">Date</p>
//                       <p className="font-medium text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <Clock className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-600">Time</p>
//                       <p className="font-medium text-gray-900">{formatTime(selectedBooking.timeSlot)}</p>
//                     </div>
//                   </div>
//                   {bookingDetails.specialist && (
//                     <div className="flex items-start">
//                       <User className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                       <div>
//                         <p className="text-sm text-gray-600">Specialist</p>
//                         <p className="font-medium text-gray-900">{bookingDetails.specialist.name}</p>
//                         <p className="text-xs text-gray-500">{bookingDetails.specialist.specialization}</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-start">
//                     <Timer className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-gray-600">Total Duration</p>
//                       <p className="font-medium text-gray-900">{bookingDetails.totalDuration} minutes</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Services */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                   <Package className="w-5 h-5 text-rose-600 mr-2" />
//                   Services
//                 </h3>
//                 <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//                   <ul className="divide-y divide-gray-200">
//                     {bookingDetails.services && bookingDetails.services.length > 0 ? (
//                       bookingDetails.services.map((service, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-50">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium text-gray-900">{service.name}</h4>
//                               <p className="text-sm text-gray-600 flex items-center mt-1">
//                                 <Timer className="w-4 h-4 mr-1 text-gray-400" />
//                                 {service.duration} minutes
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-semibold text-rose-600">${service.price.toFixed(2)}</p>
//                             </div>
//                           </div>
//                         </li>
//                       ))
//                     ) : (
//                       <li className="p-4 text-gray-500 text-center">No services available</li>
//                     )}
//                   </ul>
//                   <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
//                     <p className="font-medium text-gray-800">Total</p>
//                     <p className="font-bold text-rose-600 text-lg">${bookingDetails.totalPrice.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side: Payment and Actions */}
//             <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
//               {selectedBooking.status !== "CANCELLED" ? (
//                 <>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <CreditCardIcon className="w-5 h-5 text-rose-600 mr-2" />
//                     Payment
//                   </h3>

//                   <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <p className="text-gray-600">Status</p>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
//                           selectedBooking.paymentStatus,
//                         )}`}
//                       >
//                         {selectedBooking.paymentStatus}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center mb-2">
//                       <p className="text-gray-600">Method</p>
//                       <p className="font-medium text-gray-800">VNPay</p>
//                     </div>
//                     <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//                       <p className="font-medium text-gray-800">Total</p>
//                       <p className="font-bold text-rose-600">${bookingDetails.totalPrice.toFixed(2)}</p>
//                     </div>
//                   </div>

//                   {selectedBooking.paymentStatus === "PENDING" && selectedBooking.status !== "CANCELLED" && (
//                     <button
//                       onClick={handlePayment}
//                       className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center justify-center mb-4"
//                     >
//                       <DollarSign className="w-5 h-5 mr-2" />
//                       Pay Now
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <div className="bg-rose-50 rounded-xl p-4 mb-6">
//                   <div className="flex items-center">
//                     <XCircle className="w-5 h-5 text-rose-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-rose-700">Booking Cancelled</h3>
//                   </div>
//                   <p className="text-gray-600 mt-2">This booking has been cancelled and no payment is required.</p>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="space-y-3 mt-auto">
//                 {selectedBooking.status === "PENDING" && (
//                   <button
//                     onClick={() => {
//                       handleCancelBooking(selectedBooking.bookingId)
//                       closePopup()
//                     }}
//                     className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
//                   >
//                     <XCircle className="w-4 h-4 mr-2" />
//                     Cancel Booking
//                   </button>
//                 )}
//                 {selectedBooking.status === "CONFIRMED" && !selectedBooking.checkInTime && (
//                   <button
//                     onClick={() => {
//                       handleCheckIn(selectedBooking.bookingId)
//                       closePopup()
//                     }}
//                     className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                   >
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Check-in
//                   </button>
//                 )}
//                 {selectedBooking.status === "IN_PROGRESS" && !selectedBooking.checkOutTime && (
//                   <button
//                     onClick={() => {
//                       handleCheckOut(selectedBooking.bookingId)
//                       closePopup()
//                     }}
//                     className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Check-out
//                   </button>
//                 )}
//                 <button
//                   onClick={closePopup}
//                   className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default MyBooking


"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
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
} from "lucide-react"

const MyBooking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(false)
  const [searchDate, setSearchDate] = useState("")
  const [selectedServices, setSelectedServices] = useState([])
  const [bookingDate, setBookingDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [selectedSpecialist, setSelectedSpecialist] = useState("")
  const [specialists, setSpecialists] = useState([])
  const [isBooking, setIsBooking] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [bookingError, setBookingError] = useState("") // Thêm state cho lỗi booking

  // Fetch bookings, selected services, and specialists from localStorage/API
  useEffect(() => {
    const storedServices = localStorage.getItem("selectedServicesForBooking")
    console.log("Retrieved selectedServices from localStorage:", storedServices)
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices)
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices)
        } else {
          setSelectedServices([])
        }
      } catch (error) {
        console.error("Error parsing selectedServices from localStorage:", error)
        setSelectedServices([])
      }
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No token found. Please login again.")
        }

        const response = await axios.get("https://b64a-118-69-182-149.ngrok-free.app/api/bookings/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        })

        console.log("Fetch bookings response:", response.data)
        if (Array.isArray(response.data)) {
          const sortedBookings = [...response.data].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.bookingDate)
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.bookingDate)
            return dateB - dateA
          })
          setBookings(sortedBookings)
        } else {
          throw new Error("Invalid response format: Expected an array of bookings")
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.")
            setTimeout(() => {
              navigate("/login")
            }, 2000)
          } else if (error.response.status === 403) {
            setError("You do not have permission to access your bookings.")
          } else if (error.response.status === 404) {
            setError("No bookings found.")
          } else {
            setError(error.response.data.message || "Failed to load bookings. Please try again.")
          }
        } else if (error.request) {
          setError("Unable to connect to server. CORS issue or server error. Please try again.")
        } else {
          setError(error.message || "Failed to load bookings. Please try again.")
        }
      }
    }

    const fetchSpecialists = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No token found. Please login again.")
        }

        const response = await axios.get("https://b64a-118-69-182-149.ngrok-free.app/api/users/specialists/active", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        })

        console.log("Fetch specialists response:", response.data)
        if (Array.isArray(response.data)) {
          setSpecialists(response.data)
        } else {
          throw new Error("Invalid response format: Expected an array of specialists")
        }
      } catch (error) {
        console.error("Error fetching specialists:", error)
        setError("Failed to load specialists. Please try again.")
        setSpecialists([])
      }
    }

    Promise.all([fetchBookings(), fetchSpecialists()]).finally(() => {
      setLoading(false)
    })
  }, [navigate, refresh])

  useEffect(() => {
    setRefresh((prev) => !prev)
  }, [location])

  const filteredBookings = searchDate
    ? bookings.filter((booking) => {
        const bookingDateFormatted = new Date(booking.bookingDate).toISOString().split("T")[0]
        return bookingDateFormatted === searchDate
      })
    : bookings

  const checkBookingConflict = (bookingDate, startTime, services) => {
    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)
    const startDateTime = new Date(`${bookingDate}T${startTime}:00`)
    const endDateTime = new Date(startDateTime.getTime() + totalDuration * 60000)
    const timeSlot = `${startTime}-${endDateTime.toTimeString().slice(0, 5)}`

    return bookings.some((booking) => {
      if (booking.status === "CANCELLED") return false
      const existingDate = new Date(booking.bookingDate).toISOString().split("T")[0]
      const existingTimeSlot = booking.timeSlot
      return existingDate === bookingDate && existingTimeSlot === timeSlot
    })
  }

  const handleConfirmBooking = async () => {
    if (!bookingDate || !startTime) {
      setBookingError("Please select a booking date and start time.")
      return
    }

    if (isBooking) {
      setBookingError("Booking in progress... Please wait.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setBookingError("No token found. Please login again.")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
      return
    }

    if (checkBookingConflict(bookingDate, startTime, selectedServices)) {
      setBookingError("You already have a booking at this time.")
      return
    }

    const bookingData = {
      specialistId: selectedSpecialist ? Number(selectedSpecialist) : null,
      bookingDate: bookingDate,
      startTime: startTime,
      serviceIds: selectedServices.map((service) => Number(service.serviceId)),
    }

    console.log("Booking data to be sent:", bookingData)

    setIsBooking(true)
    setBookingError("")

    try {
      const response = await axios.post("https://b64a-118-69-182-149.ngrok-free.app/api/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      })

      console.log("Booking response:", response.data)

      setConfirmedBooking({
        services: [...selectedServices],
        bookingDate,
        startTime,
        totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0),
      })

      setSelectedServices([])
      localStorage.removeItem("selectedServicesForBooking")
      setBookingDate("")
      setStartTime("")
      setSelectedSpecialist("")
      setRefresh((prev) => !prev)
      setBookingError("") // Xóa lỗi sau khi booking thành công
      alert("Booking confirmed successfully!") // Giữ alert cho thành công nếu cần
    } catch (error) {
      console.error("Error creating booking:", error)
      if (error.response) {
        const errorCode = error.response.data.errorCode
        const errorMessage = error.response.data.message || "An error occurred."
        switch (errorCode) {
          case "UNAUTHENTICATED":
            setBookingError("Unauthorized: Please login again.")
            setTimeout(() => {
              navigate("/login")
            }, 2000)
            break
          case "SERVICE_NOT_EXISTED":
            setBookingError("One or more selected services do not exist.")
            break
          case "BOOKING_SERVICE_LIMIT_EXCEEDED":
            setBookingError("Too many services selected. Maximum limit exceeded.")
            break
          case "TIME_SLOT_OUTSIDE_WORKING_HOURS":
            setBookingError("Selected time is outside working hours (8:00 - 20:00).")
            break
          case "BOOKING_DATE_IN_PAST":
            setBookingError("Booking date cannot be in the past.")
            break
          case "BOOKING_DATE_TOO_FAR_IN_FUTURE":
            setBookingError("Booking date is too far in the future.")
            break
          case "BOOKING_TIME_CONFLICT":
            setBookingError("You already have a booking at this time.")
            break
          case "SKIN_THERAPIST_NOT_EXISTED":
            setBookingError("Selected specialist does not exist.")
            break
          case "SPECIALIST_NOT_ACTIVE":
            setBookingError("Selected specialist is not active.")
            break
          case "TIME_SLOT_UNAVAILABLE":
            setBookingError("Selected specialist is not available at this time.")
            break
          default:
            setBookingError(errorMessage || "Failed to create booking. Please try again.")
        }
      } else {
        setBookingError("Failed to connect to server. Please try again.")
      }
    } finally {
      setIsBooking(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found. Please login again.")
      }

      const response = await axios.post(
        `https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Cancel booking response:", response.data)
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error("Error canceling booking:", error)
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.")
          setTimeout(() => {
            navigate("/login")
          }, 2000)
        } else if (error.response.status === 403) {
          setError("You do not have permission to cancel this booking.")
        } else {
          setError(error.response.data.message || "Failed to cancel booking. Please try again.")
        }
      } else {
        setError("Failed to cancel booking. Please try again.")
      }
    }
  }

  const handleCheckIn = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found. Please login again.")
      }

      const response = await axios.post(
        `https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Check-in booking response:", response.data)
      setRefresh((prev) => !prev)
      alert("Check-in successful!")
    } catch (error) {
      console.error("Error checking in booking:", error)
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.")
          setTimeout(() => {
            navigate("/login")
          }, 2000)
        } else {
          setError(error.response.data.message || "Failed to check-in booking. Please try again.")
        }
      } else {
        setError("Failed to check-in booking. Please try again.")
      }
    }
  }

  const handleCheckOut = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found. Please login again.")
      }

      const response = await axios.post(
        `https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Check-out booking response:", response.data)
      setRefresh((prev) => !prev)
      alert("Check-out successful!")
    } catch (error) {
      console.error("Error checking out booking:", error)
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.")
          setTimeout(() => {
            navigate("/login")
          }, 2000)
        } else {
          setError(error.response.data.message || "Failed to check-out booking. Please try again.")
        }
      } else {
        setError("Failed to check-out booking. Please try again.")
      }
    }
  }

  // Fetch booking details including services and specialist info
  const fetchBookingDetails = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found. Please login again.")
      }

      // Simulating API call to get booking details
      // In a real app, you would make an actual API call like:
      // const response = await axios.get(`https://b64a-118-69-182-149.ngrok-free.app/api/bookings/${bookingId}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "ngrok-skip-browser-warning": "true",
      //     "Content-Type": "application/json",
      //   },
      // });

      // For demo purposes, we'll create mock data based on the booking
      const booking = bookings.find((b) => b.bookingId === bookingId)
      if (!booking) {
        throw new Error("Booking not found")
      }

      // Mock services data with duration and price
      const mockServices = [
        {
          id: 1,
          name: "Facial Treatment",
          duration: 60,
          price: 89.99,
        },
        {
          id: 2,
          name: "Deep Cleansing",
          duration: 45,
          price: 69.99,
        },
        {
          id: 3,
          name: "Anti-Aging Treatment",
          duration: 75,
          price: 129.99,
        },
      ]

      // Get random services (1-3) for this booking
      const numServices = Math.floor(Math.random() * 3) + 1
      const selectedMockServices = mockServices.slice(0, numServices)

      // Mock specialist data
      const specialist =
        specialists.length > 0
          ? specialists[Math.floor(Math.random() * specialists.length)]
          : { name: "Jane Smith", userId: 123, specialization: "Skin Therapist" }

      const bookingDetails = {
        ...booking,
        services: selectedMockServices,
        specialist: specialist,
        totalDuration: selectedMockServices.reduce((sum, service) => sum + service.duration, 0),
        totalPrice: selectedMockServices.reduce((sum, service) => sum + service.price, 0),
      }

      return bookingDetails
    } catch (error) {
      console.error("Error fetching booking details:", error)
      return null
    }
  }

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking)
    const details = await fetchBookingDetails(booking.bookingId)
    setBookingDetails(details)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedBooking(null)
    setBookingDetails(null)
  }

  const handlePayment = () => {
    alert(`Redirecting to VNPay for payment of $${selectedBooking.totalPrice}`)
    closePopup()
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-emerald-100 text-emerald-800"
      case "COMPLETED":
        return "bg-teal-100 text-teal-800"
      case "CANCELLED":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800"
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800"
      case "FAILED":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    return timeString
  }

  // Xóa lỗi khi thay đổi input
  const clearBookingError = () => {
    if (bookingError) setBookingError("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-rose-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <AlertCircle className="w-16 h-16 mx-auto text-rose-600 mb-4" />
          <p className="text-lg font-medium text-gray-800 mb-4">{error}</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            Go to Login
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="py-4 mb-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-rose-600 flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-gray-600 hover:text-rose-600 flex items-center">
                <ChevronRight className="w-4 h-4 mr-1" />
                Services
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-3 h-3" />
            </li>
            <li className="text-rose-600 font-medium">My Bookings</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your service appointments</p>
        </div>

        {/* Confirmed Booking Display */}
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

        {/* Selected Services Card */}
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

            {/* Booking Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value)
                    clearBookingError() // Xóa lỗi khi thay đổi
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value)
                    clearBookingError() // Xóa lỗi khi thay đổi
                  }}
                  min="08:00"
                  max="20:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Specialist (Optional)
                </label>
                <select
                  value={selectedSpecialist}
                  onChange={(e) => {
                    setSelectedSpecialist(e.target.value)
                    clearBookingError() // Xóa lỗi khi thay đổi
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Auto-assign</option>
                  {specialists.length > 0 ? (
                    specialists.map((specialist) => (
                      <option key={specialist.userId} value={specialist.userId}>
                        {specialist.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No specialists available</option>
                  )}
                </select>
              </div>
            </div>

            {/* Hiển thị lỗi booking */}
            {bookingError && (
              <div className="mb-4 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {bookingError}
              </div>
            )}

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

        {/* Search Filter */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            {searchDate && (
              <button
                onClick={() => setSearchDate("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 && selectedServices.length === 0 && !confirmedBooking ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
            <Link
              to="/services"
              className="inline-flex items-center px-5 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              Book a service now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Booking Details */}
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">Booking #{booking.bookingId}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          booking.status,
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
                              booking.paymentStatus,
                            )}`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </div>

                        {booking.checkInTime && (
                          <div>
                            <p className="text-sm text-gray-500">Check-in Time</p>
                            <p className="font-medium text-gray-800">{formatTime(booking.checkInTime)}</p>
                          </div>
                        )}

                        {booking.checkOutTime && (
                          <div>
                            <p className="text-sm text-gray-500">Check-out Time</p>
                            <p className="font-medium text-gray-800">{formatTime(booking.checkOutTime)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                    {booking.status === "CONFIRMED" && !booking.checkInTime && (
                      <button
                        onClick={() => handleCheckIn(booking.bookingId)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Check-in
                      </button>
                    )}
                    {booking.status === "IN_PROGRESS" && !booking.checkOutTime && (
                      <button
                        onClick={() => handleCheckOut(booking.bookingId)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Check-out
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redesigned Popup for Booking Details */}
      {isPopupOpen && selectedBooking && bookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
            {/* Left Side: Booking Details */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={closePopup} className="text-gray-500 hover:text-rose-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Booking ID and Status */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-lg font-semibold text-gray-800">#{selectedBooking.bookingId}</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                    selectedBooking.status,
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              {/* Booking Info */}
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
                        <p className="font-medium text-gray-900">{bookingDetails.specialist.name}</p>
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

              {/* Services */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="w-5 h-5 text-rose-600 mr-2" />
                  Services
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {bookingDetails.services && bookingDetails.services.length > 0 ? (
                      bookingDetails.services.map((service, index) => (
                        <li key={index} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Timer className="w-4 h-4 mr-1 text-gray-400" />
                                {service.duration} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-rose-600">${service.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-4 text-gray-500 text-center">No services available</li>
                    )}
                  </ul>
                  <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
                    <p className="font-medium text-gray-800">Total</p>
                    <p className="font-bold text-rose-600 text-lg">${bookingDetails.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Payment and Actions */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
              {selectedBooking.status !== "CANCELLED" ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCardIcon className="w-5 h-5 text-rose-600 mr-2" />
                    Payment
                  </h3>

                  <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-600">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                          selectedBooking.paymentStatus,
                        )}`}
                      >
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-600">Method</p>
                      <p className="font-medium text-gray-800">VNPay</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <p className="font-medium text-gray-800">Total</p>
                      <p className="font-bold text-rose-600">${bookingDetails.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  {selectedBooking.paymentStatus === "PENDING" && selectedBooking.status !== "CANCELLED" && (
                    <button
                      onClick={handlePayment}
                      className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center justify-center mb-4"
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pay Now
                    </button>
                  )}
                </>
              ) : (
                <div className="bg-rose-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-rose-600 mr-2" />
                    <h3 className="text-lg font-semibold text-rose-700">Booking Cancelled</h3>
                  </div>
                  <p className="text-gray-600 mt-2">This booking has been cancelled and no payment is required.</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-auto">
                {selectedBooking.status === "PENDING" && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking.bookingId)
                      closePopup()
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </button>
                )}
                {selectedBooking.status === "CONFIRMED" && !selectedBooking.checkInTime && (
                  <button
                    onClick={() => {
                      handleCheckIn(selectedBooking.bookingId)
                      closePopup()
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check-in
                  </button>
                )}
                {selectedBooking.status === "IN_PROGRESS" && !selectedBooking.checkOutTime && (
                  <button
                    onClick={() => {
                      handleCheckOut(selectedBooking.bookingId)
                      closePopup()
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check-out
                  </button>
                )}
                <button
                  onClick={closePopup}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBooking