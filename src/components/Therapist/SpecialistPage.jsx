"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { X, Star, Phone, Mail, MapPin, Clock, Heart } from "lucide-react";
import { Link } from "react-router-dom";

// Hàm để điền dữ liệu còn thiếu với giá trị ngẫu nhiên
const fillMissingData = (specialist) => {
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomExperience = () => {
    const years = getRandomNumber(1, 10);
    return `${years} year${years > 1 ? "s" : ""}`;
  };

  const educations = [
    "Certified Professional",
    "Master of Aesthetics",
    "Diploma in Beauty Therapy",
    "Advanced Skin Care Specialist",
  ];
  const randomEducation = educations[getRandomNumber(0, educations.length - 1)];

  const descriptions = [
    `Specialist ${
      specialist.name || "Unknown"
    } is part of our expert team with a passion for beauty.`,
    `Meet ${
      specialist.name || "Unknown"
    }, a dedicated professional in our beauty services.`,
    `${
      specialist.name || "Unknown"
    } brings expertise and care to our specialist team.`,
    `Discover the skills of ${
      specialist.name || "Unknown"
    }, a valued member of our crew.`,
  ];
  const randomDescription =
    descriptions[getRandomNumber(0, descriptions.length - 1)];

  // Thêm trường about với nội dung ngẫu nhiên
  const abouts = [
    `${
      specialist.name || "This specialist"
    } has years of experience in transforming skin health with personalized care and advanced techniques.`,
    `With a deep passion for beauty, ${
      specialist.name || "this specialist"
    } specializes in creating tailored skincare routines for every client.`,
    `${
      specialist.name || "This expert"
    } is renowned for their innovative approach to beauty treatments and client satisfaction.`,
    `Dedicated to excellence, ${
      specialist.name || "this professional"
    } combines science and art to enhance your natural glow.`,
  ];
  const randomAbout = abouts[getRandomNumber(0, abouts.length - 1)];

  const treatmentsPool = [
    "General Treatment",
    "Facial Care",
    "Hair Removal",
    "Massage Therapy",
    "Skin Rejuvenation",
  ];
  const randomTreatmentsCount = getRandomNumber(1, 3);
  const randomTreatments = [];
  const usedTreatments = new Set();
  while (randomTreatments.length < randomTreatmentsCount) {
    const treatment =
      treatmentsPool[getRandomNumber(0, treatmentsPool.length - 1)];
    if (!usedTreatments.has(treatment)) {
      randomTreatments.push(treatment);
      usedTreatments.add(treatment);
    }
  }

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const randomAvailabilityCount = getRandomNumber(2, 4);
  const randomAvailability = [];
  const usedDays = new Set();
  while (randomAvailability.length < randomAvailabilityCount) {
    const day = days[getRandomNumber(0, days.length - 1)];
    if (!usedDays.has(day)) {
      randomAvailability.push({
        day,
        hours: `${getRandomNumber(8, 10)}:00 AM - ${getRandomNumber(
          4,
          6
        )}:00 PM`,
      });
      usedDays.add(day);
    }
  }

  return {
    id: specialist.id || specialist.userId || Date.now(),
    name: specialist.name || "Unknown Specialist",
    email: specialist.email || "N/A",
    phone: specialist.phone || "N/A",
    address: specialist.address || "N/A",
    role: specialist.role || "N/A",
    status: specialist.status || "N/A",
    createdAt: specialist.createdAt || new Date().toISOString(),
    updatedAt: specialist.updatedAt || new Date().toISOString(),
    specialty: specialist.specialty || "Specialist",
    image:
      specialist.image ||
      `/placeholder.svg?height=300&width=400&id=${
        specialist.userId || Date.now()
      }`,
    rating: specialist.rating || (getRandomNumber(35, 50) / 10).toFixed(1),
    reviews: specialist.reviews || getRandomNumber(1, 50),
    experience: specialist.experience || getRandomExperience(),
    description: specialist.description || randomDescription,
    about: specialist.about || randomAbout, // Thêm trường about
    education: specialist.education || randomEducation,
    availability: specialist.availability || randomAvailability,
    treatments: specialist.treatments || randomTreatments,
  };
};

