"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL =
  "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/users/profile";

// Dữ liệu mặc định cho các trường không có trong API
const defaultProfessionalInfo = {
  position: "Senior Skin Therapist",
  specialization: "Facial Treatments, Anti-aging",
  certification: "International Beauty Therapy Certificate",
  experience: "5 years",
  workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
};

const defaultSkills = [
  { name: "Facial Treatments", level: 95 },
  { name: "Skin Analysis", level: 90 },
  { name: "Anti-aging Treatments", level: 85 },
  { name: "Acne Treatments", level: 80 },
  { name: "Customer Service", level: 90 },
];

const defaultStatistics = {
  totalClients: 120,
  totalAppointments: 450,
  completedAppointments: 430,
  satisfactionRate: 98,
};

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [tempProfile, setTempProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        const apiData = response.data;
        const initialProfile = {
          personalInfo: {
            name: apiData.name,
            email: apiData.email,
            phone: apiData.phone,
            address: apiData.address,
            joinDate: apiData.createdAt.split("T")[0], // Lấy phần ngày từ createdAt
          },
          professionalInfo: defaultProfessionalInfo,
          skills: defaultSkills,
          statistics: defaultStatistics,
        };

        setProfile(initialProfile);
        setTempProfile(initialProfile);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized: Please login again.");
          } else {
            setError(err.response.data.message || "Failed to load profile.");
          }
        } else if (err.request) {
          setError("Unable to connect to server.");
        } else {
          setError(err.message || "Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const payload = {
        name: tempProfile.personalInfo.name,
        email: tempProfile.personalInfo.email,
        phone: tempProfile.personalInfo.phone,
        address: tempProfile.personalInfo.address,
      };

      const response = await axios.put(BASE_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const updatedProfile = {
        ...tempProfile,
        personalInfo: {
          ...tempProfile.personalInfo,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        },
      };

      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to update profile.");
      } else {
        setError("Unable to update profile. Please try again.");
      }
    }
  };

  const handleChange = (section, field, value) => {
    setTempProfile({
      ...tempProfile,
      [section]: {
        ...tempProfile[section],
        [field]: value,
      },
    });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...tempProfile.skills];
    const newValue = Math.min(Math.max(Number.parseInt(value) || 0, 0), 100);
    updatedSkills[index] = {
      ...updatedSkills[index],
      level: newValue,
    };
    setTempProfile({
      ...tempProfile,
      skills: updatedSkills,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white border-gray-100 p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
            Loading profile...
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Please wait while we fetch your data
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
          My Profile
        </h2>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <span className="text-5xl text-pink-600 font-bold">
                  {profile.personalInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h2 className="text-xl font-semibold">
                {profile.personalInfo.name}
              </h2>
              <p className="text-gray-500">
                {profile.professionalInfo.position}
              </p>
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{profile.personalInfo.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{profile.personalInfo.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{profile.personalInfo.address}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span>
                    Joined{" "}
                    {new Date(
                      profile.personalInfo.joinDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Professional Information */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold">Professional Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.personalInfo.name}
                      onChange={(e) =>
                        handleChange("personalInfo", "name", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900">{profile.personalInfo.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.personalInfo.email}
                      onChange={(e) =>
                        handleChange("personalInfo", "email", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.personalInfo.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.personalInfo.phone}
                      onChange={(e) =>
                        handleChange("personalInfo", "phone", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.personalInfo.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.personalInfo.address}
                      onChange={(e) =>
                        handleChange("personalInfo", "address", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.personalInfo.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.professionalInfo.position}
                      onChange={(e) =>
                        handleChange(
                          "professionalInfo",
                          "position",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.professionalInfo.position}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.professionalInfo.specialization}
                      onChange={(e) =>
                        handleChange(
                          "professionalInfo",
                          "specialization",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.professionalInfo.specialization}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.professionalInfo.certification}
                      onChange={(e) =>
                        handleChange(
                          "professionalInfo",
                          "certification",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.professionalInfo.certification}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.professionalInfo.experience}
                      onChange={(e) =>
                        handleChange(
                          "professionalInfo",
                          "experience",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile.professionalInfo.experience}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Working Hours
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={tempProfile.professionalInfo.workingHours}
                      onChange={(e) =>
                        handleChange(
                          "professionalInfo",
                          "workingHours",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <p className="text-gray-900">
                        {profile.professionalInfo.workingHours}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold">Skills & Expertise</h3>
            </div>
            <div className="p-6 space-y-4">
              {(isEditing ? tempProfile.skills : profile.skills).map(
                (skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        {skill.name}
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md"
                          value={skill.level}
                          onChange={(e) =>
                            handleSkillChange(index, e.target.value)
                          }
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {skill.level}%
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-pink-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold">Performance Statistics</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">
                    {profile.statistics.totalClients}
                  </p>
                  <p className="text-sm text-gray-500">Total Clients</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">
                    {profile.statistics.totalAppointments}
                  </p>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">
                    {profile.statistics.completedAppointments}
                  </p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">
                    {profile.statistics.satisfactionRate}%
                  </p>
                  <p className="text-sm text-gray-500">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
