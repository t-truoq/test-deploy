import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, User, Timer, Package, MessageSquare, CreditCardIcon, XCircle, X, DollarSign, RefreshCw } from "lucide-react";

const BookingDetailsPopup = ({
  isPopupOpen,
  selectedBooking,
  bookingDetails,
  setIsPopupOpen,
  setSelectedBooking,
  setBookingDetails,
  handlePayment,
  feedbackStatus,
  setIsFeedbackPopupOpen,
  setIsPaymentSuccessPopupOpen,
  filteredBookings,
  setNotification, // Prop để cập nhật thông báo cho ErrorPopup
}) => {
  const [isPaying, setIsPaying] = useState(false);

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-100 text-amber-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS": return "bg-emerald-100 text-emerald-800";
      case "COMPLETED": return "bg-teal-100 text-teal-800";
      case "CANCELLED": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-100 text-amber-800";
      case "SUCCESS": return "bg-emerald-100 text-emerald-800";
      case "FAILED": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatVND = (price) => price.toLocaleString("vi-VN") + " ₫";

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "N/A";

  const formatTime = (timeString) => (timeString ? timeString : "N/A");

  if (!isPopupOpen || !selectedBooking || !bookingDetails) return null;

  const handleLocalPayment = async () => {
    try {
      setIsPaying(true);
      await handlePayment();
      setNotification({ show: true, isSuccess: true, message: "Payment successful!" });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
        setIsPopupOpen(false); // Đóng popup sau khi thành công
      }, 3000);
    } catch (error) {
      console.error("Payment failed:", error);
      setNotification({
        show: true,
        isSuccess: false,
        message: error.response?.data?.message || "Payment failed. Please try again.",
      });
      setBookingDetails((prev) => ({ ...prev, paymentStatus: "FAILED" }));
      setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        variants={slideUp}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="w-full md:w-2/3 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <motion.button
              onClick={() => {
                setIsPopupOpen(false);
                setSelectedBooking(null);
                setBookingDetails(null);
              }}
              className="text-gray-500 hover:text-rose-600"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {filteredBookings.findIndex((b) => b.bookingId === selectedBooking.bookingId) !== -1 && (
              <span className="text-lg font-semibold text-gray-800">
                Booking #{filteredBookings.length - filteredBookings.findIndex((b) => b.bookingId === selectedBooking.bookingId)}
              </span>
            )}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedBooking.status)}`}>
              {selectedBooking.status}
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
                {bookingDetails.services.map((service, index) => (
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
                        <p className="font-semibold text-rose-600">{formatVND(service.price)}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
                <p className="font-medium text-gray-800">Total</p>
                <p className="font-bold text-rose-600 text-lg">{formatVND(selectedBooking.totalPrice)}</p>
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
                      <span key={i} className={`w-5 h-5 ${i < bookingDetails.feedback.rating ? "text-yellow-400" : "text-gray-300"}`}>
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
          {selectedBooking.status !== "CANCELLED" && (
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
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(bookingDetails.paymentStatus)}`}>
                    {bookingDetails.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Method</p>
                  <p className="font-medium text-gray-800">VNPay</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="font-medium text-gray-800">Total</p>
                  <p className="font-bold text-rose-600">{formatVND(selectedBooking.totalPrice)}</p>
                </div>
              </motion.div>
              {(bookingDetails.paymentStatus === "PENDING" || bookingDetails.paymentStatus === "FAILED") &&
                selectedBooking.status !== "CANCELLED" && (
                  <motion.button
                    onClick={handleLocalPayment}
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
                    ) : bookingDetails.paymentStatus === "FAILED" ? (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" /> Try Again
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" /> Pay Now
                      </>
                    )}
                  </motion.button>
                )}
            </>
          )}
          {selectedBooking.status === "CANCELLED" && (
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
            {selectedBooking.status === "COMPLETED" &&
              (feedbackStatus[selectedBooking.bookingId] === true ? (
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
                  onClick={() => setIsFeedbackPopupOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                </motion.button>
              ))}
            <motion.button
              onClick={() => {
                setIsPopupOpen(false);
                setSelectedBooking(null);
                setBookingDetails(null);
              }}
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
  );
};

export default BookingDetailsPopup;