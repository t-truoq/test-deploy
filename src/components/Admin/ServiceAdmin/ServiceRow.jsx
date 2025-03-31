"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import EditServiceModal from "./EditService";
import axios from "axios";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";

const BASE_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/services";

const ServiceRow = ({ service, onEditService, onDeleteService }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
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
      showToast({
        title: "Success",
        message: "Service deleted successfully.",
        type: "success",
      });
    } catch (err) {
      showToast({
        title: "Error",
        message: "Failed to delete service. Please try again.",
        type: "error",
      });
      console.error(err);
      if (err.response) {
        console.error("Response error:", err.response.data);
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors duration-200">
        <td className="whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
          {service.serviceId}
        </td>
        <td className="whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
          {service.name}
        </td>
        <td className="hidden sm:table-cell whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
          <img
            src={
              service.images?.[0]?.url || service.imageUrl || "/placeholder.svg"
            }
            alt={service.name}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
          />
        </td>
        <td className="whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
          ${service.price}
        </td>
        <td className="hidden md:table-cell whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
          {service.duration} min
        </td>
        <td className="whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-[#3D021E] hover:text-[#4A0404] mr-2 sm:mr-4 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </td>
      </tr>

      {isEditModalOpen && (
        <EditServiceModal
          service={service}
          onEditService={(updatedService) => {
            onEditService(updatedService);
            showToast({
              title: "Success",
              message: "Service updated successfully.",
              type: "success",
            });
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#3D021E] mb-3 sm:mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
              Are you sure you want to delete this service?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] text-xs sm:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm z-50 border-l-4 ${
            toast.type === "success"
              ? "bg-green-50 border-green-600"
              : toast.type === "error"
              ? "bg-red-50 border-red-600"
              : "bg-blue-50 border-blue-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                {toast.title}
              </h3>
              <div className="mt-1 text-xs sm:text-sm text-gray-700">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </>
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
