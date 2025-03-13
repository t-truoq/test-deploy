"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion, useInView } from "framer-motion"

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Phung Thanh Do",
    role: "Regular Client",
    image: "./home/testimonials/domixi.webp",
    quote:
      "I've been coming to Beautya for over a year now, and the results have been amazing. My skin has never looked better, and the staff is always so professional and friendly.",
    rating: 5,
  },
  {
    id: 2,
    name: "Hoa Minzy",
    role: "New Client",
    image: "./home/testimonials/hoaminzy.jpg",
    quote:
      "After just one facial treatment, I noticed a significant improvement in my skin texture. The personalized approach and attention to detail really sets this place apart.",
    rating: 5,
  },
  {
    id: 3,
    name: "Truong Tuan Tu",
    role: "Monthly Subscriber",
    image: "./home/testimonials/sena.jpg",
    quote:
      "The skin analysis they provided was eye-opening. The customized skincare routine has completely transformed my complexion. I'm so grateful I found Beautya!",
    rating: 5,
  },
  {
    id: 4,
    name: "JungKook-BTS",
    role: "Regular Client",
    image: "./home/testimonials/jungko.jpg",
    quote:
      "As someone who never paid much attention to skincare, I was skeptical at first. But the results speak for themselves. My skin looks healthier and younger.",
    rating: 4,
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

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
  }

  return (
    <section className="py-16 md:py-24 w-full bg-pink-50" ref={ref}>
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied clients about their experiences and transformations with our skincare services
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative max-w-5xl mx-auto">
            {/* Testimonial Slider */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={testimonial.image || "/placeholder.svg?height=96&width=96"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center md:text-left">
                          <h3 className="text-xl md:text-2xl font-bold mb-2">{testimonial.name}</h3>
                          <p className="text-gray-600 mb-3">{testimonial.role}</p>
                          <div className="flex justify-center md:justify-start">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <blockquote className="text-lg md:text-xl text-gray-700 italic">"{testimonial.quote}"</blockquote>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
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

            {/* Dots Indicator */}
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
  )
}

