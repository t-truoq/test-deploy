"use client"
import { useNavigate } from "react-router-dom"

export default function OurBrand() {
  const navigate = useNavigate()

  return (
    <section className="mx-4 lg:mx-auto max-w-6xl h-[280px] rounded-2xl overflow-hidden mb-16">
      <div className="bg-[#3D021E] h-full">
        <div className="grid grid-cols-1 md:grid-cols-[60fr,40fr] h-full">
          {/* Text Content */}
          <div className="flex flex-col justify-center p-8">
            <h2 className="mb-3 text-2xl lg:text-3xl font-bold text-white">Our Brand</h2>
            <p className="mb-4 text-sm lg:text-base leading-snug text-white/90">
              We Believe That Beauty Thrives In Diversity And Discovery. Our Purpose Is To Expand The Way The World Sees
              Beauty By Empowering The Extraordinary In Each Of Us.
            </p>
            <div>
              <button
                onClick={() => {
                  navigate("/about")
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }}
                className="border border-white/20 text-white px-6 py-1.5 text-sm hover:bg-white/10 transition-colors"
              >
                Discover More
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="./home/brand/ourBrand.webp"
              alt="Diverse beauty representation"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

