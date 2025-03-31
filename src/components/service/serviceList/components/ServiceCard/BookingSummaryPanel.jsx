"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Clock, DollarSign, ShoppingBag, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"

// Embedded CSS for custom animations and styles
const styles = {
  customScrollbar: `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
}

const BookingSummaryPanel = ({ selectedServices, onRemoveService, onClearAllServices, isLoggedIn }) => {
  const [isPanelHidden, setIsPanelHidden] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(0)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  // Get navbar height
  useEffect(() => {
    const navbar = document.querySelector("nav")
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight)
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-clear services on logout
  useEffect(() => {
    if (!isLoggedIn && selectedServices.length > 0) {
      onClearAllServices()
    }
  }, [isLoggedIn, selectedServices.length, onClearAllServices])

  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0)

  // Calculate total duration in minutes
  const totalDurationMinutes = selectedServices.reduce((sum, service) => sum + (service.duration || 0), 0)

  // Convert minutes to hours and minutes format
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hr`
    return `${hours} hr ${mins} min`
  }

  // Format VND
  const formatVND = (price) => {
    return price.toLocaleString("vi-VN") + " ₫"
  }

  const togglePanelVisibility = () => {
    setIsPanelHidden(!isPanelHidden)
  }

  // Handle booking services
  const handleBookServices = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service to book.")
      return
    }

    // Prepare query parameters to pass selectedServices
    const queryParams = new URLSearchParams()
    selectedServices.forEach((service, index) => {
      queryParams.append(`service${index}`, JSON.stringify(service))
    })

    // Navigate to MyBooking page with service data
    navigate(`/mybooking?${queryParams.toString()}`)
  }

  // Calculate panel width based on screen size
  const getPanelWidth = () => {
    return window.innerWidth < 768 ? "90%" : "400px"
  }

  return (
    <>
      <style jsx>{`
        ${styles.customScrollbar}
        ${styles.fadeIn}
        ${styles.slideUp}
        ${styles.pulse}
      `}</style>

      {/* Toggle Button */}
      <motion.button
        className={`fixed z-50 p-3 rounded-l-lg shadow-lg ${
          isPanelHidden ? "right-0" : "right-[400px]"
        } top-1/2 -translate-y-1/2 ${
          selectedServices.length > 0 ? "bg-[#A10550] text-white" : "bg-gray-200 text-gray-600"
        } md:flex items-center justify-center hidden`}
        onClick={togglePanelVisibility}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {isPanelHidden ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </motion.button>

      {/* Mobile Toggle Button */}
      <motion.button
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg ${
          selectedServices.length > 0 ? "bg-[#A10550] text-white" : "bg-gray-200 text-gray-600"
        } md:hidden`}
        onClick={togglePanelVisibility}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <ShoppingBag className="w-5 h-5" />
        {selectedServices.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#A10550] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-[#A10550]">
            {selectedServices.length}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <motion.div
        ref={panelRef}
        className="fixed top-0 right-0 z-40 h-full"
        initial={{ x: "100%" }}
        animate={{
          x: isPanelHidden ? "100%" : "0%",
          width: getPanelWidth(),
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }}
        style={{
          marginTop: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        <div className="h-full bg-white rounded-l-lg shadow-xl border-l border-t border-b border-gray-200 overflow-hidden flex flex-col">
          <div className="p-3 md:p-4 bg-gradient-to-r from-[#A10550] to-[#800440] text-white flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <h2 className="text-base md:text-lg font-bold">
                Booking Summary {selectedServices.length > 0 && `(${selectedServices.length})`}
              </h2>
            </div>
          </div>

          <div className="p-4 md:p-6 flex-1 flex flex-col">
            {selectedServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500 flex-1 flex flex-col items-center justify-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No services selected yet</p>
                <p className="text-sm mt-2">Select services from the list to see your booking details</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Selected Services</h3>
                    <motion.button
                      onClick={onClearAllServices}
                      className="text-sm text-[#A10550] hover:text-[#800440] transition-colors font-medium flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Clear All
                    </motion.button>
                  </div>
                  <div className="max-h-[calc(100%-180px)] overflow-y-auto pr-1 custom-scrollbar flex-1">
                    <motion.ul className="space-y-3">
                      {selectedServices.map((service, index) => (
                        <motion.li
                          key={service.serviceId}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "#fdf2f8" }}
                        >
                          <div>
                            <p className="font-medium text-gray-800">{service.name}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              {service.duration && (
                                <>
                                  <Clock className="w-3.5 h-3.5 mr-1" />
                                  <span>{formatDuration(service.duration)}</span>
                                  <span className="mx-2">•</span>
                                </>
                              )}
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              <span>{formatVND(service.price)}</span>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => onRemoveService(service.serviceId)}
                            className="text-gray-400 hover:text-[#A10550] transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label={`Remove ${service.name}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  {totalDurationMinutes > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        {formatDuration(totalDurationMinutes)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-bold text-lg text-[#A10550]">{formatVND(totalPrice)}</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <motion.button
                  onClick={handleBookServices}
                  className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#A10550] to-[#800440] hover:from-[#800440] hover:to-[#A10550] transition-all duration-300 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Selected Services ({selectedServices.length})
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default BookingSummaryPanel

