"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Slider from "./componentsHome/Slider"
import ServiceHome from "./componentsHome/ServiceHome"
import SkinAnalysis from "./componentsHome/SkinAnalysis"
import Treatment from "./componentsHome/Treatment"
import BlogHome from "./componentsHome/BlogHome"
import OurBrand from "./componentsHome/OurBrand"
import Testimonials from "./componentsHome/Testimonials"
import SpecialistShowcase from "./componentsHome/SpecialistShowcase"
import Newsletter from "./componentsHome/Newsletter"
import { PopupModal } from "../Popup/Popup"
import { Reveal } from "react-awesome-reveal" // Import Reveal từ react-awesome-reveal

export default function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenSkinTestModal")

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    localStorage.setItem("hasSeenSkinTestModal", "true")
  }

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClick = () => {
    navigate("/services")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen w-full">
      {/* Popup Modal */}
      <PopupModal isOpen={showModal} onClose={handleCloseModal} />

      {/* Hero Slider */}
      <Slider />

      {/* Featured Services */}
      <Reveal triggerOnce duration={600} delay={0} fraction={0.2}>
        <section className="py-16 md:py-24 w-full">
          <div className="max-w-[1920px] w-full mx-auto px-4 md:px-8">
            <Reveal triggerOnce duration={600} delay={100} fraction={0.2}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
                Our Premium Skincare Services
              </h2>
            </Reveal>
            <ServiceHome />
            <Reveal triggerOnce duration={600} delay={300} fraction={0.2}>
              <div className="text-center mt-12 md:mt-16">
                <button
                  onClick={handleClick}
                  className="inline-block bg-[#A10550] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a0443] transition-colors"
                >
                  View All Services
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </Reveal>

      {/* Skin Analysis Banner */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <SkinAnalysis />
      </Reveal>

      {/* Specialist Showcase */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <SpecialistShowcase />
      </Reveal>

      {/* Treatment Section */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <Treatment />
      </Reveal>

      {/* Testimonials Section */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <Testimonials />
      </Reveal>

      {/* Blog View */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <BlogHome />
      </Reveal>

      {/* Newsletter Section */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <Newsletter />
      </Reveal>

      {/* OUR BRAND */}
      <Reveal triggerOnce duration={600} fraction={0.2}>
        <OurBrand />
      </Reveal>
    </div>
  )
}