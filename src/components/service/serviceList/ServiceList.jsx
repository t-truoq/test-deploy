"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import ServiceCard from "./components/ServiceCard/ServiceCard"
import ServiceSearch from "./components/ServiceSearch"
import BookingSummaryPanel from "./components/ServiceCard/BookingSummaryPanel"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, ChevronUp, Home, Sparkles, Package, ShoppingBag, X } from "lucide-react"

// Login Required Modal Component
const LoginRequiredModal = ({ isOpen, onClose, onLogin, action }) => {
  if (!isOpen) return null

  const getActionText = () => {
    switch (action) {
      case "booking":
        return "book services"
      case "detail":
        return "view service details"
      case "wishlist":
        return "add to wishlist"
      default:
        return "continue"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-pink-50 mb-6">
                <svg
                  className="h-8 w-8 text-[#A10550]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 mb-3">Login Required</h3>
              <p className="text-gray-600 mb-8">
                You need to be logged in to {getActionText()}. Would you like to login now?
              </p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={onLogin}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#A10550] hover:bg-[#800440] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ServiceList = () => {
  const navigate = useNavigate()
  const [selectedServices, setSelectedServices] = useState([])
  const [recommendedServices, setRecommendedServices] = useState([])
  const [allServices, setAllServices] = useState([])
  const [filteredRecommendedServices, setFilteredRecommendedServices] = useState([])
  const [filteredAllServices, setFilteredAllServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [wishlist, setWishlist] = useState([])
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [redirectAction, setRedirectAction] = useState("")
  const [serviceForDetail, setServiceForDetail] = useState(null)
  const [skinTypeResult, setSkinTypeResult] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100000000])
  const [durationRange, setDurationRange] = useState([0, 240])
  const [sortOption, setSortOption] = useState("recommended")
  const [showBookingPanel, setShowBookingPanel] = useState(false)
  const [columns, setColumns] = useState(3) // Default to 3 columns (desktop)

  const isLoggedIn = useCallback(() => !!localStorage.getItem("token"), [])

  // Determine the number of columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1); // Mobile: 1 cột
      } else if (window.innerWidth < 768) {
        setColumns(2); // Tablet: 2 cột
      } else {
        // Desktop: 4 cột nếu panel đóng, 3 cột nếu panel mở
        setColumns(showBookingPanel ? 3 : 4);
      }
    };
  
    updateColumns(); // Gọi lần đầu
    window.addEventListener("resize", updateColumns); // Cập nhật khi resize
  
    return () => window.removeEventListener("resize", updateColumns); // Dọn dẹp
  }, [showBookingPanel]);

  const getServicesToDisplay = (services) => {
    const rows = showBookingPanel ? 3 : 4; // 3 hàng khi panel mở, 4 hàng khi đóng
    const servicesPerPage = columns * rows; // Tổng số dịch vụ hiển thị
    return services.slice(0, servicesPerPage); // Cắt mảng để giới hạn số dịch vụ
  };

  const redirectToLogin = () => {
    if (redirectAction === "detail" && serviceForDetail) {
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          action: "detail",
          serviceId: serviceForDetail.serviceId,
        }),
      )
    } else if (redirectAction === "booking") {
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          action: "booking",
          selectedServices: selectedServices.map((s) => s.serviceId),
        }),
      )
    }
    navigate("/login")
  }

  const handleLoginRequired = (action, service = null) => {
    setRedirectAction(action)
    if (service) setServiceForDetail(service)
    setShowLoginModal(true)
  }

  useEffect(() => {
    const result = localStorage.getItem("skinTypeResult")
    if (result) setSkinTypeResult(JSON.parse(result))
  }, [])

  const handleSelect = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("booking")
      return
    }
    const serviceWithDuration = { ...service, duration: service.duration }
    setSelectedServices((prev) => {
      const updatedServices = prev.some((s) => s.serviceId === service.serviceId)
        ? prev.filter((s) => s.serviceId !== service.serviceId)
        : [...prev, serviceWithDuration]
      localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices))
      return updatedServices
    })

    // Show booking panel when a service is selected
    if (!showBookingPanel) {
      setShowBookingPanel(true)
    }
  }

  const handleRemoveService = (serviceId) => {
    setSelectedServices((prev) => {
      const updatedServices = prev.filter((s) => s.serviceId !== serviceId);
      if (updatedServices.length === 0) {
        localStorage.removeItem("selectedServicesForBooking");
        setShowBookingPanel(false); // Đóng panel nếu không còn dịch vụ nào
      } else {
        localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices));
      }
      return updatedServices;
    });
  };
  
  const handleClearAllServices = () => {
    setSelectedServices([]);
    localStorage.removeItem("selectedServicesForBooking");
    setShowBookingPanel(false); // Đóng panel khi xóa tất cả dịch vụ
  };

  const handleViewDetails = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("detail", service)
      return
    }
    navigate(`/services/${service.serviceId}`)
  }

  const handleAddToWishlist = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("wishlist")
      return
    }
    let updatedWishlist = [...wishlist]
    const isInWishlist = updatedWishlist.some((item) => item.serviceId === service.serviceId)
    if (isInWishlist) {
      updatedWishlist = updatedWishlist.filter((item) => item.serviceId !== service.serviceId)
    } else {
      updatedWishlist.push(service)
    }
    Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 })
    setWishlist(updatedWishlist)
  }

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredRecommendedServices(recommendedServices)
      setFilteredAllServices(allServices)
      return
    }
    const filteredRecommended = recommendedServices.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const filteredAll = allServices.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRecommendedServices(filteredRecommended)
    setFilteredAllServices(filteredAll)
  }

  const handleBookServices = () => {
    if (!isLoggedIn()) {
      handleLoginRequired("booking")
      return
    }
    if (selectedServices.length === 0) {
      setBookingError("Please select at least one service to book.")
      return
    }
    try {
      const selectedServiceIds = selectedServices.map((service) => service.serviceId)
      localStorage.setItem("selectedServiceIdsForBooking", JSON.stringify(selectedServiceIds))
      setBookingSuccess("Proceeding to booking confirmation...")
      setBookingError("")
      navigate("/mybooking")
      setTimeout(() => {
        setSelectedServices([])
        localStorage.removeItem("selectedServicesForBooking")
      }, 1000)
    } catch (error) {
      console.error("Error preparing booking:", error)
      setBookingError("Failed to prepare booking. Please try again.")
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    if (!allServices.length) return

    // Apply price and duration filters
    const filteredAll = allServices.filter(
      (service) =>
        service.price >= priceRange[0] &&
        service.price <= priceRange[1] &&
        service.duration >= durationRange[0] &&
        service.duration <= durationRange[1],
    )

    const filteredRecommended = recommendedServices.filter(
      (service) =>
        service.price >= priceRange[0] &&
        service.price <= priceRange[1] &&
        service.duration >= durationRange[0] &&
        service.duration <= durationRange[1],
    )

    // Apply sorting
    const sortServices = (services) => {
      switch (sortOption) {
        case "price-low":
          return [...services].sort((a, b) => a.price - b.price)
        case "price-high":
          return [...services].sort((a, b) => b.price - a.price)
        case "duration-low":
          return [...services].sort((a, b) => a.duration - b.duration)
        case "duration-high":
          return [...services].sort((a, b) => b.duration - a.duration)
        case "name":
          return [...services].sort((a, b) => a.name.localeCompare(b.name))
        default:
          return services
      }
    }

    setFilteredAllServices(sortServices(filteredAll))
    setFilteredRecommendedServices(sortServices(filteredRecommended))
  }, [allServices, recommendedServices, priceRange, durationRange, sortOption])

  useEffect(() => {
    if (hasFetched) return

    const savedWishlist = Cookies.get("wishlist")
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        if (Array.isArray(parsedWishlist)) setWishlist(parsedWishlist)
        else setWishlist([])
      } catch (error) {
        console.error("Error parsing wishlist from cookie:", error)
        setWishlist([])
      }
    }

    const fetchRecommendedServices = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Please login before doing quiz !.")

        const response = await axios.get("https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/quiz/recommended-services", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        })

        console.log("Recommended services data:", response.data)
        if (Array.isArray(response.data)) {
          setRecommendedServices(response.data)
          setFilteredRecommendedServices(response.data)
        } else {
          throw new Error("Recommended services data is not an array")
        }
      } catch (error) {
        console.error("Error fetching recommended services:", error)
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.")
            setTimeout(() => navigate("/login"), 2000)
          } else if (error.response.status === 400 || error.response.status === 404) {
            setError("No recommended services found. Please complete the skin type quiz.")
          } else {
            setError(error.response.data.message || "Failed to load recommended services.")
          }
        } else if (error.request) {
          setError("Please login before take a quiz !")
        } else {
          setError(error.message || "Failed to load recommended services. Please try again.")
        }
      }
    }

    const fetchAllServices = async () => {
      try {
        const response = await axios.get("https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/services", {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })

        console.log("All services data:", response.data)
        if (Array.isArray(response.data)) {
          setAllServices(response.data)
          setFilteredAllServices(response.data)
        } else {
          throw new Error("All services data is not an array")
        }
      } catch (error) {
        console.error("Error fetching all services:", error)
        if (error.response) {
          if (error.response.status === 404) {
            setError("No services found.")
          } else {
            setError(error.response.data.message || "Failed to load services. Please try again.")
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.")
        } else {
          setError(error.message || "Failed to load services. Please try again.")
        }
      }
    }

    Promise.all([fetchRecommendedServices(), fetchAllServices()]).finally(() => {
      setLoading(false)
      setHasFetched(true)
    })
  }, [navigate, hasFetched, isLoggedIn])

  useEffect(() => {
    if (!skinTypeResult || hasFetched) return

    const fetchRecommendedServices = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token found. Please login again.")

        const response = await axios.get("https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/quiz/recommended-services", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        })

        console.log("Recommended services data:", response.data)
        if (Array.isArray(response.data)) {
          setRecommendedServices(response.data)
          setFilteredRecommendedServices(response.data)
        } else {
          throw new Error("Recommended services data is not an array")
        }
      } catch (error) {
        console.error("Error fetching recommended services:", error)
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.")
            setTimeout(() => navigate("/login"), 2000)
          } else if (error.response.status === 400 || error.response.status === 404) {
            setError("No recommended services found. Please complete the skin type quiz.")
          } else {
            setError(error.response.data.message || "Failed to load recommended services. Please try again.")
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.")
        } else {
          setError(error.message || "Failed to load recommended services. Please try again.")
        }
      }
    }

    fetchRecommendedServices()
  }, [skinTypeResult, navigate, hasFetched])

  useEffect(() => {
    const storedServices = localStorage.getItem("selectedServicesForBooking");
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices);
          setShowBookingPanel(true); // Mở panel nếu có dịch vụ được chọn
        }
      } catch (error) {
        console.error("Error parsing stored services:", error);
      }
    }
  }, []);

  useEffect(() => {
    const redirectInfo = localStorage.getItem("redirectAfterLogin")
    if (redirectInfo && isLoggedIn()) {
      try {
        const { action, serviceId, selectedServices: savedServices } = JSON.parse(redirectInfo)
        if (action === "detail" && serviceId) {
          navigate(`/services/${serviceId}`)
        } else if (action === "booking" && savedServices?.length > 0) {
          const servicesToSelect = allServices.filter((s) => savedServices.includes(s.serviceId))
          if (servicesToSelect.length > 0) {
            setSelectedServices(servicesToSelect)
            localStorage.setItem("selectedServicesForBooking", JSON.stringify(servicesToSelect))
            setShowBookingPanel(true)
          }
        }
        localStorage.removeItem("redirectAfterLogin")
      } catch (error) {
        console.error("Error processing redirect after login:", error)
      }
    }
  }, [allServices, isLoggedIn, navigate])

  useEffect(() => {
    if (!isLoggedIn() && selectedServices.length > 0) {
      handleClearAllServices()
    }
  }, [isLoggedIn, selectedServices.length])

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const toggleBookingPanel = () => {
    setShowBookingPanel(false); // Đóng panel
    setSelectedServices([]); // Xóa tất cả dịch vụ đã chọn
    localStorage.removeItem("selectedServicesForBooking"); // Xóa dữ liệu trong localStorage
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#A10550] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-xl text-gray-600">Loading luxury services...</p>
        </motion.div>
      </div>
    )
  }

  if (error && !allServices.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <motion.div
          className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 text-gray-500"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </motion.div>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/quiz"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#A10550] to-[#800440] text-white rounded-lg hover:from-[#800440] hover:to-[#A10550] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Take the Skin Type Quiz
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-[2020px] mx-auto bg-white relative">
      {/* Floating Booking Summary Button */}
      {selectedServices.length > 0 && !showBookingPanel && (
        <motion.button
          onClick={toggleBookingPanel}
          className="fixed bottom-6 right-6 z-40 bg-[#A10550] text-white rounded-full p-4 shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-white text-[#A10550] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {selectedServices.length}
          </span>
        </motion.button>
      )}

      {/* Main Content */}
      <div className="px-6 sm:px-8 lg:px-12">
        {/* Header - Reduced padding */}
        <motion.div
          className="py-4 sm:py-6 text-center border-b border-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Our <span className="text-[#A10550]">Luxury</span> Services
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Indulge in our premium beauty treatments designed to enhance your natural beauty and provide a truly
            luxurious experience.
          </p>
        </motion.div>

        {/* Navigation and Search - Reduced spacing */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 space-y-2 sm:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <nav>
            <ol className="flex items-center space-x-2 text-sm sm:text-base">
              <li>
                <Link to="/" className="text-gray-600 hover:text-[#A10550] transition-colors flex items-center">
                  <Home className="w-4 h-4 mr-1" /> Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-[#A10550] font-medium">Services</li>
            </ol>
          </nav>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-64 lg:w-80">
              <ServiceSearch onSearch={handleSearch} />
            </div>
            <motion.button
              onClick={toggleFilters}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Panel - Adjusted margins */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="w-full">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="1000000000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full accent-[#A10550]"
                    />
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Duration (minutes)</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="240"
                      step="15"
                      value={durationRange[1]}
                      onChange={(e) => setDurationRange([durationRange[0], Number.parseInt(e.target.value)])}
                      className="w-full accent-[#A10550]"
                    />
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                      {durationRange[0]} - ${durationRange[1]} min
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A10550]"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration-low">Duration: Shortest First</option>
                    <option value="duration-high">Duration: Longest First</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Messages - Reduced margins */}
        <AnimatePresence>
          {(bookingError || bookingSuccess) && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {bookingError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                  {bookingError}
                </div>
              )}
              {bookingSuccess && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
                  {bookingSuccess}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with Flexible Layout */}
        <div className="flex flex-col relative">
          {/* Services Content - Full width when booking panel is hidden */}
          <div className={`w-full ${showBookingPanel ? "pr-0 lg:pr-[350px]" : ""} transition-all duration-300`}>
            {/* Recommended Services */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold mb-4 text-gray-800 relative inline-flex items-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#A10550] mr-2" />
                Recommended For You
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#A10550]"></span>
              </h2>

              {error ? (
                <motion.div
                  className="text-center py-12 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xl text-gray-600 mb-6">{error}</p>
                  <Link
                    to="/quiz"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-[#A10550] to-[#800440] text-white rounded-lg hover:from-[#800440] hover:to-[#A10550] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Take the Skin Type Quiz
                  </Link>
                </motion.div>
              ) : recommendedServices.length === 0 ? (
                <motion.div
                  className="text-center py-12 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xl text-gray-600 mb-6">
                    No recommended services available. Please complete the skin type quiz to see personalized
                    recommendations.
                  </p>
                  <Link
                    to="/quiz"
                    className="inline-block px-8 py-4 bg-[#A10550] text-white rounded-lg hover:bg-[#800440] transition-colors duration-300 font-medium"
                  >
                    Take the Quiz
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.2,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {/* 3-column grid with no gaps */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-0`}>
                    {getServicesToDisplay(filteredRecommendedServices).map((service) => (
                      <div key={`recommended-${service.serviceId}`} className="p-0">
                        <ServiceCard
                          service={service}
                          onSelect={handleSelect}
                          onViewDetails={() => handleViewDetails(service)}
                          isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
                          onAddToWishlist={handleAddToWishlist}
                          isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
                          variant="recommended"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* All Services */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold mb-4 text-gray-800 relative inline-flex items-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#A10550] mr-2" />
                All Services
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#A10550]"></span>
              </h2>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {/* 3-column grid with no gaps */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-0`}>
                  {getServicesToDisplay(filteredAllServices).map((service) => (
                    <div key={`all-${service.serviceId}`} className="p-0">
                      <ServiceCard
                        service={service}
                        onSelect={handleSelect}
                        onViewDetails={() => handleViewDetails(service)}
                        isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
                        onAddToWishlist={handleAddToWishlist}
                        isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
                        variant="all"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Booking Summary Panel - Slide in from right */}
          <AnimatePresence>
            {showBookingPanel && (
              <motion.div
                className="fixed top-0 right-0 bottom-0 w-full sm:w-[350px] z-40 overflow-y-auto"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-4 bg-[#A10550] text-white flex justify-between items-center">
                  <h3 className="text-lg font-medium flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Booking Summary
                  </h3>
                  <button
                    onClick={toggleBookingPanel}
                    className="p-1 hover:bg-[#800440] rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <BookingSummaryPanel
                    selectedServices={selectedServices}
                    onRemoveService={handleRemoveService}
                    onBookServices={handleBookServices}
                    onClearAllServices={handleClearAllServices}
                    isLoggedIn={isLoggedIn()}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={redirectToLogin}
        action={redirectAction}
      />
    </div>
  )
}

export default ServiceList