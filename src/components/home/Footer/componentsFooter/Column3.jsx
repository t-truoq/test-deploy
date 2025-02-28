import React from "react";

export default function Column3() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Keep In Touch With Beautya</h3>
      <form className="flex space-x-2 mb-4">
        <input
          type="email"
          placeholder="Email Address"
          className="w-2/3 px-3 py-2 bg-transparent border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button className="px-4 py-2 bg-white text-[#3D021E] font-bold hover:bg-gray-300 transition">
          Subscribe
        </button>
      </form>
      <p className="text-sm text-gray-300">
        By submitting your email, you agree to receive advertising emails from
        Beautya. Please review our Privacy Policy.
      </p>

      {/* Icons mạng xã hội */}
      <div className="flex space-x-4 mt-4">
        <a href="#" className="text-2xl hover:text-gray-300">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="text-2xl hover:text-gray-300">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" className="text-2xl hover:text-gray-300">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="text-2xl hover:text-gray-300">
          <i className="fab fa-pinterest"></i>
        </a>
        <a href="#" className="text-2xl hover:text-gray-300">
          <i className="fab fa-tiktok"></i>
        </a>
      </div>
    </div>
  );
}
