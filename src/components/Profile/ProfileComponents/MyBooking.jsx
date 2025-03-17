"use client";

import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Home,
  Package,
  RefreshCw,
  User,
  Eye,
  DollarSign,
  Timer,
  X,
  CreditCardIcon,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarMyBooking from "../../Profile/ProfileComponents/MybookingComponents/CalendarMyBooking"; // Adjust the import path as needed
import { format, addHours } from "date-fns"; // Chỉ cần format và addHours

const MyBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorPopup, setErrorPopup] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [specialists, setSpecialists] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentSuccessPopupOpen, setIsPaymentSuccessPopupOpen] =
    useState(false);
  const [isFeedbackPopupOpen, setIsFeedbackPopupOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [feedbackData, setFeedbackData] = useState({});
  const [feedbackResponses, setFeedbackResponses] = useState({});
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState({}); // Object để lưu trạng thái hủy theo bookingId
  const [paymentNotification, setPaymentNotification] = useState({
    message: "",
    isSuccess: false,
    show: false,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to toggle calendar visibility
  const [feedbackNotification, setFeedbackNotification] = useState({
    message: "",
    isSuccess: false,
    show: false,
  });
  const [specialistBusyTimes, setSpecialistBusyTimes] = useState([]);
  const [allSpecialistBusyTimes, setAllSpecialistBusyTimes] = useState({});

  // Generate time slots (08:00 to 20:00, 30-minute intervals)
  const timeSlots = [];
  for (let hour = 8; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    const storedServiceIds = localStorage.getItem(
      "selectedServiceIdsForBooking"
    );
    console.log(
      "Retrieved selectedServiceIds from localStorage:",
      storedServiceIds
    );

    const storedServices = localStorage.getItem("selectedServicesForBooking");
    console.log(
      "Retrieved selectedServices from localStorage:",
      storedServices
    );
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices);
        } else {
          setSelectedServices([]);
        }
      } catch (error) {
        console.error(
          "Error parsing selectedServices from localStorage:",
          error
        );
        setSelectedServices([]);
      }
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        // Lấy danh sách bookings
        console.log("Fetching bookings from /api/bookings/user...");
        const bookingsResponse = await axios.get(
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Bookings response:", bookingsResponse.data);

        if (!Array.isArray(bookingsResponse.data)) {
          throw new Error(
            "Invalid response format: Expected an array of bookings"
          );
        }

        const sortedBookings = [...bookingsResponse.data].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.bookingDate);
          const dateB = new Date(b.createdAt || b.bookingDate);
          return dateB - dateA;
        });

        console.log("Sorted bookings:", sortedBookings);

        // Lấy toàn bộ feedback trong một lần gọi
        console.log("Fetching feedbacks from /api/feedbacks...");
        const feedbackResponse = await axios.get(
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Feedbacks response:", feedbackResponse.data);

        const feedbacks = Array.isArray(feedbackResponse.data)
          ? feedbackResponse.data
          : [];
        console.log("Feedbacks after validation:", feedbacks);

        // Xử lý dữ liệu feedback
        const feedbackStatusMap = {};
        const feedbackDataMap = {};
        const feedbackResponsesMap = {};

        console.log("Processing feedbacks for each booking...");
        for (const booking of sortedBookings) {
          const feedback = feedbacks.find(
            (f) => f.bookingId === booking.bookingId
          ) || {
            feedbackStatus: "NOT_FEEDBACK",
            rating: 0,
            comment: "",
          };

          console.log(`Feedback for booking ${booking.bookingId}:`, feedback);

          feedbackResponsesMap[booking.bookingId] = feedback;
          const hasFeedback = feedback.feedbackStatus === "FEEDBACK_DONE";
          feedbackStatusMap[booking.bookingId] = hasFeedback;

          if (hasFeedback) {
            feedbackDataMap[booking.bookingId] = {
              rating: Math.min(Math.max(feedback.rating || 0, 0), 5),
              comment: feedback.comment || "",
            };
          }
        }

        console.log("Feedback status map:", feedbackStatusMap);
        console.log("Feedback data map:", feedbackDataMap);
        console.log("Feedback responses map:", feedbackResponsesMap);

        setFeedbackStatus(feedbackStatusMap);
        setFeedbackData(feedbackDataMap);
        setFeedbackResponses(feedbackResponsesMap);
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings or feedbacks:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
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
          console.error(
            "No response received (CORS or network issue):",
            error.request
          );
          setErrorPopup(
            "Unable to connect to server. CORS issue or server error. Please try again."
          );
        } else {
          console.error("Error message:", error.message);
          setErrorPopup(
            error.message || "Failed to load bookings. Please try again."
          );
        }
        setBookings([]);
      }
    };

    const fetchSpecialists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users/specialists/active",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch specialists response:", response.data);
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

    Promise.all([fetchBookings(), fetchSpecialists()]).finally(() =>
      setLoading(false)
    );
  }, [navigate, refresh]);

  useEffect(() => {
    const token = searchParams.get("token");
    const status = searchParams.get("status");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token received and saved:", token);
    }

    if (status === "success") {
      setPaymentNotification({
        message: "Payment successful!",
        isSuccess: true,
        show: true,
      });
      setRefresh((prev) => !prev);
    } else if (status === "failed") {
      setPaymentNotification({
        message: "Payment failed. Please try again.",
        isSuccess: false,
        show: true,
      });
      setRefresh((prev) => !prev);
    }
  }, [searchParams]);

  useEffect(() => {
    setRefresh((prev) => !prev);
  }, [location]);

  const filteredBookings = searchDate
    ? bookings.filter((booking) => {
        const bookingDateFormatted = new Date(booking.bookingDate)
          .toISOString()
          .split("T")[0];
        return bookingDateFormatted === searchDate;
      })
    : bookings;

  const checkBookingConflict = (bookingDate, startTime, services) => {
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0
    );
    const startDateTime = new Date(`${bookingDate}T${startTime}:00`);
    const endDateTime = new Date(
      startDateTime.getTime() + totalDuration * 60000
    );
    const timeSlot = `${startTime}-${endDateTime.toTimeString().slice(0, 5)}`;

    return bookings.some((booking) => {
      if (booking.status === "CANCELLED") return false;
      const existingDate = new Date(booking.bookingDate)
        .toISOString()
        .split("T")[0];
      const existingTimeSlot = booking.timeSlot;
      return existingDate === bookingDate && existingTimeSlot === timeSlot;
    });
  };

  const fetchSpecialistBusyTimes = async (specialistId, date) => {
    if (!date) {
      setSpecialistBusyTimes([]);
      setAllSpecialistBusyTimes({});
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      if (specialistId) {
        const response = await axios.get(
          `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/schedules/${specialistId}/busy`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            params: { date },
          }
        );

        console.log(
          "Full response data from API for specialist",
          specialistId,
          ":",
          response.data
        );

        if (Array.isArray(response.data)) {
          const busyTimeRanges = response.data
            .filter((item) => {
              const itemDate = new Date(item.date).toISOString().split("T")[0];
              return itemDate === date;
            })
            .map((item) => {
              const [startTime, endTime] = item.timeSlot.split("-");
              return { startTime, endTime };
            });

          console.log(
            "Filtered busy time ranges for specialist",
            specialistId,
            ":",
            busyTimeRanges
          );
          setSpecialistBusyTimes(busyTimeRanges);
          setAllSpecialistBusyTimes((prev) => ({
            ...prev,
            [specialistId]: busyTimeRanges,
          }));
        } else {
          throw new Error("Invalid response format: Expected an array");
        }
      } else {
        const busyTimesMap = {};
        for (const specialist of specialists) {
          try {
            const response = await axios.get(
              `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/schedules/${specialist.userId}/busy`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "ngrok-skip-browser-warning": "true",
                  "Content-Type": "application/json",
                },
                params: { date },
              }
            );

            console.log(
              `Full response data for specialist ${specialist.userId}:`,
              response.data
            );

            if (Array.isArray(response.data)) {
              const busyTimeRanges = response.data
                .filter((item) => {
                  const itemDate = new Date(item.date)
                    .toISOString()
                    .split("T")[0];
                  return itemDate === date;
                })
                .map((item) => {
                  const [startTime, endTime] = item.timeSlot.split("-");
                  return { startTime, endTime };
                });

              busyTimesMap[specialist.userId] = busyTimeRanges;
            } else {
              busyTimesMap[specialist.userId] = [];
            }
          } catch (error) {
            console.error(
              `Error fetching busy times for specialist ${specialist.userId}:`,
              error
            );
            busyTimesMap[specialist.userId] = [];
          }
        }

        console.log(
          "All specialist busy times for date",
          date,
          ":",
          busyTimesMap
        );
        setAllSpecialistBusyTimes(busyTimesMap);
        setSpecialistBusyTimes([]);
      }
    } catch (error) {
      console.error("Error fetching specialist busy times:", error);
      if (error.response && error.response.status === 404) {
        setErrorPopup(
          "Specialist schedule not found. Please try another specialist."
        );
      } else {
        setErrorPopup(
          "Failed to load specialist busy times. Please try again."
        );
      }
      if (specialistId) {
        setSpecialistBusyTimes([]);
      } else {
        setAllSpecialistBusyTimes({});
      }
    }
  };

  useEffect(() => {
    if (bookingDate) {
      fetchSpecialistBusyTimes(selectedSpecialist, bookingDate);
    } else {
      setSpecialistBusyTimes([]);
      setAllSpecialistBusyTimes({});
    }
  }, [selectedSpecialist, bookingDate, specialists]); // Thêm specialists vào dependency để cập nhật khi danh sách specialists thay đổi

  const handleCancelBooking = async (bookingId) => {
    console.log("Starting cancellation for bookingId:", bookingId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const booking = bookings.find((b) => b.bookingId === bookingId);
      if (!booking) {
        setErrorPopup("Booking not found.");
        return;
      }

      if (bookingId === 1) {
        setErrorPopup("Cannot cancel the default booking.");
        return;
      }

      const [startTime] = booking.timeSlot.split("-");
      const bookingStartDateTime = new Date(
        `${booking.bookingDate}T${startTime}:00`
      );
      const currentDateTime = new Date();
      const timeDifference =
        (bookingStartDateTime - currentDateTime) / (1000 * 60 * 60);

      if (timeDifference < 24) {
        setErrorPopup(
          "Cannot cancel booking less than 24 hours before start time."
        );
        return;
      }

      // Cập nhật trạng thái hủy
      setIsCancelling((prev) => ({ ...prev, [bookingId]: true }));
      console.log("isCancelling updated to true for bookingId:", bookingId);

      const response = await axios.post(
        `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.bookingId === bookingId
            ? { ...b, status: "CANCELLED", paymentStatus: "FAILED" }
            : b
        )
      );
      setRefresh((prev) => !prev);

      // Cập nhật selectedBooking nếu đang xem chi tiết
      if (selectedBooking && selectedBooking.bookingId === bookingId) {
        setSelectedBooking((prev) =>
          prev
            ? { ...prev, status: "CANCELLED", paymentStatus: "FAILED" }
            : null
        );
        setBookingDetails((prev) =>
          prev
            ? { ...prev, status: "CANCELLED", paymentStatus: "FAILED" }
            : null
        );
      }
      console.log("Cancellation successful for bookingId:", bookingId);
    } catch (error) {
      console.error("Error canceling booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorPopup("Unauthorized: Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 403) {
          setErrorPopup("You do not have permission to cancel this booking.");
        } else {
          setErrorPopup(
            error.response.data.message || "Failed to cancel booking."
          );
        }
      } else {
        setErrorPopup("Failed to cancel booking.");
      }
    } finally {
      console.log("Setting isCancelling to false for bookingId:", bookingId);
      setIsCancelling((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate || !startTime) {
      setErrorPopup("Please select a booking date and start time.");
      return;
    }

    if (isBooking) {
      setErrorPopup("Booking in progress... Please wait.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorPopup("No token found. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (checkBookingConflict(bookingDate, startTime, selectedServices)) {
      setErrorPopup("You already have a booking at this time.");
      return;
    }

    const bookingData = {
      specialistId: selectedSpecialist ? Number(selectedSpecialist) : null, // Gửi null nếu không chọn
      bookingDate,
      startTime,
      serviceIds: selectedServices.map((service) => Number(service.serviceId)),
    };

    console.log("Booking data to be sent:", bookingData);

    setIsBooking(true);
    setErrorPopup("");

    try {
      const response = await axios.post(
        "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking response:", response.data);
      const newBookingId = response.data.bookingId;

      console.log("Saving selectedServices to localStorage:", selectedServices);
      const storedServicesKey = `selectedServicesForBooking_${newBookingId}`;
      localStorage.setItem(storedServicesKey, JSON.stringify(selectedServices));
      console.log(`Saved to localStorage with key ${storedServicesKey}`);

      const savedData = localStorage.getItem(storedServicesKey);
      console.log(`Verified saved data: ${savedData}`);

      setConfirmedBooking({
        services: [...selectedServices],
        bookingDate,
        startTime,
        totalPrice: selectedServices.reduce(
          (sum, service) => sum + service.price,
          0
        ),
      });

      setSelectedServices([]);
      localStorage.removeItem("selectedServicesForBooking");
      setBookingDate("");
      setStartTime("");
      setSelectedSpecialist("");
      setRefresh((prev) => !prev);
      setErrorPopup("");
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage =
        error.response?.data.message ||
        "Failed to create booking. Please try again.";
      const errorCode = error.response?.data.errorCode;

      switch (errorCode) {
        case "UNAUTHENTICATED":
          setErrorPopup("Unauthorized: Please login again.");
          setTimeout(() => navigate("/login"), 2000);
          break;
        case "SERVICE_NOT_EXISTED":
          setErrorPopup("One or more selected services do not exist.");
          break;
        case "BOOKING_SERVICE_LIMIT_EXCEEDED":
          setErrorPopup("Too many services selected. Maximum limit exceeded.");
          break;
        case "TIME_SLOT_OUTSIDE_WORKING_HOURS":
          setErrorPopup(
            "Selected time is outside working hours (8:00 - 20:00)."
          );
          break;
        case "BOOKING_DATE_IN_PAST":
          setErrorPopup("Booking date cannot be in the past.");
          break;
        case "BOOKING_DATE_TOO_FAR_IN_FUTURE":
          setErrorPopup("Booking date is too far in the future.");
          break;
        case "BOOKING_TIME_CONFLICT":
          setErrorPopup("You already have a booking at this time.");
          break;
        case "SKIN_THERAPIST_NOT_EXISTED":
          setErrorPopup("Selected specialist does not exist.");
          break;
        case "SPECIALIST_NOT_ACTIVE":
          setErrorPopup("Selected specialist is not active.");
          break;
        case "TIME_SLOT_UNAVAILABLE":
          setErrorPopup("Selected specialist is not available at this time.");
          break;
        default:
          setErrorPopup(errorMessage);
      }
    } finally {
      setIsBooking(false);
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    const details = await fetchBookingDetails(booking.bookingId);
    if (details) {
      setBookingDetails(details);
      setIsPopupOpen(true);
    } else {
      setErrorPopup("Failed to load booking details. Please try again.");
    }
  };

  const fetchBookingDetails = async (bookingId) => {
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
        `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/bookings/${bookingId}`,
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

      // Lấy thông tin services (giữ nguyên logic hiện tại)
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
          const price =
            bookingData.servicePrices && bookingData.servicePrices[name]
              ? Number(bookingData.servicePrices[name])
              : storedService?.price || 0;

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
      const specialist = specialists.find(
        (spec) => spec.userId === specialistId
      ) || {
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
            `https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks/booking/${bookingId}`,
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
          feedbackResponseData = {
            feedbackStatus: "NOT_FEEDBACK",
            rating: 0,
            comment: "",
          };
        }
      }

      const feedbackData = Array.isArray(feedbackResponseData)
        ? feedbackResponseData[0]
        : feedbackResponseData;
      const hasFeedback = feedbackData?.feedbackStatus === "FEEDBACK_DONE";

      if (hasFeedback && feedbackData) {
        feedback = {
          rating: Math.min(Math.max(feedbackData.rating || 0, 0), 5),
          comment: feedbackData.comment || "",
        };
      }

      setFeedbackStatus((prev) => ({
        ...prev,
        [bookingId]: hasFeedback,
      }));
      setFeedbackData((prev) => ({
        ...prev,
        [bookingId]: feedback,
      }));

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

  const formatVND = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBooking(null);
    setBookingDetails(null);
  };

  const closePaymentNotification = () => {
    setPaymentNotification((prev) => ({ ...prev, show: false }));
    localStorage.setItem("paymentNotificationShown", "true");
  };

  const handlePayment = async () => {
    try {
      setIsPaying(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (!selectedBooking || !bookingDetails) {
        setErrorPopup("No booking selected for payment.");
        return;
      }

      if (!selectedBooking.checkInTime) {
        setErrorPopup("Please check-in before payment.");
        return;
      }

      const amount = Math.round(selectedBooking.totalPrice);
      const orderInfo = `Booking-${selectedBooking.bookingId}`;

      const paymentData = { amount, orderInfo };

      console.log("Payment data to be sent:", paymentData);

      const response = await axios.post(
        "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/v1/vnpay/create-payment",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment response:", response.data);

      if (response.data && response.data.code === 0 && response.data.result) {
        localStorage.setItem("lastPaidBookingId", selectedBooking.bookingId);
        window.location.href = response.data.result;
      } else {
        setErrorPopup("Payment URL not received or payment creation failed.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setErrorPopup(
        error.response?.data.message || "Failed to initiate payment."
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackRating || feedbackRating < 1 || feedbackRating > 5) {
      setFeedbackNotification({
        message: "Please select a rating between 1 and 5.",
        isSuccess: false,
        show: true,
      });
      return;
    }

    if (!feedbackComment.trim()) {
      setFeedbackNotification({
        message: "Please enter a comment.",
        isSuccess: false,
        show: true,
      });
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFeedbackNotification({
          message: "No token found. Please login again.",
          isSuccess: false,
          show: true,
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const feedbackData = {
        bookingId: selectedBooking.bookingId,
        rating: feedbackRating,
        comment: feedbackComment,
      };

      const response = await axios.post(
        "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks",
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const updatedFeedback = {
          rating: feedbackRating,
          comment: feedbackComment,
        };

        setFeedbackStatus((prev) => ({
          ...prev,
          [selectedBooking.bookingId]: true, // Cập nhật thành đã feedback
        }));
        setFeedbackData((prev) => ({
          ...prev,
          [selectedBooking.bookingId]: updatedFeedback,
        }));

        if (isPopupOpen && bookingDetails) {
          setBookingDetails((prev) => ({
            ...prev,
            feedback: updatedFeedback,
          }));
        }

        setIsFeedbackPopupOpen(false);
        setFeedbackRating(0);
        setFeedbackComment("");

        // Hiển thị thông báo thành công với feedbackNotification
        setFeedbackNotification({
          message: "Feedback submitted successfully!",
          isSuccess: true,
          show: true,
        });

        setRefresh((prev) => !prev);

        // Tự động ẩn thông báo sau 5 giây
        const timer = setTimeout(() => {
          setFeedbackNotification((prev) => ({ ...prev, show: false }));
        }, 5000);

        return () => clearTimeout(timer);
      } else {
        throw new Error("Failed to save feedback to server.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data.message === "feedback already exist"
      ) {
        setFeedbackNotification({
          message: "You have already submitted feedback for this booking.",
          isSuccess: false,
          show: true,
        });
        setFeedbackStatus((prev) => ({
          ...prev,
          [selectedBooking.bookingId]: true,
        }));
        setIsFeedbackPopupOpen(false);
      } else {
        setFeedbackNotification({
          message:
            error.response?.data.message ||
            "Failed to submit feedback. Please try again.",
          isSuccess: false,
          show: true,
        });
      }

      // Tự động ẩn thông báo sau 5 giây
      const timer = setTimeout(() => {
        setFeedbackNotification((prev) => ({ ...prev, show: false }));
      }, 5000);

      return () => clearTimeout(timer);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Hàm chuyển thời gian dạng "HH:mm" thành phút
  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  // Hàm chuyển phút thành thời gian dạng "HH:mm"
  const minutesToTime = (minutes) => {
    const hour = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const minute = (minutes % 60).toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  // Hàm kiểm tra xem có specialist nào rảnh không
  const isAnySpecialistAvailable = (time, totalDuration) => {
    if (!bookingDate || totalDuration === 0 || specialists.length === 0)
      return { available: true };

    const startMinutes = timeToMinutes(time);
    const endMinutes = startMinutes + totalDuration;

    if (selectedSpecialist) {
      for (const busyRange of specialistBusyTimes) {
        const busyStartMinutes = timeToMinutes(busyRange.startTime);
        const busyEndMinutes = timeToMinutes(busyRange.endTime);

        if (
          (startMinutes > busyStartMinutes && startMinutes < busyEndMinutes) || // Bắt đầu trong khoảng bận (không bao gồm thời gian kết thúc)
          (endMinutes > busyStartMinutes && endMinutes <= busyEndMinutes) || // Kết thúc trong khoảng bận
          (startMinutes <= busyStartMinutes && endMinutes > busyStartMinutes) // Bao phủ hoặc bắt đầu trước và kết thúc sau khoảng bận
        ) {
          return {
            available: false,
            conflict: `Time slot ${time} to ${minutesToTime(
              endMinutes
            )} conflicts with busy range ${busyRange.startTime}-${
              busyRange.endTime
            }`,
          };
        }
      }
      return { available: true };
    }

    // Khi không chọn specialist, kiểm tra tất cả specialists
    return specialists.some((specialist) => {
      const busyTimeRanges = allSpecialistBusyTimes[specialist.userId] || [];
      for (const busyRange of busyTimeRanges) {
        const busyStartMinutes = timeToMinutes(busyRange.startTime);
        const busyEndMinutes = timeToMinutes(busyRange.endTime);

        if (
          (startMinutes > busyStartMinutes && startMinutes < busyEndMinutes) ||
          (endMinutes > busyStartMinutes && endMinutes <= busyEndMinutes) ||
          (startMinutes <= busyStartMinutes && endMinutes > busyStartMinutes)
        ) {
          return false;
        }
      }
      return true;
    })
      ? { available: true }
      : { available: false };
  };

  const isTimeSlotAvailable = (time) => {
    if (!bookingDate) return true;
    const now = new Date();
    const selectedDate = new Date(bookingDate);
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (!isToday) return true;

    const [hour, minute] = time.split(":");
    const selectedTime = new Date(bookingDate).setHours(hour, minute, 0, 0);
    return selectedTime >= now.getTime();
  };

  const closeErrorPopup = () => setErrorPopup("");
  const handleOpenFeedback = (booking) => {
    setSelectedBooking(booking);
    setIsFeedbackPopupOpen(true);
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const status = searchParams.get("status");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token received and saved:", token);
    }

    // Xóa trạng thái đã hiển thị trước đó để đảm bảo thông báo xuất hiện
    localStorage.removeItem("paymentNotificationShown");

    if (status) {
      if (status === "success") {
        setPaymentNotification({
          message: "Payment successful!",
          isSuccess: true,
          show: true,
        });
      } else if (status === "failed") {
        setPaymentNotification({
          message: "Payment failed. Please try again.",
          isSuccess: false,
          show: true,
        });
      }

      // Tự động ẩn thông báo sau 5 giây
      const timer = setTimeout(() => {
        setPaymentNotification((prev) => ({ ...prev, show: false }));
        localStorage.setItem("paymentNotificationShown", "true");
      }, 5000);

      // Làm mới danh sách bookings
      setRefresh((prev) => !prev);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-emerald-100 text-emerald-800";
      case "COMPLETED":
        return "bg-teal-100 text-teal-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadgeClass = (bookingStatus, paymentStatus) => {
    if (bookingStatus === "CANCELLED") {
      return "bg-rose-100 text-rose-800";
    }
    switch (paymentStatus) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800";
      case "FAILED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPaymentStatus = (bookingStatus, paymentStatus) => {
    if (bookingStatus === "CANCELLED") {
      return (
        <span className="flex items-center">
          <XCircle className="w-4 h-4 text-red-600 mr-1" /> Failed
        </span>
      );
    }
    switch (paymentStatus) {
      case "SUCCESS":
        return (
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-1" /> Success
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center">
            <XCircle className="w-4 h-4 text-red-600 mr-1" /> Failed
          </span>
        );
      case "PENDING":
        return "Pending";
      default:
        return paymentStatus || "N/A";
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  const formatTime = (timeString) => (timeString ? timeString : "N/A");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-rose-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav
          className="py-4 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-rose-600 flex items-center"
              >
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-600 hover:text-rose-600 flex items-center"
              >
                <ChevronRight className="w-4 h-4 mr-1" /> Services
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-3 h-3" />
            </li>
            <li className="text-rose-600 font-medium">My Bookings</li>
          </ol>
        </motion.nav>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            View and manage all your service appointments
          </p>
        </motion.div>

        {paymentNotification.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              <div className="flex flex-col items-center">
                {paymentNotification.isSuccess ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                )}
                <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                  {paymentNotification.message}
                </p>
                <button
                  onClick={closePaymentNotification}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {feedbackNotification.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              <div className="flex flex-col items-center">
                {feedbackNotification.isSuccess ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                )}
                <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                  {feedbackNotification.message}
                </p>
                <button
                  onClick={() =>
                    setFeedbackNotification((prev) => ({
                      ...prev,
                      show: false,
                    }))
                  }
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {confirmedBooking && (
            <motion.div
              className="mb-8"
              variants={slideUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Booking Confirmed
                  </h2>
                </div>
                <motion.div
                  className="bg-green-50 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start mb-2">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(confirmedBooking.bookingDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium text-gray-800">
                        {formatTime(confirmedBooking.startTime)}
                      </p>
                    </div>
                  </div>
                  <ul className="divide-y divide-green-100">
                    {confirmedBooking.services.map((service, idx) => (
                      <motion.li
                        key={service.serviceId}
                        className="py-3 flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {service.duration} minutes
                          </p>
                        </div>
                        <p className="font-semibold text-green-600">
                          {formatVND(service.price)}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-green-100 flex justify-between">
                    <p className="font-medium text-gray-800">Total</p>
                    <p className="font-semibold text-green-600">
                      {formatVND(confirmedBooking.totalPrice)}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedServices.length > 0 && (
            <motion.div
              className="mb-8"
              variants={slideUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <Package className="w-5 h-5 text-rose-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Selected Services
                  </h2>
                </div>
                <motion.div
                  className="bg-rose-50 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ul className="divide-y divide-rose-100">
                    {selectedServices.map((service, idx) => (
                      <motion.li
                        key={service.serviceId}
                        className="py-3 flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {service.duration} minutes
                          </p>
                        </div>
                        <p className="font-semibold text-rose-600">
                          {formatVND(service.price)}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-rose-100 flex justify-between">
                    <p className="font-medium text-gray-800">Total</p>
                    <p className="font-semibold text-rose-600">
                      {formatVND(
                        selectedServices.reduce(
                          (sum, service) => sum + service.price,
                          0
                        )
                      )}
                    </p>
                  </div>
                </motion.div>

                <div className="space-y-4 mb-4">
                  {/* Row 1: Booking Date and Start Time */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Chọn ngày */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" /> Booking
                        Date
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
                                setBookingDate(date);
                                setIsCalendarOpen(false);
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Chọn chuyên gia */}
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
                          <option
                            key={specialist.userId}
                            value={specialist.userId}
                          >
                            {specialist.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Chọn giờ */}
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
                                const totalDuration = selectedServices.reduce(
                                  (sum, service) => sum + service.duration,
                                  0
                                );
                                const status = isAnySpecialistAvailable(
                                  time,
                                  totalDuration
                                );
                                const isAvailable =
                                  status.available && isTimeSlotAvailable(time);

                                return (
                                  <motion.button
                                    key={time}
                                    onClick={() => {
                                      if (isAvailable) {
                                        setStartTime(time);
                                        setIsTimePickerOpen(false);
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
                                );
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
                    isBooking
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-rose-600 text-white hover:bg-rose-700"
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
          )}
        </AnimatePresence>

        <motion.div
          className="mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-rose-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Filter by Date
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="date"
                  id="searchDate"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              {searchDate && (
                <motion.button
                  onClick={() => setSearchDate("")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Clear Filter
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {filteredBookings.length === 0 &&
        selectedServices.length === 0 &&
        !confirmedBooking ? (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any bookings yet.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="inline-flex items-center px-5 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Book a service now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredBookings.map((booking, index) => {
              const displayNumber = filteredBookings.length - index;
              return (
                <motion.div
                  key={booking.bookingId}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-rose-500 hover:shadow-lg transition-all duration-300"
                  variants={slideIn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1 * index, duration: 0.4 },
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">
                          Booking #{displayNumber}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium text-gray-800">
                                {formatDate(booking.bookingDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Time slot</p>
                              <p className="font-medium text-gray-800">
                                {formatTime(booking.timeSlot)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <CreditCard className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Total Price
                              </p>
                              <p className="font-medium text-gray-800">
                                {formatVND(booking.totalPrice) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Status
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                                booking.status,
                                booking.paymentStatus
                              )}`}
                            >
                              {formatPaymentStatus(
                                booking.status,
                                booking.paymentStatus
                              )}
                            </span>
                          </div>
                          {booking.checkInTime && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Check-in Time
                              </p>
                              <p className="font-medium text-gray-800">
                                {new Date(booking.checkInTime).toLocaleString()}
                              </p>
                            </div>
                          )}
                          {booking.checkOutTime && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Check-out Time
                              </p>
                              <p className="font-medium text-gray-800">
                                {new Date(
                                  booking.checkOutTime
                                ).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[140px]">
                      {booking.bookingId !== 1 &&
                        booking.status === "PENDING" && (
                          <button
                            onClick={() =>
                              handleCancelBooking(booking.bookingId)
                            }
                            disabled={isCancelling[booking.bookingId]} // Vô hiệu hóa nút khi đang hủy
                            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                              isCancelling[booking.bookingId]
                                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            }`}
                          >
                            {isCancelling[booking.bookingId] ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" /> Cancel
                              </>
                            )}
                          </button>
                        )}
                      <motion.button
                        onClick={() => handleViewDetails(booking)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </motion.button>
                      {/* Chỉ hiển thị nút Feedback nếu status là COMPLETED và chưa feedback */}
                      {booking.status === "COMPLETED" &&
                        !feedbackStatus[booking.bookingId] && (
                          <motion.button
                            onClick={() => handleOpenFeedback(booking)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                          </motion.button>
                        )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence>
          {errorPopup && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex flex-col items-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                  <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                    {errorPopup}
                  </p>
                  <motion.button
                    onClick={closeErrorPopup}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPaymentSuccessPopupOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                  </motion.div>
                  <p className="text-lg font-medium text-gray-800 mb-6 text-center">
                    Payment Successful!
                  </p>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Your booking has been successfully paid. Thank you!
                  </p>
                  <motion.button
                    onClick={() => setIsPaymentSuccessPopupOpen(false)}
                    className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPopupOpen && selectedBooking && bookingDetails && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <div className="w-full md:w-2/3 p-6 overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Booking Details
                    </h2>
                    <motion.button
                      onClick={closePopup}
                      className="text-gray-500 hover:text-rose-600"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {filteredBookings.findIndex(
                      (b) => b.bookingId === selectedBooking.bookingId
                    ) !== -1 && (
                      <span className="text-lg font-semibold text-gray-800">
                        Booking #
                        {filteredBookings.length -
                          filteredBookings.findIndex(
                            (b) => b.bookingId === selectedBooking.bookingId
                          )}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                  <motion.div
                    className="bg-rose-50 rounded-xl p-5 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(selectedBooking.bookingDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium text-gray-900">
                            {formatTime(selectedBooking.timeSlot)}
                          </p>
                        </div>
                      </div>
                      {bookingDetails.specialist && (
                        <div className="flex items-start">
                          <User className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Specialist</p>
                            <p className="font-medium text-gray-900">
                              {bookingDetails.specialist.name || "Not assigned"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {bookingDetails.specialist.specialization}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start">
                        <Timer className="w-5 h-5 text-rose-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Total Duration
                          </p>
                          <p className="font-medium text-gray-900">
                            {bookingDetails.totalDuration} minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-5 h-5 text-rose-600 mr-2" />{" "}
                      Services
                    </h3>
                    <motion.div
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ul className="divide-y divide-gray-200">
                        {bookingDetails.services.map((service, index) => (
                          <motion.li
                            key={index}
                            className="p-4 hover:bg-gray-50"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {service.name || `Service #${index + 1}`}
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                  <Timer className="w-4 h-4 mr-1 text-gray-400" />{" "}
                                  {service.duration || 0} minutes
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-rose-600">
                                  {formatVND(service.price)
                                    ? formatVND(service.price)
                                    : "0.00"}
                                </p>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
                        <p className="font-medium text-gray-800">Total</p>
                        <p className="font-bold text-rose-600 text-lg">
                          {formatVND(selectedBooking.totalPrice)}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  {bookingDetails.feedback &&
                    bookingDetails.feedback.rating > 0 && (
                      <motion.div
                        className="mb-6 bg-teal-50 rounded-xl p-5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <MessageSquare className="w-5 h-5 text-teal-600 mr-2" />{" "}
                          Your Feedback
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < bookingDetails.feedback.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          {bookingDetails.feedback.comment && (
                            <div>
                              <p className="text-sm text-gray-600">Comment</p>
                              <p className="font-medium text-gray-900">
                                {bookingDetails.feedback.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                </div>
                <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
                  {selectedBooking.status !== "CANCELLED" && (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <CreditCardIcon className="w-5 h-5 text-rose-600 mr-2" />{" "}
                        Payment
                      </h3>
                      <motion.div
                        className="bg-white rounded-xl shadow-sm p-4 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-600">Status</p>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(
                              bookingDetails.paymentStatus
                            )}`}
                          >
                            {bookingDetails.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-600">Method</p>
                          <p className="font-medium text-gray-800">VNPay</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <p className="font-medium text-gray-800">Total</p>
                          <p className="font-bold text-rose-600">
                            {formatVND(selectedBooking.totalPrice)}
                          </p>
                        </div>
                      </motion.div>
                      {(bookingDetails.paymentStatus === "PENDING" ||
                        bookingDetails.paymentStatus === "FAILED") && (
                        <>
                          {bookingDetails.paymentStatus === "FAILED" && (
                            <motion.div
                              className="mb-4 p-3 bg-rose-50 rounded-lg flex items-center"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <AlertCircle className="w-5 h-5 text-rose-600 mr-2" />
                              <p className="text-sm text-rose-700">
                                Payment failed. Please try again.
                              </p>
                            </motion.div>
                          )}
                          <motion.button
                            onClick={handlePayment}
                            disabled={isPaying}
                            className={`w-full flex items-center justify-center py-3 rounded-lg font-medium transition-colors ${
                              isPaying
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-rose-600 text-white hover:bg-rose-700"
                            } mb-4`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {isPaying ? (
                              <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />{" "}
                                Processing...
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-5 h-5 mr-2" /> Pay Now
                              </>
                            )}
                          </motion.button>
                        </>
                      )}
                    </>
                  )}
                  {selectedBooking.status === "CANCELLED" && (
                    <motion.div
                      className="bg-rose-50 rounded-xl p-4 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-rose-600 mr-2" />
                        <h3 className="text-lg font-semibold text-rose-700">
                          Booking Cancelled
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-2">
                        This booking has been cancelled and no payment is
                        required.
                      </p>
                    </motion.div>
                  )}

                  <div className="space-y-3 mt-auto">
                    {selectedBooking.status === "COMPLETED" &&
                      (feedbackStatus[selectedBooking.bookingId] ? (
                        <motion.div
                          className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" /> Thank you
                          for your feedback
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => setIsFeedbackPopupOpen(true)}
                          className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                        </motion.button>
                      ))}
                    <motion.button
                      onClick={closePopup}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFeedbackPopupOpen && selectedBooking && (
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
                  <h2 className="text-xl font-semibold text-gray-900">
                    Submit Feedback
                  </h2>
                  <motion.button
                    onClick={() => setIsFeedbackPopupOpen(false)}
                    className="text-gray-500 hover:text-rose-600"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5)
                    </label>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, index) => {
                        const starValue = index + 1;
                        return (
                          <motion.button
                            key={index}
                            type="button"
                            onClick={() => setFeedbackRating(starValue)}
                            onMouseEnter={() => setFeedbackRating(starValue)}
                            onMouseLeave={() =>
                              setFeedbackRating(feedbackRating)
                            }
                            className={`text-3xl cursor-pointer transition-colors duration-200 ${
                              starValue <= feedbackRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ★
                          </motion.button>
                        );
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
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
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MyBooking;

