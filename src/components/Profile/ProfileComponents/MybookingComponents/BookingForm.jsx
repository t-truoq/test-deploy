"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Trash2, X, Calendar, User, Clock, CheckCircle, RefreshCw } from "lucide-react"
import axios from "axios"
import CalendarMyBooking from "../MybookingComponents/CalendarBooking"
import { formatVND } from "../MybookingComponents/utils"


const BookingForm = ({
  selectedServices,
  setSelectedServices,
  specialists,
  onConfirmBooking,
  setErrorPopup,
  setRefresh,
}) => {
  const [bookingDate, setBookingDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [selectedSpecialist, setSelectedSpecialist] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [specialistBusyTimes, setSpecialistBusyTimes] = useState([])
  const [allSpecialistBusyTimes, setAllSpecialistBusyTimes] = useState({})

  // Generate time slots (08:00 to 20:00, 30-minute intervals)
  const timeSlots = []
  for (let hour = 8; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      timeSlots.push(time)
    }
  }

  useEffect(() => {
    if (bookingDate) {
      fetchSpecialistBusyTimes(selectedSpecialist, bookingDate)
    } else {
      setSpecialistBusyTimes([])
      setAllSpecialistBusyTimes({})
    }
  }, [selectedSpecialist, bookingDate, specialists])

  const fetchSpecialistBusyTimes = async (specialistId, date) => {
    if (!date) {
      setSpecialistBusyTimes([])
      setAllSpecialistBusyTimes({})
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found. Please login again.")

      if (specialistId) {
        const response = await axios.get(
          `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/schedules/${specialistId}/busy`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            params: { date },
          },
        )

        if (Array.isArray(response.data)) {
          const busyTimeRanges = response.data
            .filter((item) => {
              const itemDate = new Date(item.date).toISOString().split("T")[0]
              return itemDate === date
            })
            .map((item) => {
              const [startTime, endTime] = item.timeSlot.split("-")
              return { startTime, endTime }
            })

          setSpecialistBusyTimes(busyTimeRanges)
          setAllSpecialistBusyTimes((prev) => ({
            ...prev,
            [specialistId]: busyTimeRanges,
          }))
        }
      } else {
        const busyTimesMap = {}
        for (const specialist of specialists) {
          try {
            const response = await axios.get(
              `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/schedules/${specialist.userId}/busy`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "ngrok-skip-browser-warning": "true",
                  "Content-Type": "application/json",
                },
                params: { date },
              },
            )

            if (Array.isArray(response.data)) {
              const busyTimeRanges = response.data
                .filter((item) => {
                  const itemDate = new Date(item.date).toISOString().split("T")[0]
                  return itemDate === date
                })
                .map((item) => {
                  const [startTime, endTime] = item.timeSlot.split("-")
                  return { startTime, endTime }
                })

              busyTimesMap[specialist.userId] = busyTimeRanges
            } else {
              busyTimesMap[specialist.userId] = []
            }
          } catch (error) {
            console.error(`Error fetching busy times for specialist ${specialist.userId}:`, error)
            busyTimesMap[specialist.userId] = []
          }
        }

        setAllSpecialistBusyTimes(busyTimesMap)
        setSpecialistBusyTimes([])
      }
    } catch (error) {
      console.error("Error fetching specialist busy times:", error)
      setErrorPopup("Failed to load specialist busy times. Please try again.")
      if (specialistId) {
        setSpecialistBusyTimes([])
      } else {
        setAllSpecialistBusyTimes({})
      }
    }
  }

  const handleRemoveService = (serviceId) => {
    const updatedServices = selectedServices.filter((service) => service.serviceId !== serviceId)
    setSelectedServices(updatedServices)
    localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices))
  }

  const handleClearAllServices = () => {
    setSelectedServices([])
    localStorage.removeItem("selectedServicesForBooking")
  }

  // Time utility functions
  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number)
    return hour * 60 + minute
  }

  const minutesToTime = (minutes) => {
    const hour = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0")
    const minute = (minutes % 60).toString().padStart(2, "0")
    return `${hour}:${minute}`
  }

  const isAnySpecialistAvailable = (time, totalDuration) => {
    if (!bookingDate || totalDuration === 0 || specialists.length === 0) return { available: true }

    const startMinutes = timeToMinutes(time)
    const endMinutes = startMinutes + totalDuration

    if (selectedSpecialist) {
      for (const busyRange of specialistBusyTimes) {
        const busyStartMinutes = timeToMinutes(busyRange.startTime)
        const busyEndMinutes = timeToMinutes(busyRange.endTime)

        if (
          (startMinutes > busyStartMinutes && startMinutes < busyEndMinutes) ||
          (endMinutes > busyStartMinutes && endMinutes <= busyEndMinutes) ||
          (startMinutes <= busyStartMinutes && endMinutes > busyStartMinutes)
        ) {
          return {
            available: false,
            conflict: `Time slot ${time} to ${minutesToTime(endMinutes)} conflicts with busy range ${busyRange.startTime}-${busyRange.endTime}`,
          }
        }
      }
      return { available: true }
    }

    // When no specialist is selected, check all specialists
    return specialists.some((specialist) => {
      const busyTimeRanges = allSpecialistBusyTimes[specialist.userId] || []
      for (const busyRange of busyTimeRanges) {
        const busyStartMinutes = timeToMinutes(busyRange.startTime)
        const busyEndMinutes = timeToMinutes(busyRange.endTime)

        if (
          (startMinutes > busyStartMinutes && startMinutes < busyEndMinutes) ||
          (endMinutes > busyStartMinutes && endMinutes <= busyEndMinutes) ||
          (startMinutes <= busyStartMinutes && endMinutes > busyStartMinutes)
        ) {
          return false
        }
      }
      return true
    })
      ? { available: true }
      : { available: false }
  }

  const isTimeSlotAvailable = (time) => {
    if (!bookingDate) return true
    const now = new Date()
    const selectedDate = new Date(bookingDate)
    const isToday = selectedDate.toDateString() === now.toDateString()
    if (!isToday) return true

    const [hour, minute] = time.split(":")
    const selectedTime = new Date(bookingDate).setHours(hour, minute, 0, 0)
    return selectedTime >= now.getTime()
  }

  const checkBookingConflict = (bookingDate, startTime, services) => {
    // This would need to be implemented with actual booking data
    return false
  }

  const handleConfirmBooking = async () => {
    if (!bookingDate || !startTime) {
      setErrorPopup("Please select a booking date and start time.")
      return
    }

    if (isBooking) {
      setErrorPopup("Booking in progress... Please wait.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setErrorPopup("No token found. Please login again.")
      return
    }

    if (checkBookingConflict(bookingDate, startTime, selectedServices)) {
      setErrorPopup("You already have a booking at this time.")
      return
    }

    const bookingData = {
      specialistId: selectedSpecialist ? Number(selectedSpecialist) : null,
      bookingDate,
      startTime,
      serviceIds: selectedServices.map((service) => Number(service.serviceId)),
    }

    setIsBooking(true)
    setErrorPopup("")

    try {
      const response = await axios.post(
        "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      const newBookingId = response.data.bookingId

      // Save selected services to localStorage for this booking
      const storedServicesKey = `selectedServicesForBooking_${newBookingId}`
      localStorage.setItem(storedServicesKey, JSON.stringify(selectedServices))

      onConfirmBooking({
        services: [...selectedServices],
        bookingDate,
        startTime,
        totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0),
      })

      setSelectedServices([])
      localStorage.removeItem("selectedServicesForBooking")
      setBookingDate("")
      setStartTime("")
      setSelectedSpecialist("")
      setRefresh((prev) => !prev)
    } catch (error) {
      console.error("Error creating booking:", error)
      const errorMessage = error.response?.data.message || "Failed to create booking. Please try again."
      const errorCode = error.response?.data.errorCode

      switch (errorCode) {
        case "UNAUTHENTICATED":
          setErrorPopup("Unauthorized: Please login again.")
          break
        case "SERVICE_NOT_EXISTED":
          setErrorPopup("One or more selected services do not exist.")
          break
        case "BOOKING_SERVICE_LIMIT_EXCEEDED":
          setErrorPopup("Too many services selected. Maximum limit exceeded.")
          break
        case "TIME_SLOT_OUTSIDE_WORKING_HOURS":
          setErrorPopup("Selected time is outside working hours (8:00 - 20:00).")
          break
        case "BOOKING_DATE_IN_PAST":
          setErrorPopup("Booking date cannot be in the past.")
          break
        case "BOOKING_DATE_TOO_FAR_IN_FUTURE":
          setErrorPopup("Booking date is too far in the future.")
          break
        case "BOOKING_TIME_CONFLICT":
          setErrorPopup("You already have a booking at this time.")
          break
        case "SKIN_THERAPIST_NOT_EXISTED":
          setErrorPopup("Selected specialist does not exist.")
          break
        case "SPECIALIST_NOT_ACTIVE":
          setErrorPopup("Selected specialist is not active.")
          break
        case "TIME_SLOT_UNAVAILABLE":
          setErrorPopup("Selected specialist is not available at this time.")
          break
        default:
          setErrorPopup(errorMessage)
      }
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-rose-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Selected Services</h2>
          </div>
          <motion.button
            onClick={handleClearAllServices}
            className="flex items-center px-3 py-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </motion.button>
        </div>
        <motion.div
          className="bg-rose-50 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ul className="divide-y divide-rose-100">
            <AnimatePresence>
              {selectedServices.map((service, idx) => (
                <motion.li
                  key={service.serviceId}
                  className="py-3 flex justify-between items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <p className="font-medium text-gray-800">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.duration} minutes</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="font-semibold text-rose-600">{formatVND(service.price)}</p>
                    <motion.button
                      onClick={() => handleRemoveService(service.serviceId)}
                      className="text-gray-500 hover:text-rose-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="mt-3 pt-3 border-t border-rose-100 flex justify-between">
            <p className="font-medium text-gray-800">Total</p>
            <p className="font-semibold text-rose-600">
              {formatVND(selectedServices.reduce((sum, service) => sum + service.price, 0))}
            </p>
          </div>
        </motion.div>

        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Date Selection */}
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
                        setBookingDate(date)
                        setIsCalendarOpen(false)
                        // Reset time when date changes
                        setStartTime("")
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specialist Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" /> Specialist
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

            {/* Time Selection */}
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

              <AnimatePresence>
                {isTimePickerOpen && (
                  <motion.div
                    className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-2">
                      {timeSlots.map((time) => {
                        const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)
                        const status = isAnySpecialistAvailable(time, totalDuration)
                        const isAvailable = status.available && isTimeSlotAvailable(time)

                        return (
                          <motion.button
                            key={time}
                            onClick={() => {
                              if (isAvailable) {
                                setStartTime(time)
                                setIsTimePickerOpen(false)
                              }
                            }}
                            disabled={!isAvailable}
                            className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              startTime === time
                                ? "bg-rose-600 text-white"
                                : !isAvailable
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                            whileHover={{
                              scale: !isAvailable ? 1 : 1.02,
                            }}
                            whileTap={{
                              scale: !isAvailable ? 1 : 0.98,
                            }}
                          >
                            {time}{" "}
                            {!isAvailable && status.conflict
                              ? `(${status.conflict.split(" ").pop()})`
                              : !isAvailable && "(Unavailable)"}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleConfirmBooking}
          disabled={isBooking}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
            isBooking ? "bg-gray-400 text-white cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
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
  )
}

export default BookingForm

