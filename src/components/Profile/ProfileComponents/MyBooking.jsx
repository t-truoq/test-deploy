import { useEffect } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import BookingList from "../ProfileComponents/MybookingComponents/BookingList"
import BookingForm from "../ProfileComponents/MybookingComponents/BookingForm"
import BookingConfirmation from "../ProfileComponents/MybookingComponents/BookingConfirmation"
import BookingDetailsModal from "../ProfileComponents/MybookingComponents/BookingDetailsModal"
import FeedbackModal from "../ProfileComponents/MybookingComponents/FeedbackModal"
import ErrorPopup from "../ProfileComponents/MybookingComponents/ErrorPopup"
import NotificationPopup from "../ProfileComponents/MybookingComponents/NotificationPopup"
import { fetchBookings, fetchSpecialists, fetchFeedbacks } from "../ProfileComponents/MybookingComponents/apiService"
import { useBookingState } from "../ProfileComponents/MybookingComponents/useBookingState"
import BookingHeader from "../ProfileComponents/MybookingComponents/BookingHeader"

const MyBooking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const {
    bookings,
    setBookings,
    selectedServices,
    setSelectedServices,
    confirmedBooking,
    setConfirmedBooking,
    specialists,
    setSpecialists,
    errorPopup,
    setErrorPopup,
    paymentNotification,
    setPaymentNotification,
    feedbackNotification,
    setFeedbackNotification,
    selectedBooking,
    setSelectedBooking,
    bookingDetails,
    setBookingDetails,
    feedbackStatus,
    setFeedbackStatus,
    feedbackData,
    setFeedbackData,
    feedbackResponses,
    setFeedbackResponses,
    isPopupOpen,
    setIsPopupOpen,
    isFeedbackPopupOpen,
    setIsFeedbackPopupOpen,
    loading,
    setLoading,
    refresh,
    setRefresh,
  } = useBookingState()

  useEffect(() => {
    const storedServices = localStorage.getItem("selectedServicesForBooking")
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices)
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices)
        }
      } catch (error) {
        console.error("Error parsing selectedServices from localStorage:", error)
        setSelectedServices([])
      }
    }

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token found. Please login again.")

        const [bookingsData, specialistsData, feedbacksData] = await Promise.all([
          fetchBookings(token),
          fetchSpecialists(token),
          fetchFeedbacks(token),
        ])

        // Process bookings
        const sortedBookings = [...bookingsData].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.bookingDate)
          const dateB = new Date(b.createdAt || b.bookingDate)
          return dateB - dateA
        })
        setBookings(sortedBookings)

        // Process specialists
        setSpecialists(specialistsData)

        // Process feedbacks
        const feedbackStatusMap = {}
        const feedbackDataMap = {}
        const feedbackResponsesMap = {}

        for (const booking of sortedBookings) {
          const feedback = feedbacksData.find((f) => f.bookingId === booking.bookingId)

          feedbackResponsesMap[booking.bookingId] = feedback || {
            feedbackStatus: "NOT_FEEDBACK",
            rating: 0,
            comment: "",
          }

          // Check if feedback exists and has FEEDBACK_DONE status
          const hasFeedback = feedback && feedback.feedbackStatus === "FEEDBACK_DONE"
          feedbackStatusMap[booking.bookingId] = hasFeedback

          if (hasFeedback) {
            feedbackDataMap[booking.bookingId] = {
              rating: Math.min(Math.max(feedback.rating || 0, 0), 5),
              comment: feedback.comment || "",
            }
          }
        }

        setFeedbackStatus(feedbackStatusMap)
        setFeedbackData(feedbackDataMap)
        setFeedbackResponses(feedbackResponsesMap)
      } catch (error) {
        console.error("Error loading data:", error)
        handleApiError(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate, refresh])

  useEffect(() => {
    const token = searchParams.get("token")
    const status = searchParams.get("status")

    if (token) {
      localStorage.setItem("token", token)
    }

    if (status === "success") {
      setPaymentNotification({
        message: "Payment successful!",
        isSuccess: true,
        show: true,
      })
      setRefresh((prev) => !prev)
    } else if (status === "failed") {
      setPaymentNotification({
        message: "Payment failed. Please try again.",
        isSuccess: false,
        show: true,
      })
      setRefresh((prev) => !prev)
    }

    // Auto-hide notification after 5 seconds
    if (status) {
      const timer = setTimeout(() => {
        setPaymentNotification((prev) => ({ ...prev, show: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  useEffect(() => {
    setRefresh((prev) => !prev)
  }, [location])

  const handleApiError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        setErrorPopup("Unauthorized: Please login again.")
        setTimeout(() => navigate("/login"), 2000)
      } else if (error.response.status === 403) {
        setErrorPopup("You do not have permission to access your bookings.")
      } else if (error.response.status === 404) {
        setErrorPopup("No bookings found.")
      } else {
        setErrorPopup(error.response.data.message || "Failed to load bookings. Please try again.")
      }
    } else if (error.request) {
      setErrorPopup("Please login before booking.")
    } else {
      setErrorPopup(error.message || "Failed to load bookings. Please try again.")
    }
  }

  const handleOpenFeedback = (booking) => {
    setSelectedBooking(booking)
    setIsFeedbackPopupOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-rose-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumbs and Header */}
        <BookingHeader />

        {/* Notification Popups */}
        {paymentNotification.show && (
          <NotificationPopup
            message={paymentNotification.message}
            isSuccess={paymentNotification.isSuccess}
            onClose={() => setPaymentNotification((prev) => ({ ...prev, show: false }))}
          />
        )}

        {feedbackNotification.show && (
          <NotificationPopup
            message={feedbackNotification.message}
            isSuccess={feedbackNotification.isSuccess}
            onClose={() => setFeedbackNotification((prev) => ({ ...prev, show: false }))}
          />
        )}

        {/* Booking Confirmation */}
        {confirmedBooking && <BookingConfirmation booking={confirmedBooking} />}

        {/* Booking Form */}
        {selectedServices.length > 0 && (
          <BookingForm
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            specialists={specialists}
            onConfirmBooking={setConfirmedBooking}
            setErrorPopup={setErrorPopup}
            setRefresh={setRefresh}
          />
        )}

        {/* Booking List */}
        <BookingList
          bookings={bookings}
          feedbackStatus={feedbackStatus}
          onViewDetails={(booking) => {
            setSelectedBooking(booking)
            setBookingDetails(booking)
            setIsPopupOpen(true)
          }}
          onOpenFeedback={handleOpenFeedback}
          setRefresh={setRefresh}
          setErrorPopup={setErrorPopup}
          navigate={navigate}
          setIsPopupOpen={setIsPopupOpen}
        />

        {/* Modals */}
        {errorPopup && <ErrorPopup message={errorPopup} onClose={() => setErrorPopup("")} />}

        {isPopupOpen && selectedBooking && bookingDetails && (
          <BookingDetailsModal
            booking={selectedBooking}
            bookingDetails={bookingDetails}
            feedbackStatus={feedbackStatus}
            onClose={() => {
              setIsPopupOpen(false)
              setSelectedBooking(null)
              setBookingDetails(null)
            }}
            onOpenFeedback={handleOpenFeedback}
            setRefresh={setRefresh}
            setErrorPopup={setErrorPopup}
            navigate={navigate}
          />
        )}

        {isFeedbackPopupOpen && selectedBooking && (
          <FeedbackModal
            booking={selectedBooking}
            onClose={() => setIsFeedbackPopupOpen(false)}
            onSubmit={(rating, comment) => {
              // Submit feedback logic
              setFeedbackStatus((prev) => ({
                ...prev,
                [selectedBooking.bookingId]: true,
              }))
              setFeedbackData((prev) => ({
                ...prev,
                [selectedBooking.bookingId]: { rating, comment },
              }))
              setIsFeedbackPopupOpen(false)
              setFeedbackNotification({
                message: "Feedback submitted successfully!",
                isSuccess: true,
                show: true,
              })
              setRefresh((prev) => !prev)
            }}
            setFeedbackNotification={setFeedbackNotification}
          />
        )}
      </div>
    </motion.div>
  )
}

export default MyBooking

