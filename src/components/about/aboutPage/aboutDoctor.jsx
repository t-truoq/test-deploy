import { useEffect, useState } from "react";
import axios from "axios";

const AboutDoctor = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm bổ sung dữ liệu thiếu
  const fillMissingData = (specialist) => ({
    name: specialist.name || "Unnamed Specialist",
    role:
      specialist.role === "ADMIN"
        ? "Skincare Expert"
        : specialist.role || "Specialist",
    image:
      specialist.image || // Giữ nguyên image từ API nếu có
      "/placeholder.svg?height=300&width=300", // Fallback image
    description:
      specialist.description || "Expert in skincare and beauty treatments.",
    experience:
      specialist.experience || `${Math.floor(Math.random() * 10) + 5} years`,
    quote: specialist.quote || "Committed to enhancing your natural beauty.",
  });

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await axios.get(
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/users/specialists/active",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("Fetch specialists response:", response.data);

        if (Array.isArray(response.data)) {
          const filledData = response.data
            .map((specialist) => ({
              name: specialist.name,
              role: specialist.role,
              image:
                specialist.images && specialist.images.length > 0
                  ? specialist.images[0].url // Lấy URL ảnh đầu tiên từ images
                  : "/placeholder.svg?height=300&width=300", // Fallback image
              description: specialist.description,
              experience: specialist.experience,
              quote: specialist.quote,
            }))
            .map((specialist) => fillMissingData(specialist))
            .slice(0, 4); // Giới hạn 4 bác sĩ
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

  if (loading) {
    return <div className="text-center py-16">Loading specialists...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800">
            Meet Beautya's Skincare Experts
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Beautiful skin doesn't just require good products; it also needs
            expert hands with extensive experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {specialists.map((doctor, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-lg shadow-sm space-y-4 md:space-y-6 h-auto"
            >
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg">
                    {doctor.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-base md:text-lg">
                {doctor.description}
              </p>
              <p className="text-sm md:text-base text-gray-500">
                Experience: {doctor.experience}
              </p>
              <p className="italic text-gray-600 text-base md:text-lg">
                "{doctor.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutDoctor;
