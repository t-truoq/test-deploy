"use client"

import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Here you would typically send the email to your backend
    console.log("Subscribing email:", email)

    // Simulate success
    setSubmitted(true)
    setError("")
    setEmail("")

    // Reset the success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  return (
    <section className="py-16 md:py-24 w-full bg-gradient-to-r from-[#3D021E] to-[#A10550]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Subscribe to our newsletter for exclusive skincare tips, special offers, and the latest beauty trends
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-white text-[#A10550] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>

          {error && <p className="mt-4 text-red-300">{error}</p>}

          {submitted && <p className="mt-4 text-green-300">Thank you for subscribing!</p>}

          <p className="mt-6 text-white/70 text-sm">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  )
}

