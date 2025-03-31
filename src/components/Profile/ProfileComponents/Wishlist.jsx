"use client"

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import ServiceCard from "../../service/serviceList/components/ServiceCard/ServiceCard";
import { motion } from "framer-motion"; // Import motion for animations

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [columns, setColumns] = useState(4); // Default to 4 columns (desktop)
  const navigate = useNavigate();

  // Handle selecting a service
  const handleSelect = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.serviceId === service.serviceId)
        ? prev.filter((s) => s.serviceId !== service.serviceId)
        : [...prev, service],
    );
  };

  // Handle adding/removing a service from the wishlist
  const handleAddToWishlist = (service) => {
    let updatedWishlist = [...wishlist];
    const isInWishlist = updatedWishlist.some((item) => item.serviceId === service.serviceId);

    if (isInWishlist) {
      updatedWishlist = updatedWishlist.filter((item) => item.serviceId !== service.serviceId);
    } else {
      updatedWishlist.push(service);
    }

    Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
    setWishlist(updatedWishlist);
  };

  // Handle booking selected services
  const handleBookServices = () => {
    if (selectedServices.length === 0) {
      // If no services are selected, select all wishlist items
      const servicesToBook = wishlist.map((service) => ({
        serviceId: service.serviceId,
        name: service.name,
        price: service.price,
        duration: service.duration || 30, // Default duration if not available
      }));

      // Store in localStorage to be picked up by the service list page
      localStorage.setItem("selectedServicesForBooking", JSON.stringify(servicesToBook));
    } else {
      // Store only selected services
      localStorage.setItem("selectedServicesForBooking", JSON.stringify(selectedServices));
    }

    // Navigate to the services page
    navigate("/services");
  };

  // Determine the number of columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1); // Mobile: 1 column
      } else if (window.innerWidth < 1024) {
        setColumns(2); // Tablet: 2 columns
      } else {
        setColumns(4); // Desktop: 4 columns
      }
    };

    updateColumns(); // Call initially
    window.addEventListener("resize", updateColumns); // Update on resize

    return () => window.removeEventListener("resize", updateColumns); // Cleanup
  }, []);

  // Load wishlist from cookies
  useEffect(() => {
    const savedWishlist = Cookies.get("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error parsing wishlist from cookie:", error);
        setWishlist([]);
      }
    }
    setLoading(false);
  }, []);

  // Function to limit the number of services to 4 rows
  const getServicesToDisplay = (services) => {
    const rows = 4; // Always display 4 rows
    const servicesPerPage = columns * rows; // Total services to display
    return services.slice(0, servicesPerPage); // Limit the number of services
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-300px)] flex items-center justify-center">
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
          <p className="text-xl text-gray-600">Loading your wishlist...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-300px)] max-w-[2020px] mx-auto px-6 sm:px-8 lg:px-12 bg-white">
      {/* Navigation */}
      <motion.div
        className="py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <nav>
          <ol className="flex items-center space-x-2 text-sm sm:text-base">
            <li>
              <Link to="/" className="text-gray-600 hover:text-[#A10550] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-[#A10550] font-medium">Wishlist</li>
          </ol>
        </nav>
      </motion.div>

      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Your <span className="text-[#A10550]">Wishlist</span>
        </h2>
        {wishlist.length > 0 && (
          <motion.button
            onClick={handleBookServices}
            className="bg-[#A10550] hover:bg-[#800440] text-white py-2 px-6 rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book {selectedServices.length > 0 ? `Selected (${selectedServices.length})` : "All"} Services
          </motion.button>
        )}
      </motion.div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <motion.div
          className="text-center py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-lg mb-4">Your wishlist is empty.</p>
          <Link
            to="/services"
            className="inline-block bg-[#A10550] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#800440] transition-colors"
          >
            Explore Services
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-6`}>
            {getServicesToDisplay(wishlist).map((service, index) => (
              <motion.div
                key={service.serviceId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  service={service}
                  onSelect={handleSelect}
                  isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
                  variant="wishlist" // Optional: You can use this to customize the card for the wishlist
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;