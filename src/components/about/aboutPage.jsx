"use client"

import AboutBeautya from "./aboutPage/aboutBeautya"
import AboutDoctor from "./aboutPage/aboutDoctor"
import AboutFeedback from "./aboutPage/aboutFeedback"

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      {/* Main Content */}
      <AboutBeautya />
      <AboutDoctor />
      <AboutFeedback />

      {/* CTA Section - Uncomment if needed */}
      {/* <div className="py-16 text-center w-full">
        <AboutButton
          text="Book Services Now"
          onClick={() => console.log("Booking appointment")}
          className="mx-auto"
        />
      </div> */}
    </div>
  )
}

export default AboutPage

