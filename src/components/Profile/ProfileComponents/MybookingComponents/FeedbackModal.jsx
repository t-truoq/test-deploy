"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, RefreshCw } from "lucide-react"
import axios from "axios"

const FeedbackModal = ({ booking, onClose, onSubmit, setFeedbackNotification }) => {
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  useEffect(() => {
    // Reset state when a new booking is selected
    setFeedbackRating(0)
    setFeedbackComment("")
    setIsSubmittingFeedback(false)
  }, [booking])

  const handleSubmitFeedback = async () => {
    if (!feedbackRating || feedbackRating < 1 || feedbackRating > 5) {
      setFeedbackNotification({
        message: "Please select a rating between 1 and 5.",
        isSuccess: false,
        show: true,
      })
      return
    }

    if (!feedbackComment.trim()) {
      setFeedbackNotification({
        message: "Please enter a comment.",
        isSuccess: false,
        show: true,
      })
      return
    }

    setIsSubmittingFeedback(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setFeedbackNotification({
          message: "No token found. Please login again.",
          isSuccess: false,
          show: true,
        })
        return
      }

      const feedbackData = {
        bookingId: booking.bookingId,
        rating: feedbackRating,
        comment: feedbackComment,
      }

      const response = await axios.post(
        "http://localhost:8080/api/feedbacks",
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 200 || response.status === 201) {
        onSubmit(feedbackRating, feedbackComment)
      } else {
        throw new Error("Failed to save feedback to server.")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      if (error.response?.status === 400 && error.response?.data.message === "feedback already exist") {
        setFeedbackNotification({
          message: "You have already submitted feedback for this booking.",
          isSuccess: false,
          show: true,
        })
        onClose()
      } else {
        setFeedbackNotification({
          message: error.response?.data.message || "Failed to submit feedback. Please try again.",
          isSuccess: false,
          show: true,
        })
      }
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9500] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Submit Feedback</h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-rose-600"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1
                return (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => setFeedbackRating(starValue)}
                    onMouseEnter={() => setFeedbackRating(starValue)}
                    onMouseLeave={() => setFeedbackRating(feedbackRating)}
                    className={`text-3xl cursor-pointer transition-colors duration-200 ${
                      starValue <= feedbackRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ★
                  </motion.button>
                )
              })}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {feedbackRating === 0
                ? "Select a rating"
                : feedbackRating === 1
                  ? "1 - Poor"
                  : feedbackRating === 2
                    ? "2 - Fair"
                    : feedbackRating === 3
                      ? "3 - Good"
                      : feedbackRating === 4
                        ? "4 - Very Good"
                        : "5 - Excellent"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Share your experience..."
            />
          </div>
          <motion.button
            onClick={handleSubmitFeedback}
            disabled={isSubmittingFeedback}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isSubmittingFeedback
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-rose-600 text-white hover:bg-rose-700"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmittingFeedback ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FeedbackModal

