import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import BookingItem from "../MybookingComponents/BookingItem";
import { Link } from "react-router-dom";

const BookingList = ({
  bookings,
  selectedServices, // Không cần dùng nữa nhưng giữ prop để tương thích
  confirmedBooking,
  feedbackStatus,
  handleViewDetails,
  setIsFeedbackPopupOpen,
  setSelectedBooking,
}) => {
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Nếu không có booking nào, hiển thị thông báo "No bookings found"
  if (bookings.length === 0) {
    return (
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
    );
  }

  // Hiển thị danh sách bookings đã đặt
  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {bookings.map((booking, index) => (
        <BookingItem
          key={booking.bookingId}
          booking={booking}
          index={index}
          totalBookings={bookings.length}
          feedbackStatus={feedbackStatus}
          handleViewDetails={handleViewDetails}
          setIsFeedbackPopupOpen={setIsFeedbackPopupOpen}
          setSelectedBooking={setSelectedBooking}
        />
      ))}
    </motion.div>
  );
};

export default BookingList;