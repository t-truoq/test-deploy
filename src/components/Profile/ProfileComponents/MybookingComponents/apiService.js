import axios from "axios"

const API_BASE_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app"

export const fetchBookings = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/bookings/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format: Expected an array of bookings")
    }

    return response.data
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw error
  }
}

export const fetchSpecialists = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/specialists/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format: Expected an array of specialists")
    }

    return response.data
  } catch (error) {
    console.error("Error fetching specialists:", error)
    throw error
  }
}

export const fetchFeedbacks = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/feedbacks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    return []
  }
}

export const fetchBookingDetails = async (bookingId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching booking details:", error)
    throw error
  }
}

export const cancelBooking = async (bookingId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/bookings/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      },
    )

    return response.data
  } catch (error) {
    console.error("Error canceling booking:", error)
    throw error
  }
}

export const createBooking = async (bookingData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const submitFeedback = async (feedbackData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/feedbacks`, feedbackData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw error
  }
}

export const createPayment = async (paymentData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/vnpay/create-payment`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

