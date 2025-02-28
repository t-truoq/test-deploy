"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import EditServiceModal from "./EditService";

const ServiceCard = ({ id, image, title, price, onEditService }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-medium text-gray-900 capitalize">
          {title}
        </h3>
        <p className="mb-4 text-lg font-semibold text-blue-600">${price}</p>
        <button
          onClick={openEditModal}
          className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Service
        </button>
      </div>

      {isEditModalOpen && (
        <EditServiceModal
          service={{ id, title, price, image }}
          onEditService={onEditService}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

ServiceCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onEditService: PropTypes.func.isRequired,
};

ServiceCard.defaultProps = {
  image: "/placeholder.svg",
};

export default ServiceCard;
