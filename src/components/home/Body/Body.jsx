import { useState, useEffect } from "react";

const Body = () => {
  const products = [
    {
      image: "/products/1.jpg",
      title: "Beautya Capture Total Dreamskin Care & Perfect",
      description: "Plumping Gloss - Instant And Long-Term Volume Effect 24h Hydration",
      price: "$76.00",
    },
    {
      image: "/products/2.jpg",
      title: "Hydrating Rose Water Toner",
      description: "Alcohol-free Facial Toner with Natural Rose Extract for All Skin Types",
      price: "$45.00",
    },
    {
      image: "/products/3.jpg",
      title: "Vitamin C Brightening Serum",
      description: "Advanced Formula with 20% Vitamin C for Dark Spots and Even Skin Tone",
      price: "$89.00",
    },
    {
      image: "/products/4.jpg",
      title: "Hyaluronic Acid Moisturizer",
      description: "Deep Hydration Cream with 72-Hour Moisture Lock Technology",
      price: "$65.00",
    },
  ];

  return (
    <div className="w-full">
      {/* 🌟 Slider Section */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-[600px]">
          <img src="/slider/1.jpg" className="absolute w-full h-full object-cover" alt="Slide 1" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Unlock Your Natural Glow</h1>
            <button
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-300 transition"
              onClick={() => (window.location.href = "/services")}
            >
              Know More
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 Products Categories Section */}
      <div className="container mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center border-b-4 border-orange-500 inline-block mb-6">
          Products' Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <img src="/products/1.jpg" className="w-full max-h-[300px] object-cover rounded-lg shadow-md hover:scale-105 transition" alt="Women Make Up" />
            <h5 className="mt-3 text-lg font-semibold">Dưỡng ẩm</h5>
          </div>
          <div className="text-center">
            <img src="/products/2.jpg" className="w-full max-h-[300px] object-cover rounded-lg shadow-md hover:scale-105 transition" alt="Women Skincare" />
            <h5 className="mt-3 text-lg font-semibold">Sữa rửa mặt</h5>
          </div>
          <div className="text-center">
            <img src="/products/3.jpg" className="w-full max-h-[300px] object-cover rounded-lg shadow-md hover:scale-105 transition" alt="Gifts & Sets" />
            <h5 className="mt-3 text-lg font-semibold">Kem chống nắng</h5>
          </div>
        </div>
      </div>

      {/* 🌟 Virtual Skincare Analysis Section */}
      <div className="container mx-auto mt-10 p-6 bg-[#3D021E] text-white rounded-lg shadow-lg flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h3 className="text-2xl font-bold">NEW Virtual Skincare Analysis</h3>
          <p className="mt-3">
            Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And Provides The Most Personalized Recommendations.
          </p>
          <p className="mt-2 font-semibold">Scan With Your Phone To Get Started</p>
          <button className="mt-4 px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition">
            Answer A Few Questions
          </button>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <img src="/newVisual/newVisual.jpg" className="w-full h-[300px] object-cover rounded-lg" alt="Virtual Skincare Analysis" />
        </div>
      </div>

      {/* 🌟 Best Sellers Section */}
      <div className="container mx-auto mt-10 mb-10">
        <h2 className="text-3xl font-bold text-center border-b-4 border-orange-500 inline-block mb-6">
          Our Best Sellers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <img src={product.image} className="w-full h-64 object-cover rounded-lg" alt={product.title} />
              <h3 className="mt-4 text-xl font-bold">{product.title}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="mt-3 font-bold text-lg">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
