import { useState } from "react";
import PropTypes from "prop-types";
import EditServiceModal from "./EditService";
import axios from "axios"; // Dùng axios trực tiếp thay vì api.js

const BASE_URL =
  "https://a66f-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/services";

const ServiceRow = ({ service, onEditService, onDeleteService }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
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
        setError("Không thể xóa dịch vụ. Vui lòng kiểm tra lại.");
        console.error(err);
        if (err.response) {
          console.error("Response error:", err.response.data);
        }
      }
    }
  };

  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
        {service.serviceId}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {service.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        <img
          src={
            service.images?.[0]?.url || service.imageUrl || "/placeholder.svg"
          } // Sửa để dùng imageUrl nếu không có images
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
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-[#4A0404] hover:text-[#3A0303] mr-2"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
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
    imageUrl: PropTypes.string, // Thêm propTypes cho imageUrl
    recommendedSkinTypes: PropTypes.arrayOf(PropTypes.string), // Thêm cho đồng bộ
  }).isRequired,
  onEditService: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
};

export default ServiceRow;
