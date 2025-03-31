"use client"

import { useState, useEffect } from "react"

const CalendarMyBooking = ({ selectedDate, onDateChange }) => {
  // Initialize currentMonth and highlightedDate based on selectedDate or current date
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  )
  const [highlightedDate, setHighlightedDate] = useState(
    selectedDate ? new Date(selectedDate).getDate() : null
  )

  // Update currentMonth and highlightedDate only when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
      setHighlightedDate(date.getDate())
    }
  }, [selectedDate])

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-").map(Number)
    setCurrentMonth(new Date(year, month, 1))
    // Reset highlightedDate when changing months to avoid stale selections
    setHighlightedDate(null)
  }

  const handleDateClick = (day) => {
    // Set the highlighted date immediately
    setHighlightedDate(day)
    // Create the new date
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    // Manually format the date as YYYY-MM-DD to avoid timezone issues
    const year = newDate.getFullYear()
    const month = String(newDate.getMonth() + 1).padStart(2, "0") // Months are 0-based, so add 1
    const dayStr = String(day).padStart(2, "0")
    const formattedDate = `${year}-${month}-${dayStr}`
    // Call the parent's onDateChange callback
    onDateChange(formattedDate)
  }

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  )
  const years = Array.from({ length: 10 }, (_, i) => currentMonth.getFullYear() - 5 + i)

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    // Highlight the date if it matches the highlightedDate
    const isSelected = i === highlightedDate

    days.push(
      <button
        key={i}
        onClick={() => handleDateClick(i)}
        className={`p-2 rounded-full transition-all duration-200 text-sm ${
          isSelected ? "bg-blue-600 text-white" : "hover:bg-blue-100"
        }`}
      >
        {i}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="mb-4">
        <select
          value={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
          onChange={handleMonthChange}
          className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map((year) =>
            months.map((month, index) => (
              <option key={`${year}-${index}`} value={`${year}-${index}`}>
                {month} {year}
              </option>
            ))
          )}
        </select>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-gray-500 text-xs font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2 text-center">{days}</div>
    </div>
  )
}

export default CalendarMyBooking