"use client";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  CheckCircle,
  Heart,
  Shield,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchService = async () => {
      if (!token) {
        setError("Please login to view service details");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("Service data:", response.data);
        setService(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service:", err);
        if (err.response?.status === 404) {
          setError("Service not found");
        } else if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(
            err.response?.data?.message || "Could not load service details"
          );
        }
        setLoading(false);
      }
    };

    fetchService();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        Loading service details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-red-600">
        {error}{" "}
        <Link to="/login" className="text-[#A10550] underline">
          Login Now
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        Service not found
      </div>
    );
  }

  // Calculate prices based on duration
  const durationPrices = {
    30: service.price,
    45: service.price * 1.5,
    60: service.price * 2,
  };
  const formatVND = (price) => {
    return price.toLocaleString("vi-VN") + " ₫"; // Định dạng theo kiểu Việt Nam
  };

  // Get image URL from images array (first image if available)
  const imageUrl =
    service.images && service.images.length > 0
      ? service.images[0].url
      : "/placeholder.svg";

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
  };

  const handleBookNow = () => {
    // Create a service object with all necessary properties
    const serviceToBook = {
      serviceId: service.serviceId,
      name: service.name,
      price: service.price,
      duration: service.duration,
    };

    // Store the service in localStorage to be picked up by the service list page
    const existingServices = JSON.parse(
      localStorage.getItem("selectedServicesForBooking") || "[]"
    );

    // Check if service is already in the list to avoid duplicates
    if (!existingServices.some((s) => s.serviceId === service.serviceId)) {
      existingServices.push(serviceToBook);
      localStorage.setItem(
        "selectedServicesForBooking",
        JSON.stringify(existingServices)
      );
    }

    // Navigate to the services page
    navigate("/services");
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link
            to="/services"
            className="text-[#A10550] hover:underline flex items-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Services
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="flex flex-col">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={service.name}
              className="w-full h-[500px] object-cover rounded-xl shadow-lg mb-6"
            />

            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-4">
                Recommended Skin Types
              </h2>
              <ul className="space-y-2">
                {service.recommendedSkinTypes.map((type, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle
                      className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-600">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-playfair font-bold text-[#A10550] mb-6">
              {service.name}
            </h1>
            <p className="text-xl text-gray-600 mb-8">{service.description}</p>

            <div className="bg-gray-100 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Service Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="text-[#A10550] mr-4" size={24} />
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-gray-600">{service.duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="text-[#A10550] mr-4" size={24} />
                  <div>
                    <p className="font-semibold">Price</p>
                    <p className="text-gray-600">
                      {formatVND(durationPrices[selectedDuration])}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-[#A10550] text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#8a0443] transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Tabs for additional information */}
        <div className="mb-16">
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === "about"
                    ? "border-[#A10550] text-[#A10550]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                About Spa Treatments
              </button>
              <button
                onClick={() => setActiveTab("benefits")}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === "benefits"
                    ? "border-[#A10550] text-[#A10550]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === "faq"
                    ? "border-[#A10550] text-[#A10550]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="mb-16">
            {activeTab === "about" && (
              <div className="prose max-w-none">
                <h2 className="text-3xl font-bold mb-6">
                  The Importance of Professional Spa Treatments
                </h2>
                <p className="text-lg mb-6">
                  In today's fast-paced world, taking time for self-care is not
                  just a luxury—it's a necessity. Professional spa treatments
                  offer a sanctuary where you can rejuvenate both body and mind,
                  providing benefits that extend far beyond mere relaxation.
                </p>
                <p className="text-lg mb-6">
                  At Beautya, we believe that regular spa treatments are an
                  essential component of a holistic beauty and wellness routine.
                  Our professional treatments are designed to address specific
                  concerns while providing a therapeutic experience that helps
                  reduce stress and promote overall well-being.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">
                      Why Choose Professional Treatments?
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                          size={20}
                        />
                        <span>Expert analysis of your specific needs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                          size={20}
                        />
                        <span>
                          Access to professional-grade products and technologies
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                          size={20}
                        />
                        <span>Customized treatments for optimal results</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                          size={20}
                        />
                        <span>
                          Techniques that enhance product absorption and
                          efficacy
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                          size={20}
                        />
                        <span>Guidance for maintaining results at home</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-lg mb-6">
                  While at-home skincare is important for daily maintenance,
                  professional treatments offer deeper, more intensive care that
                  addresses concerns at their source. Our specialists combine
                  scientific knowledge with skilled techniques to deliver
                  treatments that produce visible, long-lasting results.
                </p>
                <p className="text-lg">
                  Whether you're looking to address specific concerns or simply
                  maintain healthy, radiant skin, our range of treatments offers
                  something for everyone. We recommend consulting with our
                  specialists to create a personalized treatment plan that
                  aligns with your unique needs and goals.
                </p>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  The Benefits of Regular Spa Treatments
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="mb-4">
                      <Shield className="text-[#A10550] h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Skin Protection
                    </h3>
                    <p className="text-gray-600">
                      Professional treatments strengthen your skin's natural
                      barrier, helping it defend against environmental
                      aggressors like pollution, UV rays, and harsh weather
                      conditions.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="mb-4">
                      <RefreshCw className="text-[#A10550] h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Cell Regeneration
                    </h3>
                    <p className="text-gray-600">
                      Many spa treatments stimulate cell turnover and collagen
                      production, helping your skin renew itself more
                      efficiently for a fresher, more youthful appearance.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="mb-4">
                      <Sparkles className="text-[#A10550] h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Deep Cleansing
                    </h3>
                    <p className="text-gray-600">
                      Professional treatments provide deeper cleansing than
                      daily routines, removing impurities, excess oil, and dead
                      skin cells that can lead to dullness and breakouts.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-xl mb-12">
                  <h3 className="text-2xl font-semibold mb-6">
                    Holistic Benefits Beyond Beauty
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <p>Stress reduction and improved mental well-being</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <p>Enhanced circulation and lymphatic drainage</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <p>Relief from muscle tension and physical discomfort</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <p>Improved sleep quality and energy levels</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <p>Boosted immune system function</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <p>Time for mindfulness and mental reset</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md">
                  <h3 className="text-2xl font-semibold mb-6">
                    The Science Behind Spa Treatments
                  </h3>
                  <p className="text-lg mb-4">
                    Modern spa treatments combine ancient wisdom with
                    cutting-edge science. Many of our treatments utilize
                    advanced technologies and scientifically-proven ingredients
                    to deliver measurable results:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold">Exfoliation Treatments</p>
                        <p className="text-gray-600">
                          Remove the buildup of dead skin cells, allowing better
                          product penetration and revealing fresher skin.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold">Hydration Therapies</p>
                        <p className="text-gray-600">
                          Deliver moisture to deeper skin layers, improving
                          elasticity and plumpness.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold">Anti-aging Treatments</p>
                        <p className="text-gray-600">
                          Stimulate collagen and elastin production to reduce
                          fine lines and improve skin firmness.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle
                        className="text-[#A10550] mr-3 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="font-semibold">Massage Techniques</p>
                        <p className="text-gray-600">
                          Enhance circulation, reduce inflammation, and promote
                          lymphatic drainage.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      How often should I get spa treatments?
                    </h3>
                    <p className="text-gray-600">
                      The ideal frequency depends on your specific skin type,
                      concerns, and the type of treatment. Generally, facial
                      treatments are recommended every 4-6 weeks, which aligns
                      with your skin's natural renewal cycle. More intensive
                      treatments may require more time between sessions. Our
                      specialists can recommend a personalized treatment
                      schedule during your consultation.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      Are spa treatments suitable for all skin types?
                    </h3>
                    <p className="text-gray-600">
                      We offer a wide range of treatments designed for different
                      skin types and concerns. During your initial consultation,
                      our specialists will assess your skin and recommend
                      treatments that are safe and effective for your specific
                      needs. We can modify many treatments to accommodate
                      sensitive skin or specific conditions.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      What should I do before my spa treatment?
                    </h3>
                    <p className="text-gray-600">
                      For most treatments, we recommend arriving with clean skin
                      (no makeup). Avoid sun exposure, exfoliation, or using
                      active ingredients like retinol for 24-48 hours before
                      your treatment. Stay hydrated and avoid alcohol before
                      your appointment. If you're taking any medications or have
                      health concerns, please inform us during booking.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      How can I maintain results between treatments?
                    </h3>
                    <p className="text-gray-600">
                      Following a consistent at-home skincare routine is
                      essential for maintaining and enhancing the results of
                      your professional treatments. Our specialists will
                      recommend products and routines tailored to your skin's
                      needs. Generally, this includes proper cleansing,
                      hydration, sun protection, and targeted treatments for
                      your specific concerns.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                      Will I see immediate results from my treatment?
                    </h3>
                    <p className="text-gray-600">
                      Many treatments provide immediate visible benefits, such
                      as increased hydration, improved texture, and a healthy
                      glow. However, the most significant results develop over
                      time with consistent treatments. Some treatments may cause
                      temporary redness or sensitivity, which typically subsides
                      within 24-48 hours, revealing the true benefits afterward.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The Science of Beauty */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">The Science of Beauty</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6">
                Beauty is more than skin deep—it's rooted in science. Our skin,
                the body's largest organ, is a complex ecosystem that requires
                proper care and attention to maintain its health and appearance.
              </p>
              <p className="text-lg mb-6">
                Modern beauty treatments are based on scientific research into
                skin biology, aging processes, and the efficacy of various
                ingredients and technologies. This evidence-based approach
                ensures that our treatments deliver real, measurable results.
              </p>
              <p className="text-lg">
                At Beautya, we stay at the forefront of beauty science,
                continuously updating our treatments to incorporate the latest
                advancements. Our approach combines time-tested techniques with
                innovative technologies to provide comprehensive care that
                addresses both immediate concerns and long-term skin health.
              </p>
            </div>
          </div>
        </div>

        {/* Self-Care Importance */}
        <div className="bg-[#F8F0F5] p-8 rounded-xl mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            The Importance of Self-Care
          </h2>
          <p className="text-xl text-center mb-8 max-w-4xl mx-auto">
            In today's demanding world, taking time for self-care isn't
            selfish—it's essential. Regular spa treatments offer a valuable
            opportunity to disconnect, recharge, and invest in your well-being.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Heart className="text-[#A10550] h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mental Well-being</h3>
              <p className="text-gray-600">
                Spa treatments provide a sanctuary from daily stressors, helping
                to reduce anxiety and promote mental clarity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <RefreshCw className="text-[#A10550] h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Physical Renewal</h3>
              <p className="text-gray-600">
                Beyond aesthetic benefits, treatments improve circulation,
                reduce tension, and support your body's natural healing
                processes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="text-[#A10550] h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Confidence Boost</h3>
              <p className="text-gray-600">
                Looking your best naturally enhances how you feel, creating a
                positive cycle that radiates through all aspects of life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
