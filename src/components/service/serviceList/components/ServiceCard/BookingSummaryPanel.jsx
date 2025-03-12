
"use client";

import { useState, useEffect } from "react";
import { X, Clock, DollarSign, ShoppingBag, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
};

const BookingSummaryPanel = ({ selectedServices, onRemoveService, onBookServices, onClearAllServices, isLoggedIn }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Lấy chiều cao của navbar
  useEffect(() => {
    const navbar = document.querySelector("header"); // Thay "header" bằng selector của navbar của bạn
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    // Cập nhật chiều cao khi window resize
    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-collapse panel on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setShowFloatingButton(true);
      } else {
        setIsCollapsed(false);
        setShowFloatingButton(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-clear services on logout
  useEffect(() => {
    if (!isLoggedIn && selectedServices.length > 0) {
      onClearAllServices();
    }
  }, [isLoggedIn, selectedServices.length, onClearAllServices]);

  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);

  // Calculate total duration in minutes
  const totalDurationMinutes = selectedServices.reduce((sum, service) => sum + (service.duration || 0), 0);

  // Convert minutes to hours and minutes format
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Embedded styles */}
      <style jsx>{`
        ${styles.customScrollbar}
        ${styles.fadeIn}
        ${styles.slideUp}
        ${styles.pulse}
      `}</style>

      {/* Floating button for mobile */}
      {showFloatingButton && (
        <motion.button
          className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 p-3 md:p-4 rounded-full shadow-lg ${
            selectedServices.length > 0 ? "bg-[#A10550] text-white" : "bg-gray-200 text-gray-600"
          }`}
          onClick={toggleVisibility}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
          {selectedServices.length > 0 && (
            <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-white text-[#A10550] rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold border-2 border-[#A10550]">
              {selectedServices.length}
            </span>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="sticky z-50"
            id="booking-summary-panel"
            style={{ top: `${navbarHeight + 10}px`, marginLeft: "20px" }} // Đặt top dựa trên chiều cao navbar + 10px padding
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div
                className="p-3 md:p-4 bg-gradient-to-r from-[#A10550] to-[#800440] text-white flex justify-between items-center cursor-pointer"
                onClick={toggleCollapse}
              >
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <h2 className="text-base md:text-lg font-bold">
                    Booking Summary {selectedServices.length > 0 && `(${selectedServices.length})`}
                  </h2>
                </div>
                <div className="flex items-center">
                  {!showFloatingButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility();
                      }}
                      className="mr-2 p-1 hover:bg-white/20 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </div>
              </div>

              {/* Content */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6">
                      {selectedServices.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No services selected yet</p>
                          <p className="text-sm mt-2">Select services from the list to see your booking details</p>
                        </div>
                      ) : (
                        <>
                          {/* Selected Services List */}
                          <div className="mb-6">
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
                            <div className="max-h-[250px] md:max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
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
                                        <span>${service.price.toFixed(2)}</span>
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
                              <span className="font-bold text-lg text-[#A10550]">${totalPrice.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Book Now Button */}
                          <motion.button
                            onClick={onBookServices}
                            className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#A10550] to-[#800440] hover:from-[#800440] hover:to-[#A10550] transition-all duration-300 shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Book Selected Services ({selectedServices.length})
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingSummaryPanel;