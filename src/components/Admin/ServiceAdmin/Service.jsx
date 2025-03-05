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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-medium text-gray-900 capitalize">
          {name}
        </h3>
        <p className="mb-2 text-lg font-semibold text-[#4A0404]">${price}</p>
        <p className="mb-4 text-sm text-gray-600">{duration} minutes</p>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A0404] focus:ring-offset-2"
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
