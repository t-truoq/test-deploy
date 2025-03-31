import { useState } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import axios from "axios"; // Thay vì import từ api.js, dùng axios trực tiếp

const BASE_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/services"; // Thêm link ngrok trước endpoint

const AddServiceModal = ({ onAddService, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "30",
    imageUrl: "",
    recommendedSkinTypes: [],
  });
  const [error, setError] = useState(null);

  const skinTypeOptions = ["OILY", "COMBINATION", "DRY", "NORMAL", "SENSITIVE"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration, 10),
        recommendedSkinTypes: formData.recommendedSkinTypes,
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
      };

      const response = await axios.post(BASE_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      onAddService(response.data);
      onClose();
    } catch (err) {
      setError("Không thể thêm dịch vụ. Vui lòng kiểm tra lại.");
      console.error(err);
      if (err.response) {
        console.error("Response error:", err.response.data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkinTypeChange = (skinType) => {
    setFormData((prev) => {
      const updatedSkinTypes = prev.recommendedSkinTypes.includes(skinType)
        ? prev.recommendedSkinTypes.filter((type) => type !== skinType)
        : [...prev.recommendedSkinTypes, skinType];
      return { ...prev, recommendedSkinTypes: updatedSkinTypes };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Service
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

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
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A0404] focus:outline-none focus:ring-1 focus:ring-[#4A0404]"
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
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#4A0404] focus:outline-none focus:ring-1 focus:ring-[#4A0404]"
              required
              step="0.01"
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
              {["30", "45", "60"].map((dur) => (
                <label key={dur} className="flex items-center">
                  <input
                    type="radio"
                    name="duration"
                    value={dur}
                    checked={formData.duration === dur}
                    onChange={handleChange}
                    className="mr-2 focus:ring-[#4A0404]"
                  />
                  <span className="text-sm text-gray-700">
                    {dur === "60" ? "1 hour" : `${dur} min`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Recommended Skin Types
            </label>
            <div className="flex flex-wrap gap-3">
              {skinTypeOptions.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    checked={formData.recommendedSkinTypes.includes(type)}
                    onChange={() => handleSkinTypeChange(type)}
                    className="mr-2 focus:ring-[#4A0404]"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
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
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddServiceModal.propTypes = {
  onAddService: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddServiceModal;
