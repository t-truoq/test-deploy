"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks", {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("API Response:", response.data);

      const data = Array.isArray(response.data) ? response.data : [];
      
      // Filter for 5-star ratings only
      const transformedData = data
        .filter(feedback => feedback.rating === 5) // Only keep 5-star feedback
        .map(feedback => ({
          id: feedback.feedbackId,
          name: feedback.customerName || "Anonymous",
          rating: 5, // Since we're filtering for 5 stars, this is always 5
          message: feedback.comment || "No comment provided",
          image: "/placeholder.svg?height=96&width=96"
        }))
        .slice(0, 5); // Still limit to 5 testimonials

      console.log("Transformed Data (5-star only):", transformedData);

      if (transformedData.length === 0) {
        setError("No 5-star testimonials found in the database.");
        setTestimonials([]);
      } else {
        setTestimonials(transformedData);
        setError(null);
      }
      setLoading(false);
      console.log("State after update:", { testimonials: transformedData, loading: false, error: null });
    } catch (error) {
      console.error("Error fetching testimonials:", error.message || error);
      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.statusText}. Please check the backend.`);
      } else {
        setError("Failed to connect to the API. Please ensure ngrok is running and the URL is valid.");
      }
      setTestimonials([]);
      setLoading(false);
      console.log("State after error:", { testimonials: [], loading: false, error });
    }
  };

  useEffect(() => {
    console.log("useEffect triggered on mount or F5");
    setLoading(true);
    setError(null);
    setTestimonials([]);
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  console.log("Rendering with state:", { loading, error, testimonials });

  if (loading) {
    return (
      <section className="py-16 md:py-24 w-full bg-pink-50">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 text-center">
          <p>Loading testimonials...</p>
          <button onClick={fetchTestimonials} className="mt-4 text-blue-500 hover:underline">
            Refresh
          </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 w-full bg-pink-50">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-600 mt-2">Current URL: https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks</p>
          <button onClick={fetchTestimonials} className="mt-4 text-blue-500 hover:underline">
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <section className="py-16 md:py-24 w-full bg-pink-50">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 text-center">
          <p>No 5-star testimonials available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 w-full bg-pink-50">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              What Our Clients Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied clients about their experiences and
              transformations with our skincare services
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center md:text-left">
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {testimonial.name}
                          </h3>
                          <div className="flex justify-center md:justify-start">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-500 fill-yellow-500" // All stars are 5, so always yellow
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <blockquote className="text-lg md:text-xl text-gray-700 italic">
                        "{testimonial.message}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-[#A10550]" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}