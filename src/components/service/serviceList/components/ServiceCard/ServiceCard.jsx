import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { addItem } from "../../../../../store/cartSlice";
import { Heart, Clock, ChevronRight, Tag } from "lucide-react"; // Loại bỏ DollarSign
import { motion } from "framer-motion";

// Hàm định dạng giá tiền VND với dấu phân cách hàng nghìn
const formatVND = (price) => {
  return price.toLocaleString("vi-VN") + " ₫"; // Định dạng theo kiểu Việt Nam
};

export default function ServiceCard({ service, onSelect, isSelected, onAddToWishlist, isInWishlist, variant }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleDetailClick = () => {
    navigate(`/services/${service.serviceId}`);
  };

  const handleBooking = () => {
    if (!isSelected) {
      dispatch(
        addItem({
          id: service.serviceId,
          name: service.name,
          price: service.price,
          time: service.duration,
          image:
            service.images && service.images.length > 0
              ? service.images[0].url
              : service.image || "https://picsum.photos/350",
        })
      );
    }
    onSelect(service);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    onAddToWishlist(service);
  };

  // Logic lấy ảnh giống BlogPage
  const serviceImage =
    service.images && service.images.length > 0
      ? service.images[0].url
      : service.image || "https://via.placeholder.com/350";

  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={cardRef}
    >
      <motion.div
        className={`bg-white rounded-xl shadow-lg border overflow-hidden ${
          isSelected ? "border-[#A10550]" : "border-gray-200"
        } transition-all duration-300`}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderColor: "#A10550" 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="relative md:w-2/5 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <img
                src={serviceImage || "/placeholder.svg"}
                className="w-full h-[300px] lg:h-[400px] object-cover"
                alt={service.name}
              />
            </motion.div>
            
            {/* Recommended badge */}
            {variant === "recommended" && (
              <div className="absolute top-4 left-0 bg-[#A10550] text-white py-1 px-4 rounded-r-full shadow-md flex items-center">
                <Tag size={14} className="mr-1" />
                <span className="text-sm font-medium">Recommended</span>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Wishlist Heart Button */}
            <motion.button
              onClick={handleAddToWishlist}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                isInWishlist ? "bg-white shadow-md" : isHovered ? "bg-white/80 shadow-md" : "bg-white/30"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                size={24}
                className={`transition-colors duration-300 ${
                  isInWishlist
                    ? "text-[#A10550] fill-[#A10550]"
                    : isHovered
                    ? "text-[#A10550]"
                    : "text-white"
                }`}
              />
            </motion.button>
          </div>

          {/* Right side - Content */}
          <div className="md:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-gray-500 text-sm">{formatDuration(service.duration)}</span>
              </div>
              
              <h5 className="text-[#A10550] font-serif font-bold text-2xl lg:text-3xl mb-3 hover:text-[#800440] transition-colors">
                {service.name}
              </h5>
              
              <div className="flex items-center mb-4">
                {/* Thay DollarSign bằng ký hiệu ₫ trong span */}
                <span className="font-bold text-xl lg:text-2xl text-gray-800">{formatVND(service.price)}</span>
              </div>
              
              <p className="text-gray-600 mb-6 line-clamp-3">{service.description}</p>
            </div>

            <div className="flex gap-4">
              <motion.button
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-base transition-all duration-300 ${
                  isSelected
                    ? "bg-[#A10550] text-white shadow-lg shadow-[#A10550]/30"
                    : "bg-gray-100 text-black hover:bg-[#A10550] hover:text-white hover:shadow-lg hover:shadow-[#A10550]/30"
                }`}
                onClick={handleBooking}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSelected ? "Selected" : "Book Now"}
              </motion.button>
              
              <motion.button
                onClick={handleDetailClick}
                className="flex items-center justify-center py-3 px-6 rounded-lg font-medium text-base border-2 border-gray-300 transition-all duration-300 hover:border-gray-800 hover:bg-gray-800 hover:text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Details <ChevronRight size={16} className="ml-1" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    serviceId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
  isInWishlist: PropTypes.bool.isRequired,
  variant: PropTypes.string,
};