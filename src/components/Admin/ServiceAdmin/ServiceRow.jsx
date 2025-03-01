"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import EditServiceModal from "./EditService";

const ServiceRow = ({ service, onEditService, onDeleteService }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
        {service.id}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {service.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        <img
          src={service.imageUrl || "/placeholder.svg"}
          alt={service.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        ${service.price}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {service.duration} min
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            service.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {service.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-[#4A0404] hover:text-[#3A0303] mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteService(service.id)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </td>

      {isEditModalOpen && (
        <EditServiceModal
          service={service}
          onEditService={onEditService}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </tr>
  );
};

ServiceRow.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEditService: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
};

export default ServiceRow;
