
// "use client"
// import { useNavigate } from "react-router-dom"

// export default function SkinAnalysis() {
//   const navigate = useNavigate()

//   return (
//     <section className="py-16 md:py-24 w-full">
//       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
//         <div className="bg-[#3D021E] rounded-2xl overflow-hidden w-full">
//           <div className="flex flex-col md:flex-row h-full">
//             <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
//                 NEW Virtual Skincare Analysis
//               </h2>
//               <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
//                 Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And
//                 Provides The Most Personalized Recommendations.
//               </p>
//               <div className="space-y-4">
//                 <p className="text-white/90 text-lg">Scan With Your Phone To Get Started</p>
//                 <p className="text-white/90 text-lg">Or</p>
//                 <button
//                   onClick={() => navigate("/quiz")}
//                   className="border-2 border-white/20 text-white px-8 py-3 rounded-lg text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
//                 >
//                   Answer A Few Questions
//                 </button>
//               </div>
//             </div>
//             <div className="w-full md:w-1/2 h-[300px] md:h-auto">
//               <img
//                 src="./home/newVisual/newVisual.jpg"
//                 alt="Diverse faces showcasing skincare"
//                 className="w-full h-full object-cover object-center"
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

export default function SkinAnalysis() {
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
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                NEW Virtual Skincare Analysis
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And
                Provides The Most Personalized Recommendations.
              </motion.p>
              <motion.div variants={itemVariants} className="space-y-4">
                <p className="text-white/90 text-lg">Scan With Your Phone To Get Started</p>
                <p className="text-white/90 text-lg">Or</p>
                <button
                  onClick={() => navigate("/quiz")}
                  className="border-2 border-white/20 text-white px-8 py-3 rounded-lg text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  Answer A Few Questions
                </button>
              </motion.div>
            </div>
            <motion.div variants={itemVariants} className="w-full md:w-1/2 h-[300px] md:h-auto">
              <img
                src="./home/newVisual/newVisual.jpg"
                alt="Diverse faces showcasing skincare"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

