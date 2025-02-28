import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function OurBrand() {

  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Brand</h2>
        <div className="overflow-hidden rounded-3xl bg-[#3D021E] max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[60fr,40fr]">
            {/* Text Content */}
            <div className="flex flex-col justify-center p-8 md:p-10">
              <h2 className="mb-4 text-4xl font-bold text-white">Our Brand</h2>
              <p className="mb-6 text-xl leading-relaxed text-white/90 max-w">
                We Believe That Beauty Thrives In Diversity And Discovery. Our
                Purpose Is To Expand The Way The World Sees Beauty By Empowering
                The Extraordinary In Each Of Us.
              </p>
              <div>
                <button
                  onClick={() => {
                    navigate("/about");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="inline-flex border border-white/20 px-6 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  Discover More
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[250px] md:h-[330px]">
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
