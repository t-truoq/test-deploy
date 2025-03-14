import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  "https://a66f-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app";

// Hook để fetch bookings
export const useFetchBookings = (refresh, navigate, setErrorPopup) => {
  const [bookings, setBookings] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [feedbackData, setFeedbackData] = useState({});
  const [feedbackResponses, setFeedbackResponses] = useState({});

  useEffect(() => {
    console.log("useFetchBookings useEffect triggered with refresh:", refresh); // Log khi useEffect chạy
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        console.log("Fetching bookings with token:", token); // Log token
        const response = await axios.get(`${API_BASE_URL}/api/bookings/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });

        console.log("API response:", response.data); // Log dữ liệu trả về
        if (Array.isArray(response.data)) {
          const sortedBookings = [...response.data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.bookingDate);
            const dateB = new Date(b.createdAt || b.bookingDate);
            return dateB - dateA;
          });

          const feedbackStatusMap = {};
          const feedbackDataMap = {};
          const feedbackResponsesMap = {};

          for (const booking of sortedBookings) {
            try {
              const feedbackResponse = await axios.get(
                `${API_BASE_URL}/api/feedbacks/booking/${booking.bookingId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                  },
                }
              );
              feedbackResponsesMap[booking.bookingId] = feedbackResponse.data;
              const hasFeedback =
                Array.isArray(feedbackResponse.data) &&
                feedbackResponse.data.length > 0;
              feedbackStatusMap[booking.bookingId] = hasFeedback;

              if (hasFeedback) {
                const feedbackData = feedbackResponse.data[0];
                feedbackDataMap[booking.bookingId] = {
                  rating: Math.min(Math.max(feedbackData.rating || 0, 0), 5),
                  comment: feedbackData.comment || "",
                };
              }
            } catch (error) {
              console.error(
                `Error fetching feedback for booking ${booking.bookingId}:`,
                error
              );
              feedbackStatusMap[booking.bookingId] = false;
              feedbackResponsesMap[booking.bookingId] = [];
            }
          }

          setFeedbackStatus(feedbackStatusMap);
          setFeedbackData(feedbackDataMap);
          setFeedbackResponses(feedbackResponsesMap);
          setBookings(sortedBookings);
          console.log("Bookings updated:", sortedBookings); // Log sau khi cập nhật
        } else {
          throw new Error(
            "Invalid response format: Expected an array of bookings"
          );
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          console.log("Error response:", error.response.data); // Log chi tiết lỗi
          if (error.response.status === 401) {
            setErrorPopup("Unauthorized: Please login again.");
            setTimeout(() => navigate("/login"), 2000);
          } else if (error.response.status === 403) {
            setErrorPopup(
              "You do not have permission to access your bookings."
            );
          } else if (error.response.status === 404) {
            setErrorPopup("No bookings found.");
          } else {
            setErrorPopup(
              error.response.data.message ||
                "Failed to load bookings. Please try again."
            );
          }
        } else if (error.request) {
          setErrorPopup(
            "Unable to connect to server. CORS issue or server error. Please try again."
          );
        } else {
          setErrorPopup(
            error.message || "Failed to load bookings. Please try again."
          );
        }
        setBookings([]);
      }
    };

    fetchBookings();
  }, [refresh, navigate, setErrorPopup]);

  return {
    bookings,
    feedbackStatus,
    feedbackData,
    feedbackResponses,
    setFeedbackResponses,
    setFeedbackStatus,
    setFeedbackData,
  };
};

// Hook để fetch specialists
export const useFetchSpecialists = (setErrorPopup) => {
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          `${API_BASE_URL}/api/users/specialists/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          setSpecialists(response.data);
        } else {
          throw new Error(
            "Invalid response format: Expected an array of specialists"
          );
        }
      } catch (error) {
        console.error("Error fetching specialists:", error);
        setErrorPopup("Failed to load specialists. Please try again.");
        setSpecialists([]);
      }
    };

    fetchSpecialists();
  }, [setErrorPopup]);

  return specialists;
};

// Hook để fetch specialist schedule
export const useFetchSpecialistSchedule = (
  specialistId,
  date,
  setErrorPopup
) => {
  const [specialistSchedule, setSpecialistSchedule] = useState([]);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);

  useEffect(() => {
    if (!specialistId || !date) {
      setSpecialistSchedule([]);
      return;
    }

    const fetchSpecialistSchedule = async () => {
      setIsScheduleLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          `${API_BASE_URL}/api/schedules/${specialistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            params: { date },
          }
        );

        if (Array.isArray(response.data)) {
          setSpecialistSchedule(response.data);
        } else {
          throw new Error(
            "Invalid response format: Expected an array of schedules"
          );
        }
      } catch (error) {
        console.error("Error fetching specialist schedule:", error);
        setErrorPopup("Failed to load specialist schedule. Please try again.");
        setSpecialistSchedule([]);
      } finally {
        setIsScheduleLoading(false);
      }
    };

    fetchSpecialistSchedule();
  }, [specialistId, date, setErrorPopup]);

  return { specialistSchedule, isScheduleLoading };
};

