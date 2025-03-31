"use client";

import axios from "axios";
import { useState, useEffect } from "react";

export default function Newsletter() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    setIsLoading(true);

    if (!formData.fullName.trim()) {
      setError("Please enter your name !");
      setIsLoading(false);
      return;
    }
    if (!formData.phoneNumber || !/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      setError("Only 10 or 11 numbers for phone number");
      setIsLoading(false);
      return;
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter correct email !");
      setIsLoading(false);
      return;
    }
    if (!formData.message.trim()) {
      setError("Please enter your requirement !");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/contact",
        formData,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      console.log("Contact request response:", response.data);
      setSubmitted(true);
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting contact:", error);
      setError(
        error.response?.data?.message || "Cannot sent requirement. Try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash; // Lấy hash từ URL (ví dụ: #newsletter)
    if (hash === "#newsletter") {
      const newsletterSection = document.getElementById("newsletter");
      if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <section className="py-16 md:py-24 w-full bg-gradient-to-r from-[#3D021E] to-[#A10550]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div id="newsletter" className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Get Support
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Fill in the information below to receive support from us regarding
            skincare issues and services
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-xl mx-auto"
          >
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Full Name"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Phone Number"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Email Address"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Support Request Message"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white min-h-[120px]"
              aria-label="Support Request Message"
            />
            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className={`bg-white text-[#A10550] px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </button>
          </form>

          {error && <p className="mt-4 text-red-300">{error}</p>}
          {submitted && (
            <p className="mt-4 text-green-300">
              Thank you! We will contact you soon.
            </p>
          )}

          <p className="mt-6 text-white/70 text-sm">
            By submitting this request, you agree to our Privacy Policy and
            allow us to contact you.
          </p>
        </div>
      </div>
    </section>
  );
}
