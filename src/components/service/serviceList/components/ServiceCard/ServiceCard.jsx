import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";
import { addItem } from "../../../../../store/cartSlice";
import { Heart } from "lucide-react";

export default function ServiceCard({ service, onSelect, isSelected, onAddToWishlist, isInWishlist }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div className="w-full mb-8">
      <div
        className={`bg-white rounded-xl shadow-lg border ${
          isSelected ? "border-[#A10550]" : "border-gray-200 hover:border-[#A10550]"
        } transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="relative md:w-2/5 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
            <img
              src={serviceImage}
              className="w-full h-[300px] lg:h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
              alt={service.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Wishlist Heart Button */}
            <button
              onClick={handleAddToWishlist}
              className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${
                isInWishlist || isHovered ? "bg-white shadow-md" : "bg-transparent"
              }`}
            >
              <Heart
                size={32}
                className={`transition-colors duration-300 ${
                  isInWishlist
                    ? "text-[#A10550] fill-[#A10550]"
                    : isHovered
                    ? "text-[#A10550]"
                    : "text-white"
                }`}
              />
            </button>
          </div>

          {/* Right side - Content */}
          <div className="md:w-3/5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <h5 className="text-[#A10550] font-playfair font-bold text-3xl lg:text-4xl mb-6 hover:text-[#800440] transition-colors">
                {service.name}
              </h5>
              <p className="font-bold text-2xl lg:text-3xl mb-6 text-gray-800">
                ${service.price}.00 - {service.duration} minutes
              </p>
              <p className="text-gray-600 text-xl lg:text-2xl mb-8 line-clamp-3">{service.description}</p>
            </div>

            <div className="flex gap-6">
              <button
                className={`flex-1 py-4 px-8 rounded-lg font-bold text-xl transition-all duration-300 ${
                  isSelected
                    ? "bg-[#A10550] text-white shadow-lg shadow-[#A10550]/30"
                    : "bg-gray-100 text-black hover:bg-[#A10550] hover:text-white hover:shadow-lg hover:shadow-[#A10550]/30"
                }`}
                onClick={handleBooking}
              >
                {isSelected ? "Booked" : "Book Now"}
              </button>
              <button
                onClick={handleDetailClick}
                className="flex-1 py-4 px-8 rounded-lg font-bold text-xl border-2 border-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
};