// Hàm fetch booking details
export const fetchBookingDetails = async (
  bookingId,
  bookings,
  specialists,
  feedbackResponses,
  setFeedbackResponses,
  setFeedbackStatus,
  setFeedbackData,
  setErrorPopup,
  navigate
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorPopup("No token found. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return null;
    }

    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) {
      setErrorPopup("Booking not found.");
      return null;
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/bookings/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      }
    );

    const bookingData = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    const storedServicesKey = `selectedServicesForBooking_${bookingId}`;
    const storedServices = localStorage.getItem(storedServicesKey);
    const storedServicesMap = new Map();
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices)) {
          parsedServices.forEach((service) => {
            storedServicesMap.set(service.name, {
              duration: Number(service.duration) || 0,
              price: Number(service.price) || 0,
            });
          });
        }
      } catch (error) {
        console.error("Error parsing stored services:", error);
      }
    }

    let services = [];
    if (bookingData.serviceNames && Array.isArray(bookingData.serviceNames)) {
      services = bookingData.serviceNames.map((name, index) => {
        const storedService = storedServicesMap.get(name);

        const duration =
          bookingData.serviceDurations && bookingData.serviceDurations[name]
            ? Number(bookingData.serviceDurations[name])
            : storedService?.duration || 0;

        const priceFromAPI =
          bookingData.servicePrices && bookingData.servicePrices[name]
            ? Number(bookingData.servicePrices[name])
            : null;
        const priceFromStored = storedService?.price;
        let price;
        if (priceFromAPI != null) {
          price = priceFromAPI;
        } else if (priceFromStored != null) {
          price = priceFromStored;
        } else if (
          bookingData.totalPrice != null &&
          Number(bookingData.totalPrice) > 0
        ) {
          price =
            bookingData.serviceNames.length === 1
              ? Number(bookingData.totalPrice)
              : Number(bookingData.totalPrice) /
                (bookingData.serviceNames.length || 1);
        } else {
          price = 0;
        }

        return {
          id: index + 1,
          name,
          duration,
          price,
        };
      });
    }

    const specialistId =
      bookingData.specialistId || booking.specialistId || null;
    const specialistFromList = specialists.find(
      (spec) => spec.userId === specialistId
    );
    const specialist = specialistFromList || {
      name: bookingData.specialistName || "Not assigned",
      userId: specialistId || 0,
      specialization: bookingData.specialization || "Skin Therapist",
    };

    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0
    );

    let feedback = { rating: 0, comment: "" };
    let feedbackResponseData = feedbackResponses[bookingId];

    if (!feedbackResponseData) {
      try {
        const feedbackResponse = await axios.get(
          `${API_BASE_URL}/api/feedbacks/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );
        feedbackResponseData = feedbackResponse.data;

        setFeedbackResponses((prev) => ({
          ...prev,
          [bookingId]: feedbackResponseData,
        }));
      } catch (feedbackError) {
        console.error(
          `Error fetching feedback for booking ${bookingId}:`,
          feedbackError
        );
        feedbackResponseData = [];
      }
    }

    if (
      Array.isArray(feedbackResponseData) &&
      feedbackResponseData.length > 0
    ) {
      const feedbackData = feedbackResponseData[0];
      feedback = {
        rating: Math.min(Math.max(feedbackData.rating || 0, 0), 5),
        comment: feedbackData.comment || "",
      };
      setFeedbackStatus((prev) => ({
        ...prev,
        [bookingId]: true,
      }));
    }
    setFeedbackData((prev) => ({ ...prev, [bookingId]: feedback }));

    return {
      ...booking,
      services,
      specialist,
      totalDuration,
      totalPrice: Number(bookingData.totalPrice) || booking.totalPrice || 0,
      feedback,
    };
  } catch (error) {
    console.error("Error fetching booking details:", error);
    setErrorPopup("Failed to fetch booking details. Please try again.");
    return null;
  }
};
