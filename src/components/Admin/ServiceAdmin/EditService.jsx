"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const EditServiceModal = ({ service, onEditService, onClose }) => {
  const [formData, setFormData] = useState({
    name: service.name,
    price: service.price,
    duration: service.duration,
    imageUrl: service.imageUrl,
    status: service.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditService(service.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Service</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Service Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A0404] focus:outline-none focus:ring-1 focus:ring-[#4A0404]"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Price ($)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A0404] focus:outline-none focus:ring-1 focus:ring-[#4A0404]"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="duration"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Duration
            </label>
            <div className="flex space-x-4">
              {["30", "45", "60"].map((duration) => (
                <label key={duration} className="flex items-center">
                  <input
                    type="radio"
                    name="duration"
                    value={duration}
                    checked={formData.duration === duration}
                    onChange={handleChange}
                    className="mr-2 focus:ring-[#4A0404]"
                  />
                  <span className="text-sm text-gray-700">
                    {duration === "60" ? "1 hour" : `${duration} min`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="imageUrl"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A0404] focus:outline-none focus:ring-1 focus:ring-[#4A0404]"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A0404] focus:outline-none focus:ring-1 focus:ring-[#4A0404]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#4A0404] px-4 py-2 text-sm font-medium text-white hover:bg-[#3A0303]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditServiceModal.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEditService: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditServiceModal;
