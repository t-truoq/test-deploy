
"use client"
import { slides } from "../../../../data/home/slider/slider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Increased time for better user experience

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[85vh]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-full w-full">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40">
              <div className="max-w-[1920px] w-full mx-auto h-full flex flex-col justify-center items-center text-center text-white px-4 md:px-8">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6">{slide.title}</h1>
                <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mb-8 opacity-90">
                  {slide.description || "Experience the ultimate in skincare luxury and rejuvenation."}
                </p>
                <button
                  onClick={() => (window.location.href = "/services")}
                  className="bg-[#A10550] hover:bg-[#8a0443] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Explore Our Services
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white/50 transition-colors z-10"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white/50 transition-colors z-10"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}

