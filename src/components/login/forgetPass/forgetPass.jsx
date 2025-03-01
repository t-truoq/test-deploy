import React, { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import LeftLogin from '../componentsLogin/LeftLogin'

export default function ForgetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log({ email })
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LeftLogin />
      <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Forgot Your Password?</h2>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FF6B2B] focus:border-[#FF6B2B] focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6B2B] hover:bg-[#FF8F5B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B2B] transition duration-150 ease-in-out"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <Send className="h-5 w-5 text-[#FF8F5B] group-hover:text-[#FF6B2B]" aria-hidden="true" />
                  </span>
                  Reset Password
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6 text-center">
              <div className="rounded-full bg-green-100 p-6 mx-auto w-24 h-24 flex items-center justify-center">
                <Send className="h-12 w-12 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Check your email</h3>
              <p className="text-gray-600">
                We have sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
          )}

          <div className="flex items-center justify-center mt-6">
            <Link
              to="/login"
              className="text-sm font-medium text-[#FF6B2B] hover:text-[#FF8F5B] flex items-center transition duration-150 ease-in-out"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
