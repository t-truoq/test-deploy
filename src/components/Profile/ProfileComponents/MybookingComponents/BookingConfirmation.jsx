"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import { formatDate, formatTime, formatVND } from "../MybookingComponents/utils"

const BookingConfirmation = ({ booking }) => {
  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <motion.div className="mb-8" variants={slideUp} initial="initial" animate="animate" exit="exit">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Booking Confirmed</h2>
        </div>
        <motion.div
          className="bg-green-50 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start mb-2">
            <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Booking Date</p>
              <p className="font-medium text-gray-800">{formatDate(booking.bookingDate)}</p>
            </div>
          </div>
          <div className="flex items-start mb-2">
            <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-medium text-gray-800">{formatTime(booking.startTime)}</p>
            </div>
          </div>
          <ul className="divide-y divide-green-100">
            {booking.services.map((service, idx) => (
              <motion.li
                key={service.serviceId}
                className="py-3 flex justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <div>
                  <p className="font-medium text-gray-800">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.duration} minutes</p>
                </div>
                <p className="font-semibold text-green-600">{formatVND(service.price)}</p>
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-green-100 flex justify-between">
            <p className="font-medium text-gray-800">Total</p>
            <p className="font-semibold text-green-600">{formatVND(booking.totalPrice)}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BookingConfirmation

