import { useState } from "react";
import PropTypes from "prop-types";
import EditServiceModal from "./EditService";
import axios from "axios";

const BASE_URL =
  "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/services";

const ServiceRow = ({ service, onEditService, onDeleteService }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        await axios.delete(`${BASE_URL}/${service.serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        onDeleteService(service.serviceId);
      } catch (err) {
        setError("Failed to delete service. Please try again.");
        console.error(err);
        if (err.response) {
          console.error("Response error:", err.response.data);
        }
      }
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
        {service.serviceId}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {service.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        <img
          src={
            service.images?.[0]?.url || service.imageUrl || "/placeholder.svg"
          }
          alt={service.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        ${service.price}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {service.duration} min
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-[#3D021E] hover:text-[#4A0404] mr-4 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Delete
        </button>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
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
    serviceId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })),
    imageUrl: PropTypes.string,
    recommendedSkinTypes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onEditService: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
};

export default ServiceRow;
