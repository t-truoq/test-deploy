import React from 'react'

export default function SkinAnalysis() {
  return (
     <section className="bg-[#3D021E] rounded-2xl overflow-hidden mx-4 lg:mx-auto max-w-6xl h-[280px]">
              <div className="flex h-full">
                <div className="w-[50%] p-8 flex flex-col justify-center">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    NEW Virtual Skincare Analysis
                  </h2>
                  <p className="text-sm lg:text-base text-white/90 mb-4 leading-snug">
                    Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And
                    Provides The Most Personalized Recommendations.
                  </p>
                  <div className="space-y-2">
                    <p className="text-white/90 text-sm">Scan With Your Phone To Get Started</p>
                    <p className="text-white/90 text-sm">Or</p>
                    <button className="border border-white/20 text-white px-6 py-1.5 rounded text-sm hover:bg-white/10 transition-colors">
                      Answer A Few Questions
                    </button>
                  </div>
                </div>
                <div className="w-[50%] relative">
                  <img
                    src="./home/newVisual/newVisual.jpg"
                    alt="Diverse faces showcasing skincare"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </section>
  )
}
