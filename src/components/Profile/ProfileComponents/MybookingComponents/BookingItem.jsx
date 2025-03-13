import { motion } from "framer-motion";
import { Calendar, Clock, CreditCard, Eye, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const BookingItem = ({
  booking,
  index,
  totalBookings,
  feedbackStatus,
  handleViewDetails,
  setIsFeedbackPopupOpen,
  setSelectedBooking,
}) => {
  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
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

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

  const formatTime = (timeString) => (timeString ? timeString : "N/A");

  const displayNumber = totalBookings - index;

  return (
    <motion.div
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
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-grow">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mr-3">
              Booking #{displayNumber}
            </h3>
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
                  <p className="font-medium text-gray-800">
                    {formatDate(booking.bookingDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time slot</p>
                  <p className="font-medium text-gray-800">
                    {formatTime(booking.timeSlot)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium text-gray-800">
                    {booking.totalPrice
                      ? (booking.totalPrice.toLocaleString("vi-VN") + " ₫")
                      : "N/A"}
                  </p>
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
          <motion.button
            onClick={() => handleViewDetails(booking)}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4 mr-2" /> View Details
          </motion.button>
          {booking.status === "COMPLETED" && !feedbackStatus[booking.bookingId] && (
            <motion.button
              onClick={() => {
                setSelectedBooking(booking);
                setIsFeedbackPopupOpen(true);
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Feedback
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingItem;