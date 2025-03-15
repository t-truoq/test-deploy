import { useState } from "react";
import EditServiceModal from "./EditService";
import PropTypes from "prop-types";

const ServiceCard = ({
  id,
  imageUrl,
  name,
  price,
  duration,
  onEditService,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 capitalize">
          {name}
        </h3>
        <p className="mb-2 text-lg font-semibold text-[#3D021E]">${price}</p>
        <p className="mb-4 text-sm text-gray-600">{duration} minutes</p>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full rounded-lg bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] px-4 py-2 text-sm font-medium text-white hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D021E] focus:ring-offset-2"
        >
          Edit Service
        </button>
      </div>

      {isEditModalOpen && (
        <EditServiceModal
          service={{ id, name, price, duration, imageUrl }}
          onEditService={onEditService}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

ServiceCard.propTypes = {
  id: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  onEditService: PropTypes.func.isRequired,
};

ServiceCard.defaultProps = {
  imageUrl: "/placeholder.svg",
};

export default ServiceCard;
