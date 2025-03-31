"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const autoPlayRef = useRef(null)

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/feedbacks",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      )

      const data = Array.isArray(response.data) ? response.data : []

      // Filter for 5-star ratings only
      const transformedData = data
        .filter((feedback) => feedback.rating === 5)
        .map((feedback) => ({
          id: feedback.feedbackId,
          name: feedback.customerName || "Anonymous",
          rating: 5,
          message: feedback.comment || "No comment provided",
        }))

      if (transformedData.length === 0) {
        setError("No 5-star testimonials found.")
        setTestimonials([])
      } else {
        setTestimonials(transformedData)
        setError(null)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      setError("Failed to load testimonials.")
      setTestimonials([])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (testimonials.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 2000) // Auto-rotate every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [testimonials])

  const nextTestimonial = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    resetAutoPlay()
  }

  const prevTestimonial = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    resetAutoPlay()
  }

  const goToTestimonial = (index) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    setCurrentIndex(index)
    resetAutoPlay()
  }

  const resetAutoPlay = () => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    )
  }

  if (!testimonials.length) {
    return (
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No testimonials available at this time.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-[#A10550] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied clients about their experiences with our skincare services
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="relative h-[350px] md:h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 h-full flex flex-col justify-between">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-pink-100 rotate-180" />
                    <div className="pt-6">
                      <p className="text-gray-700 text-lg leading-relaxed line-clamp-4 overflow-hidden">
                        {testimonials[currentIndex].message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-center md:flex-row md:justify-between md:items-center">
                    <div className="flex flex-col items-center md:items-start">
                      <h3 className="font-semibold text-lg text-gray-900">{testimonials[currentIndex].name}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>

                    {/* <div className="mt-4 md:mt-0 flex items-center space-x-1">
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {testimonials.length}
                      </span>
                    </div> */}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-pink-200"
            aria-label="Previous testimonial"
            disabled={testimonials.length <= 1}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-pink-200"
            aria-label="Next testimonial"
            disabled={testimonials.length <= 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Indicator Dots */}
          {/* <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  index === currentIndex ? "bg-[#A10550] w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  )
}

