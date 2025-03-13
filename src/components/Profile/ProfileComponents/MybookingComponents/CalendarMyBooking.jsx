import { useState } from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const CustomCalendar = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfMonth = monthStart.getDay();
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => addDays(startOfMonth(prev), -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addDays(endOfMonth(prev), 1));
  };

  const handleDateClick = (day) => {
    onDateChange(format(day, "yyyy-MM-dd"));
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-xl shadow-md border border-gray-100 w-full max-w-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        {daysInMonth.map((day) => (
          <motion.button
            key={day.toString()}
            onClick={() => handleDateClick(day)}
            className={`p-2 rounded-full text-sm ${
              isSameDay(day, new Date(selectedDate))
                ? "bg-rose-600 text-white"
                : isToday(day)
                ? "bg-rose-100 text-rose-600"
                : isSameMonth(day, currentMonth)
                ? "text-gray-800 hover:bg-rose-50"
                : "text-gray-400"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!isSameMonth(day, currentMonth)}
          >
            {format(day, "d")}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CustomCalendar;