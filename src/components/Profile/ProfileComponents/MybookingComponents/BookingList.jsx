"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Calendar, Clock, CreditCard, XCircle, ArrowRight, Package, RefreshCw, Eye, MessageSquare } from "lucide-react"
import {
  formatDate,
  formatTime,
  formatVND,
  getStatusBadgeClass,
  getPaymentBadgeClass,
  formatPaymentStatus,
} from "../MybookingComponents/utils"

const BookingList = ({
  bookings,
  feedbackStatus,
  onViewDetails,
  onOpenFeedback,
  setRefresh,
  setErrorPopup,
  navigate,
  setIsPopupOpen,
}) => {
  const [searchDate, setSearchDate] = useState("")
  const [isCancelling, setIsCancelling] = useState({})

  const filteredBookings = searchDate
    ? bookings.filter((booking) => {
        const bookingDateFormatted = new Date(booking.bookingDate).toISOString().split("T")[0]
        return bookingDateFormatted === searchDate
      })
    : bookings

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setErrorPopup("No token found. Please login again.")
        setTimeout(() => navigate("/login"), 2000)
        return
      }

      const booking = bookings.find((b) => b.bookingId === bookingId)
      if (!booking) {
        setErrorPopup("Booking not found.")
        return
      }

      if (bookingId === 1) {
        setErrorPopup("Cannot cancel the default booking.")
        return
      }

      const [startTime] = booking.timeSlot.split("-")
      const bookingStartDateTime = new Date(`${booking.bookingDate}T${startTime}:00`)
      const currentDateTime = new Date()
      const timeDifference = (bookingStartDateTime - currentDateTime) / (1000 * 60 * 60)

      if (timeDifference < 24) {
        setErrorPopup("Cannot cancel booking less than 24 hours before start time.")
        return
      }

      setIsCancelling((prev) => ({ ...prev, [bookingId]: true }))

      const response = await fetch(
        `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings/${bookingId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        setRefresh((prev) => !prev)
      } else {
        const errorData = await response.json()
        setErrorPopup(errorData.message || "Failed to cancel booking.")
      }
    } catch (error) {
      console.error("Error canceling booking:", error)
      setErrorPopup("Failed to cancel booking.")
    } finally {
      setIsCancelling((prev) => ({ ...prev, [bookingId]: false }))
    }
  }

  const handleViewDetails = async (booking) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setErrorPopup("No token found. Please login again.")
        setTimeout(() => navigate("/login"), 2000)
        return
      }

      const response = await fetch(
        `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings/${booking.bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        const details = await response.json()
        const processedDetails = {
          ...booking,
          services: details.serviceNames
            ? details.serviceNames.map((name, index) => ({
                id: index + 1,
                name,
                duration: details.serviceDurations?.[name] || 0,
                price: details.servicePrices?.[name] || 0,
              }))
            : [],
          specialist: {
            name: details.specialistName || "Not assigned",
            userId: details.specialistId || 0,
            specialization: details.specialization || "Skin Therapist",
          },
          totalDuration: details.serviceNames
            ? details.serviceNames.reduce((sum, name) => sum + (details.serviceDurations?.[name] || 0), 0)
            : 0,
          feedback: {
            rating: 0,
            comment: "",
          },
        }

        onViewDetails(processedDetails)
        setIsPopupOpen(true)
      } else {
        const errorData = await response.json()
        setErrorPopup(errorData.message || "Failed to fetch booking details.")
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
      setErrorPopup("Failed to fetch booking details.")
    }
  }

  const handleOpenFeedback = (booking) => {
    if (!booking || !booking.bookingId) {
      setErrorPopup("Invalid booking selected for feedback.")
      return
    }
    onOpenFeedback(booking)
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  }

  return (
    <>
      <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="bg-white p-6 rounded-xl shadow-md">
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
              <motion.button
                onClick={() => setSearchDate("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="w-4 h-4 mr-2" /> Clear Filter
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {filteredBookings.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl shadow-md p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/services"
              className="inline-flex items-center px-5 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Book a service now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          {filteredBookings.map((booking, index) => {
            const displayNumber = filteredBookings.length - index
            return (
              <motion.div
                key={booking.bookingId}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-rose-500 hover:shadow-lg transition-all duration-300"
                variants={slideIn}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1 * index, duration: 0.4 },
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">Booking #{displayNumber}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                      {booking.status === "COMPLETED" && feedbackStatus && !feedbackStatus[booking.bookingId] && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                          <MessageSquare className="w-3 h-3 mr-1" /> Pending Feedback
                        </span>
                      )}
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
                            <p className="font-medium text-gray-800">{formatVND(booking.totalPrice) || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Payment Status</p>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                              booking.status,
                              booking.paymentStatus,
                            )}`}
                          >
                            {formatPaymentStatus(booking.status, booking.paymentStatus)}
                          </span>
                        </div>
                        {booking.checkInTime && (
                          <div>
                            <p className="text-sm text-gray-500">Check-in Time</p>
                            <p className="font-medium text-gray-800">
                              {new Date(booking.checkInTime).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {booking.checkOutTime && (
                          <div>
                            <p className="text-sm text-gray-500">Check-out Time</p>
                            <p className="font-medium text-gray-800">
                              {new Date(booking.checkOutTime).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    {booking.bookingId !== 1 && booking.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        disabled={isCancelling[booking.bookingId]}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          isCancelling[booking.bookingId]
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                        }`}
                      >
                        {isCancelling[booking.bookingId] ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" /> Cancel
                          </>
                        )}
                      </button>
                    )}
                    <motion.button
                      onClick={() => handleViewDetails(booking)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`View details for booking ${displayNumber}`}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </motion.button>
                    {booking.status === "COMPLETED" && feedbackStatus && (
                      feedbackStatus[booking.bookingId] ? (
                        <div className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                          <MessageSquare className="w-4 h-4 mr-2" /> Feedback Submitted
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => handleOpenFeedback(booking)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Submit feedback for booking ${displayNumber}`}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                        </motion.button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </>
  )
}

export default BookingList