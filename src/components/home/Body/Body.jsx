// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import Slider from "./componentsHome/Slider"
// import ServiceHome from "./componentsHome/ServiceHome"
// import SkinAnalysis from "./componentsHome/SkinAnalysis"
// import Treatment from "./componentsHome/Treatment"
// import BlogHome from "./componentsHome/BlogHome"
// import OurBrand from "./componentsHome/OurBrand"
// import { PopupModal } from "../Popup/Popup"

// export default function Home() {
//   const navigate = useNavigate()
//   const [showModal, setShowModal] = useState(false)

//   useEffect(() => {
//     // Check if the user has already seen the modal
//     const hasSeenModal = localStorage.getItem("hasSeenSkinTestModal")

//     if (!hasSeenModal) {
//       // Show modal after a short delay for better user experience
//       const timer = setTimeout(() => {
//         setShowModal(true)
//       }, 1500)

//       return () => clearTimeout(timer)
//     }
//   }, [])

//   const handleCloseModal = () => {
//     setShowModal(false)
//     // Set flag in localStorage so the modal doesn't show again in this session
//     localStorage.setItem("hasSeenSkinTestModal", "true")
//   }

//   const handleBookNow = (serviceId) => {
//     navigate(`/services/${serviceId}`)
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     })
//   }

//   const handleClick = () => {
//     navigate("/services")
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     })
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Popup Modal */}
//       <PopupModal isOpen={showModal} onClose={handleCloseModal} />

//       {/* Hero Slider */}
//       <Slider />

//       {/* Featured Services */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-2xl font-bold text-center mb-12">Skincare Services</h2>
//           <ServiceHome />
//           <div className="text-center mt-12">
//             <button
//               onClick={handleClick}
//               className="inline-block bg-[#A10550] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a0443] transition-colors"
//             >
//               View All Services
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Skin Analysis Banner */}
//       <SkinAnalysis />

//       {/* Treatment Section */}
//       {/* <Treatment /> */}

//       {/* Blog View */}
//       <BlogHome />

//       {/* OUR BRAND */}
//       <OurBrand />
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Slider from "./componentsHome/Slider"
import ServiceHome from "./componentsHome/ServiceHome"
import SkinAnalysis from "./componentsHome/SkinAnalysis"
import Treatment from "./componentsHome/Treatment"
import BlogHome from "./componentsHome/BlogHome"
import OurBrand from "./componentsHome/OurBrand"
import Testimonials from "./componentsHome/Testimonials" // New component
import SpecialistShowcase from "./componentsHome/SpecialistShowcase" // New component
import Newsletter from "./componentsHome/Newsletter" // New component
import { PopupModal } from "../Popup/Popup"

export default function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if the user has already seen the modal
    const hasSeenModal = localStorage.getItem("hasSeenSkinTestModal")

    if (!hasSeenModal) {
      // Show modal after a short delay for better user experience
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    // Set flag in localStorage so the modal doesn't show again in this session
    localStorage.setItem("hasSeenSkinTestModal", "true")
  }

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleClick = () => {
    navigate("/services")
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="min-h-screen w-full">
      {/* Popup Modal */}
      <PopupModal isOpen={showModal} onClose={handleCloseModal} />

      {/* Hero Slider */}
      <Slider />

      {/* Featured Services */}
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] w-full mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
            Our Premium Skincare Services
          </h2>
          <ServiceHome />
          <div className="text-center mt-12 md:mt-16">
            <button
              onClick={handleClick}
              className="inline-block bg-[#A10550] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a0443] transition-colors"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Skin Analysis Banner */}
      <SkinAnalysis />

      {/* Specialist Showcase - New Section */}
      <SpecialistShowcase />

      {/* Treatment Section */}
      <Treatment />

      {/* Testimonials Section - New Section */}
      <Testimonials />

      {/* Blog View */}
      <BlogHome />

      {/* Newsletter Section - New Section */}
      <Newsletter />

      {/* OUR BRAND */}
      <OurBrand />
    </div>
  )
}

