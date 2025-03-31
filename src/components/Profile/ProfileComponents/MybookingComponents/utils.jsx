import { CheckCircle, XCircle } from "lucide-react"

export const formatVND = (price) => {
  return price.toLocaleString("vi-VN") + " ₫"
}

export const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

export const formatTime = (timeString) => (timeString ? timeString : "N/A")

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800"
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800"
    case "IN_PROGRESS":
      return "bg-emerald-100 text-emerald-800"
    case "COMPLETED":
      return "bg-teal-100 text-teal-800"
    case "CANCELLED":
      return "bg-rose-100 text-rose-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getPaymentBadgeClass = (bookingStatus, paymentStatus) => {
  if (bookingStatus === "CANCELLED") {
    return "bg-rose-100 text-rose-800"
  }
  switch (paymentStatus) {
    case "PENDING":
      return "bg-amber-100 text-amber-800"
    case "SUCCESS":
      return "bg-emerald-100 text-emerald-800"
    case "FAILED":
      return "bg-rose-100 text-rose-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const formatPaymentStatus = (bookingStatus, paymentStatus) => {
  if (bookingStatus === "CANCELLED") {
    return (
      <span className="flex items-center">
        <XCircle className="w-4 h-4 text-red-600 mr-1" /> Failed
      </span>
    )
  }
  switch (paymentStatus) {
    case "SUCCESS":
      return (
        <span className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-600 mr-1" /> Success
        </span>
      )
    case "FAILED":
      return (
        <span className="flex items-center">
          <XCircle className="w-4 h-4 text-red-600 mr-1" /> Failed
        </span>
      )
    case "PENDING":
      return "Pending"
    default:
      return paymentStatus || "N/A"
  }
}

