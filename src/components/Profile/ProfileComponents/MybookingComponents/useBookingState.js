"use client"

import { useState } from "react"

export const useBookingState = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorPopup, setErrorPopup] = useState("")
  const [refresh, setRefresh] = useState(false)
  const [searchDate, setSearchDate] = useState("")
  const [selectedServices, setSelectedServices] = useState([])
  const [bookingDate, setBookingDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [selectedSpecialist, setSelectedSpecialist] = useState("")
  const [specialists, setSpecialists] = useState([])
  const [isBooking, setIsBooking] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [isPaying, setIsPaying] = useState(false)
  const [isPaymentSuccessPopupOpen, setIsPaymentSuccessPopupOpen] = useState(false)
  const [isFeedbackPopupOpen, setIsFeedbackPopupOpen] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackStatus, setFeedbackStatus] = useState({})
  const [feedbackData, setFeedbackData] = useState({})
  const [feedbackResponses, setFeedbackResponses] = useState({})
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState({})
  const [paymentNotification, setPaymentNotification] = useState({
    message: "",
    isSuccess: false,
    show: false,
  })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [feedbackNotification, setFeedbackNotification] = useState({
    message: "",
    isSuccess: false,
    show: false,
  })
  const [specialistBusyTimes, setSpecialistBusyTimes] = useState([])
  const [allSpecialistBusyTimes, setAllSpecialistBusyTimes] = useState({})

  return {
    bookings,
    setBookings,
    loading,
    setLoading,
    errorPopup,
    setErrorPopup,
    refresh,
    setRefresh,
    searchDate,
    setSearchDate,
    selectedServices,
    setSelectedServices,
    bookingDate,
    setBookingDate,
    startTime,
    setStartTime,
    selectedSpecialist,
    setSelectedSpecialist,
    specialists,
    setSpecialists,
    isBooking,
    setIsBooking,
    confirmedBooking,
    setConfirmedBooking,
    isPopupOpen,
    setIsPopupOpen,
    selectedBooking,
    setSelectedBooking,
    bookingDetails,
    setBookingDetails,
    isPaying,
    setIsPaying,
    isPaymentSuccessPopupOpen,
    setIsPaymentSuccessPopupOpen,
    isFeedbackPopupOpen,
    setIsFeedbackPopupOpen,
    feedbackRating,
    setFeedbackRating,
    feedbackComment,
    setFeedbackComment,
    isSubmittingFeedback,
    setIsSubmittingFeedback,
    feedbackStatus,
    setFeedbackStatus,
    feedbackData,
    setFeedbackData,
    feedbackResponses,
    setFeedbackResponses,
    isTimePickerOpen,
    setIsTimePickerOpen,
    isCancelling,
    setIsCancelling,
    paymentNotification,
    setPaymentNotification,
    isCalendarOpen,
    setIsCalendarOpen,
    feedbackNotification,
    setFeedbackNotification,
    specialistBusyTimes,
    setSpecialistBusyTimes,
    allSpecialistBusyTimes,
    setAllSpecialistBusyTimes,
  }
}

