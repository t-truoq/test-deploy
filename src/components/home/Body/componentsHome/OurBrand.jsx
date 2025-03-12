// "use client"
// import { useNavigate } from "react-router-dom"

// export default function OurBrand() {
//   const navigate = useNavigate()

//   return (
//     <section className="py-16 md:py-24 w-full">
//       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
//         <div className="bg-[#3D021E] rounded-2xl overflow-hidden w-full">
//           <div className="grid grid-cols-1 md:grid-cols-[60fr,40fr]">
//             {/* Text Content */}
//             <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
//               <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">Our Brand</h2>
//               <p className="mb-8 text-lg md:text-xl leading-relaxed text-white/90">
//                 We Believe That Beauty Thrives In Diversity And Discovery. Our Purpose Is To Expand The Way The World
//                 Sees Beauty By Empowering The Extraordinary In Each Of Us.
//               </p>
//               <div>
//                 <button
//                   onClick={() => {
//                     navigate("/about")
//                     window.scrollTo({
//                       top: 0,
//                       behavior: "smooth",
//                     })
//                   }}
//                   className="border-2 border-white/20 text-white px-8 py-3 rounded-lg text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
//                 >
//                   Discover More
//                 </button>
//               </div>
//             </div>

//             {/* Image */}
//             <div className="relative h-[300px] md:h-auto">
//               <img
//                 src="./home/brand/ourBrand.webp"
//                 alt="Diverse beauty representation"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"
import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function OurBrand() {
  const navigate = useNavigate()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
  const handleViewOurBrand = () => {
    navigate("/about"); // Điều hướng đến trang SpecialistPage
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="bg-[#3D021E] rounded-2xl overflow-hidden w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-[60fr,40fr]">
            {/* Text Content */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <motion.h2 variants={itemVariants} className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Our Brand
              </motion.h2>
              <motion.p variants={itemVariants} className="mb-8 text-lg md:text-xl leading-relaxed text-white/90">
                We Believe That Beauty Thrives In Diversity And Discovery. Our Purpose Is To Expand The Way The World
                Sees Beauty By Empowering The Extraordinary In Each Of Us.
              </motion.p>
              <motion.div variants={itemVariants}>
                <button
                  onClick={handleViewOurBrand} 
                  className="border-2 border-white/20 text-white px-8 py-3 rounded-lg text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  Discover More
                </button>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div variants={itemVariants} className="relative h-[300px] md:h-auto">
              <img
                src="./home/brand/ourBrand.webp"
                alt="Diverse beauty representation"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

