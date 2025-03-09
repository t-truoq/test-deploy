// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// export default function SkinAnalysis() {
//   const navigate = useNavigate()

//   return (
//      <section className="bg-[#3D021E] rounded-2xl overflow-hidden mx-4 lg:mx-auto max-w-6xl h-[280px]">
//               <div className="flex h-full">
//                 <div className="w-[50%] p-8 flex flex-col justify-center">
//                   <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
//                     NEW Virtual Skincare Analysis
//                   </h2>
//                   <p className="text-sm lg:text-base text-white/90 mb-4 leading-snug">
//                     Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And
//                     Provides The Most Personalized Recommendations.
//                   </p>
//                   <div className="space-y-2">
//                     <p className="text-white/90 text-sm">Scan With Your Phone To Get Started</p>
//                     <p className="text-white/90 text-sm">Or</p>
//                     <button 
//                       onClick={() => navigate('/quiz')}
//                       className="border border-white/20 text-white px-6 py-1.5 rounded text-sm hover:bg-white/10 transition-colors"
//                     >
//                       Answer A Few Questions
//                     </button>
//                   </div>
//                 </div>
//                 <div className="w-[50%] relative">
//                   <img
//                     src="./home/newVisual/newVisual.jpg"
//                     alt="Diverse faces showcasing skincare"
//                     className="w-full h-full object-cover object-center"
//                   />
//                 </div>
//               </div>
//             </section>
//   )
// }
"use client"
import { useNavigate } from "react-router-dom"

export default function SkinAnalysis() {
  const navigate = useNavigate()

  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="bg-[#3D021E] rounded-2xl overflow-hidden w-full">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                NEW Virtual Skincare Analysis
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And
                Provides The Most Personalized Recommendations.
              </p>
              <div className="space-y-4">
                <p className="text-white/90 text-lg">Scan With Your Phone To Get Started</p>
                <p className="text-white/90 text-lg">Or</p>
                <button
                  onClick={() => navigate("/quiz")}
                  className="border-2 border-white/20 text-white px-8 py-3 rounded-lg text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  Answer A Few Questions
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-[300px] md:h-auto">
              <img
                src="./home/newVisual/newVisual.jpg"
                alt="Diverse faces showcasing skincare"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

