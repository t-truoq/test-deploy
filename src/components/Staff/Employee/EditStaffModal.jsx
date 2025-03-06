"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const specialtiesByRole = {
  "Massage Therapist": [
    { id: "dt", name: "Deep Tissue" },
    { id: "sw", name: "Swedish" },
    { id: "sp", name: "Sports" },
    { id: "hs", name: "Hot Stone" },
    { id: "ar", name: "Aromatherapy" },
    { id: "rf", name: "Reflexology" },
  ],
  Esthetician: [
    { id: "fc", name: "Facials" },
    { id: "sc", name: "Skin Care" },
    { id: "wax", name: "Waxing" },
    { id: "mc", name: "Microdermabrasion" },
  ],
  "Nail Technician": [
    { id: "mn", name: "Manicure" },
    { id: "pd", name: "Pedicure" },
    { id: "gl", name: "Gel" },
    { id: "ac", name: "Acrylic" },
  ],
};

export function EditStaffModal({ isOpen, onClose, staff, onSave }) {
  const [name, setName] = useState(staff.name);
  const [email, setEmail] = useState(staff.email);
  const [role, setRole] = useState(staff.role);
  const [status, setStatus] = useState(staff.status);
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    staff.specialties
  );

  // Update form when staff changes
  useEffect(() => {
    setName(staff.name);
    setEmail(staff.email);
    setRole(staff.role);
    setStatus(staff.status);
    setSelectedSpecialties(staff.specialties);
  }, [staff]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...staff,
      name,
      email,
      role,
      status,
      specialties: selectedSpecialties,
    });

    // Close modal
    onClose();
  };

  const toggleSpecialty = (specialtyName) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialtyName)
        ? prev.filter((s) => s !== specialtyName)
        : [...prev, specialtyName]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit Skin Therapist
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="edit-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="edit-role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="edit-role"
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setRole(newRole);
                  // Clear specialties if role changes
                  if (newRole !== role) {
                    setSelectedSpecialties([]);
                  }
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              >
                <option value="Massage Therapist">Massage Therapist</option>
                <option value="Esthetician">Esthetician</option>
                <option value="Nail Technician">Nail Technician</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="off-duty">Off Duty</option>
              </select>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </span>
              <div className="grid grid-cols-2 gap-2">
                {specialtiesByRole[role].map((specialty) => (
                  <div key={specialty.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-${specialty.id}`}
                      checked={selectedSpecialties.includes(specialty.name)}
                      onChange={() => toggleSpecialty(specialty.name)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`edit-${specialty.id}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {specialty.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditStaffModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  staff: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.oneOf([
      "Massage Therapist",
      "Esthetician",
      "Nail Technician",
    ]).isRequired,
    specialties: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.oneOf(["available", "busy", "off-duty"]).isRequired,
    appointments: PropTypes.number.isRequired,
  }).isRequired,
};
