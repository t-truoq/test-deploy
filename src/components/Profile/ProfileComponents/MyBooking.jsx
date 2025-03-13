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
  const [paymentNotification, setPaymentNotification] = useState({
    message: "",
    isSuccess: false,
    show: false,
  });

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

        const response = await axios.get(
          "https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/bookings/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

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
                `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/feedbacks/booking/${booking.bookingId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(
                `Feedback response for booking ${booking.bookingId}:`,
                feedbackResponse.data
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
        } else {
          throw new Error(
            "Invalid response format: Expected an array of bookings"
          );
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
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
        setBookings([]); // Đặt bookings về mảng rỗng nếu có lỗi
      }
    };

    const fetchSpecialists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          "https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/users/specialists/active",
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
      if (booking.status === "CANCELLED") return false; // Loại bỏ kiểm tra bookingId === 1
      const existingDate = new Date(booking.bookingDate)
        .toISOString()
        .split("T")[0];
      const existingTimeSlot = booking.timeSlot;
      return existingDate === bookingDate && existingTimeSlot === timeSlot;
    });
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
      specialistId: selectedSpecialist ? Number(selectedSpecialist) : null,
      bookingDate,
      startTime,
      serviceIds: selectedServices.map((service) => Number(service.serviceId)),
    };

    console.log("Booking data to be sent:", bookingData);

    setIsBooking(true);
    setErrorPopup("");

    try {
      const response = await axios.post(
        "https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/bookings",
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
        `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/bookings/${bookingId}`,
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
      console.log(
        "Full booking data from API:",
        JSON.stringify(bookingData, null, 2)
      );

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

          console.log(
            `Service ${
              index + 1
            }: name=${name}, duration=${duration}, price=${price}`
          );

          return {
            id: index + 1,
            name,
            duration,
            price,
          };
        });
      } else {
        console.warn("No serviceNames found in bookingData:", bookingData);
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
            `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/feedbacks/booking/${bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
              },
            }
          );
          console.log(
            "Feedback response data:",
            JSON.stringify(feedbackResponse.data, null, 2)
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
  // Hàm định dạng giá tiền VND với dấu phân cách hàng nghìn
  const formatVND = (price) => {
    return price.toLocaleString("vi-VN") + " ₫"; // Định dạng theo kiểu Việt Nam
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBooking(null);
    setBookingDetails(null);
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

      const amount = Math.round(selectedBooking.totalPrice);
      const orderInfo = `Booking-${selectedBooking.bookingId}`;

      const paymentData = { amount, orderInfo };

      console.log("Payment data to be sent:", paymentData);

      const response = await axios.post(
        "https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/v1/vnpay/create-payment",
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
        setErrorPopup(
          "Payment URL not received from server or payment creation failed."
        );
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setErrorPopup(
        error.response?.data.message ||
          "Failed to initiate payment. Please try again."
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackRating || feedbackRating < 1 || feedbackRating > 5) {
      setErrorPopup("Please select a rating between 1 and 5.");
      return;
    }

    if (!feedbackComment.trim()) {
      setErrorPopup("Please enter a comment.");
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorPopup("No token found. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const feedbackData = {
        bookingId: selectedBooking.bookingId,
        rating: feedbackRating,
        comment: feedbackComment,
      };

      const response = await axios.post(
        "https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/feedbacks",
        feedbackData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Feedback post response:", response.data);

      if (response.status === 200 || response.status === 201) {
        const feedbackResponse = await axios.get(
          `https://2477-2405-4802-8132-b860-581a-3b2c-b3b4-7b4c.ngrok-free.app/api/feedbacks/booking/${selectedBooking.bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );
        console.log(
          "Feedback fetch response:",
          JSON.stringify(feedbackResponse.data, null, 2)
        );

        let updatedFeedback = {
          rating: feedbackRating,
          comment: feedbackComment,
        };
        if (
          Array.isArray(feedbackResponse.data) &&
          feedbackResponse.data.length > 0
        ) {
          const feedbackData = feedbackResponse.data[0];
          updatedFeedback = {
            rating: Math.min(
              Math.max(feedbackData.rating || feedbackRating, 0),
              5
            ),
            comment: feedbackData.comment || feedbackComment,
          };
        }

        setFeedbackStatus((prev) => ({
          ...prev,
          [selectedBooking.bookingId]: true,
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
        setErrorPopup("Feedback submitted successfully!");
        setTimeout(() => setErrorPopup(""), 2000);

        setRefresh((prev) => !prev);
      } else {
        throw new Error("Failed to save feedback to server.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data.message === "feedback already exist"
      ) {
        setErrorPopup("You have already submitted feedback for this booking.");
        setFeedbackStatus((prev) => ({
          ...prev,
          [selectedBooking.bookingId]: true,
        }));
        setIsFeedbackPopupOpen(false);
      } else {
        setErrorPopup(
          error.response?.data.message ||
            error.message ||
            "Failed to submit feedback. Please try again or contact support."
        );
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const closeErrorPopup = () => setErrorPopup("");
  const handleOpenFeedback = (booking) => {
    setSelectedBooking(booking);
    setIsFeedbackPopupOpen(true);
  };
  useEffect(() => {
    const hasShownNotification = localStorage.getItem(
      "paymentNotificationShown"
    );
    if (hasShownNotification) {
      setPaymentNotification((prev) => ({ ...prev, show: false }));
    }

    const token = searchParams.get("token");
    const status = searchParams.get("status");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token received and saved:", token);
    }

    if (status) {
      if (status === "success" && !hasShownNotification) {
        setPaymentNotification({
          message: "Payment successful!",
          isSuccess: true,
          show: true,
        });
        localStorage.setItem("paymentNotificationShown", "true"); // Đánh dấu đã hiển thị
      } else if (status === "failed" && !hasShownNotification) {
        setPaymentNotification({
          message: "Payment failed. Please try again.",
          isSuccess: false,
          show: true,
        });
        localStorage.setItem("paymentNotificationShown", "true"); // Đánh dấu đã hiển thị
      }
      setRefresh((prev) => !prev);
    }
  }, [searchParams]);

  const closePaymentNotification = () => {
    setPaymentNotification((prev) => ({ ...prev, show: false }));
    localStorage.setItem("paymentNotificationShown", "true"); // Đánh dấu đã đóng thủ công
  };

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

  const getPaymentBadgeClass = (status) => {
    switch (status) {
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
                          ${formatVND(service.price)}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" /> Booking Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" /> Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      min="08:00"
                      max="20:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 inline mr-1" /> Specialist
                      (Optional)
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
                                booking.paymentStatus
                              )}`}
                            >
                              {booking.paymentStatus}
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
                      <motion.button
                        onClick={() => handleViewDetails(booking)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </motion.button>
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
                      {bookingDetails.paymentStatus === "PENDING" &&
                        selectedBooking.status !== "CANCELLED" && (
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
                      (feedbackStatus[selectedBooking.bookingId] === true ? (
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
