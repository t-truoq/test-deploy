"use client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SpecialistDetail } from "../../../Therapist/SpecialistPage"; // Import SpecialistDetail
import axios from "axios";

// Hàm để điền dữ liệu còn thiếu với giá trị ngẫu nhiên
const fillMissingData = (specialist) => {
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomExperience = () => {
    const years = getRandomNumber(1, 10);
    return `${years} year${years > 1 ? "s" : ""}`;
  };

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

  // Giả lập số điện thoại, email, và địa chỉ ngẫu nhiên nếu không có từ API
  const randomPhone = `+84 ${getRandomNumber(900, 999)} ${getRandomNumber(
    100,
    999
  )} ${getRandomNumber(100, 999)}`;
  const randomEmail = `${(specialist.name || "specialist")
    .toLowerCase()
    .replace(/\s+/g, "")}${getRandomNumber(1, 999)}@example.com`;
  const randomAddress = `${getRandomNumber(1, 999)} ${
    ["Nguyen Van Cu", "Le Loi", "Tran Hung Dao", "Pham Ngu Lao"][
      getRandomNumber(0, 3)
    ]
  }, District ${getRandomNumber(1, 10)}, Ho Chi Minh City`;

  return {
    id: specialist.id || specialist.userId || Date.now(),
    name: specialist.name || "Unknown Specialist",
    role: specialist.role || "Specialist",
    image:
      specialist.images && specialist.images.length > 0
        ? specialist.images[0].url
        : "/placeholder.svg?height=400&width=300",
    description: specialist.description || randomDescription,
    about: specialist.about || randomAbout,
    experience: specialist.experience || getRandomExperience(),
    phone: specialist.phone || randomPhone, // Thêm phone
    email: specialist.email || randomEmail, // Thêm email
    address: specialist.address || randomAddress, // Thêm address
  };
};

export default function SpecialistShowcase() {
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const baseUrl =
    "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app";

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/users/specialists/active`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        console.log("Full response data:", response.data);

        if (
          !response.data ||
          (Array.isArray(response.data) && response.data.length === 0)
        ) {
          throw new Error("No data returned from the API");
        }

        const processedSpecialists = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const firstFourSpecialists = processedSpecialists
          .slice(0, 4)
          .map((specialist) => fillMissingData(specialist)); // Áp dụng fillMissingData
        setSpecialists(firstFourSpecialists);
      } catch (err) {
        console.error("Error fetching specialists:", err);
        if (err.response) {
          setError(
            `Failed to fetch specialists: ${err.response.status} - ${err.response.statusText}. Details: ${err.message}`
          );
        } else if (err.request) {
          setError(
            "No response from the server. Check your network or API endpoint."
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  const handleSpecialistClick = (specialist) => {
    setSelectedSpecialist(specialist);
  };

  const handleCloseDetail = () => {
    setSelectedSpecialist(null);
  };

  const handleViewAllDoctors = () => {
    navigate("/specialist");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="text-center">Loading specialists...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="text-center text-red-600">
            <p>Error loading specialists: {error}</p>
            <p>Please check the API endpoint or contact the administrator.</p>
          </div>
        </div>
      </section>
    );
  }

  if (specialists.length === 0) {
    return (
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="text-center">
            <p>No specialists available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Meet Our Specialists
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Our team of highly trained professionals is dedicated to providing
            you with the best skincare experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              onClick={() => handleSpecialistClick(specialist)}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={specialist.image}
                  alt={specialist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#A10550] mb-1">
                  {specialist.name}
                </h3>
                <p className="text-gray-600 font-medium mb-4">
                  {specialist.role}
                </p>
                <p className="text-gray-700 mb-6">{specialist.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleViewAllDoctors}
            className="bg-[#A10550] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#8c0443] transition-colors"
          >
            View All Doctors
          </button>
        </div>

        {selectedSpecialist && (
          <SpecialistDetail
            specialist={selectedSpecialist}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </section>
  );
}
