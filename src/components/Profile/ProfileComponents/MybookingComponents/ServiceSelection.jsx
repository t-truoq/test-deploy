"use client";

import { motion, AnimatePresence } from "framer-motion"; // Thêm AnimatePresence
import { Package, Calendar, Clock, User, CheckCircle, RefreshCw } from "lucide-react";
import TimePicker from "./TimePicker";
import CalendarMyBooking from "../../ProfileComponents/MybookingComponents/CalendarMyBooking";

const ServiceSelection = ({
  selectedServices,
  setSelectedServices,
  bookingDate,
  setBookingDate,
  startTime,
  setStartTime,
  selectedSpecialist,
  setSelectedSpecialist,
  specialists,
  isBooking,
  handleConfirmBooking,
  timeSlots,
  specialistSchedule,
  isScheduleLoading,
  isTimePickerOpen,
  setIsTimePickerOpen,
  isCalendarOpen,
  setIsCalendarOpen,
  isTimeSlotAvailable,
}) => {
  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const formatVND = (price) => price.toLocaleString("vi-VN") + " ₫";

  if (selectedServices.length === 0) return null;

  return (
    <motion.div className="mb-8" variants={slideUp} initial="initial" animate="animate" exit="exit">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center mb-4">
          <Package className="w-5 h-5 text-rose-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Selected Services</h2>
        </div>
        <motion.div
          className="bg-rose-50 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ul className="divide-y divide-rose-100">
            {selectedServices.map((service, idx) => (
              <motion.li
                key={service.serviceId}
                className="py-3 flex justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <div>
                  <p className="font-medium text-gray-800">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.duration} minutes</p>
                </div>
                <p className="font-semibold text-rose-600">{formatVND(service.price)}</p>
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-rose-100 flex justify-between">
            <p className="font-medium text-gray-800">Total</p>
            <p className="font-semibold text-rose-600">
              {formatVND(
                selectedServices.reduce((sum, service) => sum + service.price, 0)
              )}
            </p>
          </div>
        </motion.div>

        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" /> Booking Date
              </label>
              <motion.button
                type="button"
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-rose-500 flex justify-between items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{bookingDate || "Select a date"}</span>
                <Calendar className="w-5 h-5 text-gray-500" />
              </motion.button>
              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div
                    className="absolute z-10 mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <CalendarMyBooking
                      selectedDate={bookingDate}
                      onDateChange={(date) => {
                        setBookingDate(date);
                        setIsCalendarOpen(false);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" /> Start Time
              </label>
              <motion.button
                type="button"
                onClick={() => setIsTimePickerOpen((prev) => !prev)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-rose-500 flex justify-between items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{startTime || "Select a start time"}</span>
                <Clock className="w-5 h-5 text-gray-500" />
              </motion.button>
              <TimePicker
                isTimePickerOpen={isTimePickerOpen}
                setIsTimePickerOpen={setIsTimePickerOpen}
                timeSlots={timeSlots}
                startTime={startTime}
                setStartTime={setStartTime}
                specialistSchedule={specialistSchedule}
                selectedSpecialist={selectedSpecialist}
                isTimeSlotAvailable={isTimeSlotAvailable}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" /> Specialist Schedule
              </label>
              {isScheduleLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-rose-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading schedule...</span>
                </div>
              ) : selectedSpecialist && specialistSchedule.length > 0 ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white max-h-40 overflow-y-auto">
                  {specialistSchedule.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-1 px-2 rounded-md text-sm ${
                        slot.availability ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      <span>{slot.timeSlot}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          slot.availability
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {slot.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm">
                  {selectedSpecialist
                    ? "No schedule available for this date."
                    : "Select a specialist to view their schedule."}
                </div>
              )}
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleConfirmBooking}
          disabled={isBooking}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
            isBooking
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-rose-600 text-white hover:bg-rose-700"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ServiceSelection;