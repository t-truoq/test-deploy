import { Star, MapPin } from "lucide-react";
import { services } from "../../../data/about/feedbackServices";
import { address } from "../../../data/about/feedbackAddress";
import { useEffect, useState } from "react";
import axios from "axios";

const AboutFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/feedbacks",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        // Lọc 3 feedback đầu tiên có rating = 5
        const filteredFeedbacks = response.data
          .filter((feedback) => Number(feedback.rating) === 5)
          .slice(0, 3)
          .map((feedback) => ({
            content: feedback.comment,
            name: feedback.customerName, // Sử dụng customerName từ API
          }));

        // In 3 feedback 5 sao ra console
        console.log("3 feedbacks with 5-star rating:", filteredFeedbacks);

        setFeedbacks(filteredFeedbacks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to load feedbacks. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#branches") {
      const branchesSection = document.getElementById("branches");
      if (branchesSection) {
        branchesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
        {/* Services */}
        <div className="space-y-8 p-6 md:p-8 lg:p-10 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 text-center">
            Professional Skincare Services
          </h2>
          <div className="space-y-4 md:space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 md:space-x-4 p-4 md:p-6 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
              >
                <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-gray-600 text-base md:text-lg">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-8 p-6 md:p-8 lg:p-10 border border-gray-100 rounded-lg shadow-sm bg-[#F9FAFB] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 text-center">
            Customer Feedback
          </h2>
          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading feedbacks...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No 5-star feedbacks available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="space-y-4 p-4 md:p-6 border border-gray-100 rounded-lg bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
                >
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 md:w-5 md:h-5 fill-current flex-shrink-0"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-base md:text-lg">
                    "{feedback.content}"
                  </p>
                  <p className="text-sm md:text-base text-gray-500">
                    {feedback.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Branches */}
        <div
          id="branches"
          className="space-y-8 p-6 md:p-8 lg:p-10 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 text-center">
            Our Locations
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {address.map((branch, index) => (
              <div
                key={index}
                className="text-center space-y-2 md:space-y-4 p-4 md:p-6 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
              >
                <div className="flex justify-center">
                  <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-600 flex-shrink-0" />
                </div>
                <h3 className="font-medium text-gray-800 text-lg md:text-xl">
                  Beautya {branch.city}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {branch.address}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFeedback;