// import React from "react";

// export default function Treatment() {
//   return (
//     <section className="py-16">
//       <div className="max-w-7xl mx-auto px-4">
//         <img
//           src="./home/treatment/treatment.jpg"
//           alt="Treatment"
//           className="w-full h-auto object-cover rounded-2xl"
//         />
//       </div>
//     </section>
//   );
// }
"use client"

export default function Treatment() {
  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Our Signature Treatments</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our most popular and effective treatments designed to rejuvenate your skin and enhance your
            natural beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden group h-[400px] md:h-[500px]">
            <img
              src="./home/treatment/treatment.jpg"
              alt="Facial Treatment"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Luxury Facial Treatments</h3>
              <p className="text-white/90 mb-6">
                Our signature facials combine advanced techniques with premium products for transformative results.
              </p>
              <button
                onClick={() => (window.location.href = "/services")}
                className="bg-white/20 hover:bg-white/30 text-white w-fit px-6 py-3 rounded-lg transition-colors"
              >
                Explore Treatments
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden group h-[400px] md:h-[500px]">
            <img
              src="./home/treatment/treatment2.jpg"
              alt="Body Treatment"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Advanced Body Therapies</h3>
              <p className="text-white/90 mb-6">
                Rejuvenate your body with our specialized treatments designed for total relaxation and wellness.
              </p>
              <button
                onClick={() => (window.location.href = "/services")}
                className="bg-white/20 hover:bg-white/30 text-white w-fit px-6 py-3 rounded-lg transition-colors"
              >
                Discover More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

