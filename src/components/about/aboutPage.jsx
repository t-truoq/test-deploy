import AboutBeautya from "./aboutPage/aboutBeautya"
import AboutDoctor from "./aboutPage/aboutDoctor"
import AboutFeedback from "./aboutPage/aboutFeedback"
import AboutButton from "./aboutPage/aboutButton"

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <div className="relative h-[400px] bg-[url('/hero-about.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl font-light text-white">About Beautya</h1>
        </div>
      </div> */}

      {/* Main Content */}
      <AboutBeautya />
      <AboutDoctor />
      <AboutFeedback />

      {/* CTA Section */}
      <div className="py-16 text-center">
        <AboutButton
          text="Book Services Now"
          onClick={() => console.log("Booking appointment")}
          className="mx-auto"
        />
      </div>
    </div>
  )
}

export default AboutPage