// Component SpecialistCard
const SpecialistCard = ({ specialist, onClick }) => {
  const filledSpecialist = fillMissingData(specialist);
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
      onClick={() => onClick(filledSpecialist)}
    >
      <div className="relative">
        <img
          src={filledSpecialist.image || "/placeholder.svg"}
          alt={filledSpecialist.name}
          className="w-full h-auto object-cover aspect-[4/3]"
        />
        <div className="absolute top-0 right-0 m-2 p-1 bg-white rounded-full shadow">
          <Heart className="h-5 w-5 text-pink-500" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {filledSpecialist.name}
        </h3>
        <p className="text-pink-600 font-medium">
          {filledSpecialist.specialty}
        </p>

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {filledSpecialist.rating}
            </span>
          </div>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-sm text-gray-500">
            {filledSpecialist.reviews} reviews
          </span>
        </div>

        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{filledSpecialist.experience}</span>
        </div>
      </div>
    </div>
  );
};

// Component SpecialistDetail (for popup)
export const SpecialistDetail = ({ specialist, onClose }) => {
  if (!specialist) return null;

  const filledSpecialist = fillMissingData(specialist);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md z-10"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>

          <div className="md:flex">
            <div className="md:w-2/5">
              <img
                src={filledSpecialist.image || "/placeholder.svg"}
                alt={filledSpecialist.name}
                className="w-full h-auto object-cover md:h-full"
              />
            </div>

            <div className="p-6 md:w-3/5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filledSpecialist.name}
                  </h2>
                  <p className="text-pink-600 font-medium">
                    {filledSpecialist.specialty}
                  </p>
                </div>

                <div className="flex items-center bg-pink-50 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-gray-700">
                    {filledSpecialist.rating}
                  </span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {filledSpecialist.reviews} reviews
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  About
                </h3>
                <p className="text-gray-600">{filledSpecialist.about}</p>{" "}
                {/* Hiển thị about thay vì description */}
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Contact Information
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-pink-500" />
                      {filledSpecialist.phone}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-pink-500" />
                      {filledSpecialist.email}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                      {filledSpecialist.address}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Education
                  </h3>
                  <p className="text-gray-600">{filledSpecialist.education}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Availability
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {filledSpecialist.availability.map((slot, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <p className="font-medium text-gray-700">{slot.day}</p>
                      <p className="text-sm text-gray-500">{slot.hours}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Treatments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filledSpecialist.treatments.map((treatment, index) => (
                    <span
                      key={index}
                      className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm"
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component SpecialistPage (main page)
const SpecialistPage = () => {
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(
          "https://beautya-gr2-production.up.railway.app/api/users/specialists/active",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("Fetch specialists response:", response.data);
        if (Array.isArray(response.data)) {
          const filledData = response.data.map((specialist) => ({
            id: specialist.userId || Math.random().toString(36).substr(2, 9),
            name: specialist.name || "Unknown Specialist",
            specialty: specialist.specialty || "Specialist",
            image:
              specialist.images && specialist.images.length > 0
                ? specialist.images[0].url
                : "/placeholder.svg?height=400&width=300",
            description: specialist.description || "No description available",
            email: specialist.email,
            phone: specialist.phone,
            address: specialist.address,
            role: specialist.role,
            status: specialist.status,
            createdAt: specialist.createdAt,
            updatedAt: specialist.updatedAt,
          }));
          setSpecialists(filledData);
        } else {
          throw new Error(
            "Invalid response format: Expected an array of specialists"
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching specialists:", error);
        setError(
          error.message || "Failed to load specialists. Please try again."
        );
        setSpecialists([]);
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  const handleSpecialistClick = (specialist) => {
    setSelectedSpecialist(specialist);
    document.body.style.overflow = "hidden";
  };

  const handleCloseDetail = () => {
    setSelectedSpecialist(null);
    document.body.style.overflow = "auto";
  };

  const specialties = [...new Set(specialists.map((t) => t.specialty))];

  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesSearch =
      specialist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "" || specialist.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header with styled title - similar to Services page */}
        <div className="py-12 text-center border-b border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#A10550]">Expert</span> Specialists
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our team of experienced beauty professionals dedicated to
            helping you look and feel your best. Book a session with one of our
            specialists today.
          </p>
        </div>

        {/* Breadcrumb navigation - similar to Services page */}
        <div className="flex justify-between items-center py-8">
          <nav>
            <ol className="flex items-center space-x-3 text-lg">
              <li>
                <Link
                  to="/"
                  className="text-gray-800 hover:text-[#A10550] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-[#A10550] font-medium">Specialists</li>
            </ol>
          </nav>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full md:w-1/4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
          </div>
        ) : (
          <>
            {filteredSpecialists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No specialists found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpecialists.map((specialist) => (
                  <SpecialistCard
                    key={specialist.id}
                    specialist={specialist}
                    onClick={handleSpecialistClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedSpecialist && (
        <SpecialistDetail
          specialist={selectedSpecialist}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

// Export cả SpecialistPage và SpecialistDetail
export default SpecialistPage;
