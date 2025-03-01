const AboutBeautya = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[600px]">
        <img 
          src="./about/AboutHeader.png" 
          alt="Beautya Spa Interior" 
          className="object-cover brightness-95 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/30">
          <div className="container mx-auto h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl text-white font-light mb-6">About Beautya</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light">
              Your journey to perfect skin begins here
            </p>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Main Introduction */}
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-light text-gray-800">Beautya – The Beginning of Perfect Skin</h2>
              <div className="w-20 h-[2px] bg-pink-500 mx-auto"></div>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Have you ever wished for healthy, radiant skin without having to try countless products? Beautya –
                Skincare Booking Services was created to help you achieve that dream.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px]">
                <img 
                  src="./about/AboutBody.jpg" 
                  alt="Beautya Mission" 
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-light text-gray-800 mb-4">Mission & Vision</h3>
                  <div className="w-16 h-[2px] bg-pink-500"></div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  At Beautya, we understand that every skin has its own story, and we want to help you write the most
                  beautiful one. Our expert team is constantly researching to provide personalized treatments tailored
                  to each customer`&apos;`s needs.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our goal is to become the leading skincare booking system, allowing customers to easily find suitable
                  services, book appointments quickly, and enjoy a professional beauty experience.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {[
                {
                  title: "Easy Booking",
                  description: "Select services and specialists with just a few clicks",
                },
                {
                  title: "Top Experts",
                  description: "Experienced dermatologists and skincare specialists",
                },
                {
                  title: "Advanced Technology",
                  description: "Latest beauty techniques for optimal results",
                },
                {
                  title: "Luxurious Space",
                  description: "Elegant and comfortable treatment environment",
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center space-y-3 p-6 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
                >
                  <h4 className="text-xl font-medium text-gray-800">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutBeautya

