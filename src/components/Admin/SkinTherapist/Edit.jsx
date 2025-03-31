"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/users";

export function Edit({ isOpen, onClose, client, onSave }) {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (client) {
      console.log("Client received in Edit:", client); // Debug: Kiểm tra client
      setFormData({
        password: "",
        name: client.name || "",
        phone: client.phone || "",
        address: client.address || "",
        role: client.role || "SPECIALIST", // Mặc định là SPECIALIST cho SkinTherapist
        id: client.id || "",
      });
    } else {
      console.log("No client provided to Edit"); // Debug: Kiểm tra khi không có client
      setFormData(null);
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    console.log("Form data updated:", { ...formData, [name]: value }); // Debug: Kiểm tra dữ liệu form
  };

  const handleAssignRole = async () => {
    if (!formData?.id || !formData?.role) {
      setError("Please provide a valid ID and role.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token); // Debug: Kiểm tra token
      if (!token) {
        throw new Error("No admin token found. Please log in as an admin.");
      }

      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken); // Debug: Kiểm tra vai trò
      if (decodedToken.role !== "ADMIN") {
        throw new Error("Unauthorized: Only admins can assign roles.");
      }

      const response = await fetch(
        `${API_URL}/${formData.id}/assign-role?newRole=${formData.role}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API error response:", errorText); // Debug: Kiểm tra phản hồi lỗi
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token.");
        } else if (response.status === 403) {
          throw new Error("Forbidden: Admin privileges required.");
        }
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Role assignment response:", result); // Debug: Kiểm tra phản hồi thành công
      if (result.code !== undefined && result.code !== 0) {
        throw new Error(result.msg || "Failed to assign role");
      }

      console.log(`Role updated to ${formData.role} for user ${formData.id}`);
      setError(null); // Xóa lỗi nếu thành công
    } catch (err) {
      console.error("Error assigning role:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      setError("No form data available.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token); // Debug: Kiểm tra token
      if (!token) {
        throw new Error("No admin token found. Please log in as an admin.");
      }

      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken); // Debug: Kiểm tra vai trò
      if (decodedToken.role !== "ADMIN") {
        throw new Error("Unauthorized: Only admins can update users.");
      }

      const updateData = {
        password: formData.password || undefined, // Chỉ gửi nếu có giá trị
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };

      const response = await fetch(`${API_URL}/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API error response:", errorText); // Debug: Kiểm tra phản hồi lỗi
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token.");
        } else if (response.status === 403) {
          throw new Error("Forbidden: Admin privileges required.");
        }
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Update response:", result); // Debug: Kiểm tra phản hồi thành công
      onSave({
        ...client,
        ...updateData,
        role: formData.role,
      });
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    console.log("Modal not open: isOpen is false"); // Debug
    return null;
  }

  if (!formData) {
    console.log("Modal not open: formData is null"); // Debug
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
          <h3 className="text-xl font-bold text-gray-800">Error</h3>
          <p className="text-red-600 mt-2">No valid client data provided.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            Edit Skint Therapist
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={isLoading}
                placeholder="Enter new password (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={isLoading}
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="SPECIALIST">SPECIALIST</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAssignRole}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Assigning..." : "Assign Role"}
              </button>
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-pink-300"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Edit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  client: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    email: PropTypes.string,
    role: PropTypes.oneOf(["CUSTOMER", "STAFF", "SPECIALIST"]),
    status: PropTypes.oneOf(["active", "inactive"]),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    visits: PropTypes.number,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};
