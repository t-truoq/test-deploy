"use client";

import { motion, AnimatePresence } from "framer-motion"; // Thêm AnimatePresence
import { Clock } from "lucide-react";

const TimePicker = ({
  isTimePickerOpen,
  setIsTimePickerOpen,
  timeSlots,
  startTime,
  setStartTime,
  specialistSchedule,
  selectedSpecialist,
  isTimeSlotAvailable,
}) => {
  const handleTimeSelect = (time) => {
    setStartTime(time);
    setIsTimePickerOpen(false);
  };

  return (
    <div className="relative">
      {/* Giả định đây là nơi sử dụng AnimatePresence */}
      <AnimatePresence>
        {isTimePickerOpen && (
          <motion.div
            className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {timeSlots.map((time) => {
              const isAvailable =
                !selectedSpecialist ||
                (specialistSchedule &&
                  specialistSchedule.some(
                    (slot) => slot.timeSlot.includes(time) && slot.availability
                  ));
              const isPastTime = !isTimeSlotAvailable(time);

              return (
                <motion.div
                  key={time}
                  onClick={() => isAvailable && !isPastTime && handleTimeSelect(time)}
                  className={`px-4 py-2 flex items-center cursor-pointer ${
                    time === startTime ? "bg-rose-100 text-rose-700" : "hover:bg-gray-100"
                  } ${!isAvailable || isPastTime ? "text-gray-400 cursor-not-allowed" : ""}`}
                  whileHover={{ scale: isAvailable && !isPastTime ? 1.02 : 1 }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{time}</span>
                  {!isAvailable && <span className="ml-2 text-xs text-red-500">(Unavailable)</span>}
                  {isPastTime && <span className="ml-2 text-xs text-gray-500">(Past)</span>}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimePicker;