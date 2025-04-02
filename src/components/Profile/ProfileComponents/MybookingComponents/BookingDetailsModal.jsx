"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  XCircle,
  User,
  Timer,
  Package,
  DollarSign,
  RefreshCw,
  MessageSquare,
  X,
  CreditCardIcon,
  AlertCircle,
} from "lucide-react"
import { formatDate, formatTime, formatVND, getStatusBadgeClass, getPaymentBadgeClass } from "./utils"

const BookingDetailsModal = ({
  booking,
  bookingDetails,
  feedbackStatus,
  onClose,
  onOpenFeedback,
  setRefresh,
  setErrorPopup,
  navigate,
}) => {
  const [isPaying, setIsPaying] = useState(false)

  const handlePayment = async () => {
    try {
      setIsPaying(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setErrorPopup("No token found. Please login again.")
        setTimeout(() => navigate("/login"), 2000)
        return
      }

      if (!booking.checkInTime) {
        setErrorPopup("Please check-in before payment.")
        return
      }

      const amount = Math.round(booking.totalPrice)
      const orderInfo = `Booking-${booking.bookingId}`

      const paymentData = { amount, orderInfo }

      const response = await fetch(
        "https://enhanced-perfectly-dog.ngrok-free.app/api/v1/vnpay/create-payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        },
      )

      const data = await response.json()

      if (data && data.code === 0 && data.result) {
        localStorage.setItem("lastPaidBookingId", booking.bookingId)
        window.location.href = data.result
      } else {
        setErrorPopup("Payment URL not received or payment creation failed.")
      }
    } catch (error) {
      console.error("Error initiating payment:", error)
      setErrorPopup(error.response?.data.message || "Failed to initiate payment.")
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <div className="w-full md:w-2/3 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <motion.button
              onClick={onClose}
              className="text-gray-500 hover:text-rose-600"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-lg font-semibold text-gray-800">Booking #{booking.bookingId}</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                booking.status,
              )}`}
            >
              {booking.status}
            </span>
          </div>
          <motion.div
            className="bg-rose-50 rounded-xl p-5 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.bookingDate)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.timeSlot)}</p>
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
          </motion.div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="w-5 h-5 text-rose-600 mr-2" /> Services
            </h3>
            <motion.div
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ul className="divide-y divide-gray-200">
                {(bookingDetails.services || []).map((service, index) => (
                  <motion.li
                    key={index}
                    className="p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name || `Service #${index + 1}`}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Timer className="w-4 h-4 mr-1 text-gray-400" /> {service.duration || 0} minutes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-rose-600">{formatVND(service.price || 0)}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
                <p className="font-medium text-gray-800">Total</p>
                <p className="font-bold text-rose-600 text-lg">{formatVND(booking.totalPrice)}</p>
              </div>
            </motion.div>
          </div>
          {bookingDetails.feedback && bookingDetails.feedback.rating > 0 && (
            <motion.div
              className="mb-6 bg-teal-50 rounded-xl p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 text-teal-600 mr-2" /> Your Feedback
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 ${
                          i < bookingDetails.feedback.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {bookingDetails.feedback.comment && (
                  <div>
                    <p className="text-sm text-gray-600">Comment</p>
                    <p className="font-medium text-gray-900">{bookingDetails.feedback.comment}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
        <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
          {booking.status !== "CANCELLED" && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCardIcon className="w-5 h-5 text-rose-600 mr-2" /> Payment
              </h3>
              <motion.div
                className="bg-white rounded-xl shadow-sm p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                      booking.status,
                      booking.paymentStatus,
                    )}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Method</p>
                  <p className="font-medium text-gray-800">VNPay</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="font-medium text-gray-800">Total</p>
                  <p className="font-bold text-rose-600">{formatVND(booking.totalPrice)}</p>
                </div>
              </motion.div>
              {(booking.paymentStatus === "PENDING" || booking.paymentStatus === "FAILED") && (
                <>
                  {booking.paymentStatus === "FAILED" && (
                    <motion.div
                      className="mb-4 p-3 bg-rose-50 rounded-lg flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <AlertCircle className="w-5 h-5 text-rose-600 mr-2" />
                      <p className="text-sm text-rose-700">Payment failed. Please try again.</p>
                    </motion.div>
                  )}
                  <motion.button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className={`w-full flex items-center justify-center py-3 rounded-lg font-medium transition-colors ${
                      isPaying
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-rose-600 text-white hover:bg-rose-700"
                    } mb-4`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
                  </motion.button>
                </>
              )}
            </>
          )}
          {booking.status === "CANCELLED" && (
            <motion.div
              className="bg-rose-50 rounded-xl p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-rose-600 mr-2" />
                <h3 className="text-lg font-semibold text-rose-700">Booking Cancelled</h3>
              </div>
              <p className="text-gray-600 mt-2">This booking has been cancelled and no payment is required.</p>
            </motion.div>
          )}

          <div className="space-y-3 mt-auto">
            {booking.status === "COMPLETED" &&
              (feedbackStatus[booking.bookingId] ? (
                <motion.div
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Thank you for your feedback
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => onOpenFeedback(booking)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                </motion.button>
              ))}
            <motion.button
              onClick={onClose}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BookingDetailsModal

