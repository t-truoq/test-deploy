import { X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types'

export const PopupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleTakeTest = () => {
    navigate("/skin-test")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-modalFadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-1.5 backdrop-blur-sm transition-all hover:bg-white"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image section - left side on desktop, top on mobile */}
          <div className="md:w-5/12 relative">
            <div className="relative h-64 md:h-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r /40 z-10"></div>
              <img
                src="./home/popup/popup.webp"
                alt="Skincare"
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <h3 className="text-xl font-bold mb-1 text-red-800">Personalized Skincare</h3>
                <p className="text-sm opacity-90 text-red-800">Tailored to your unique needs</p>
              </div>
            </div>
          </div>

          {/* Content section - right side on desktop, bottom on mobile */}
          <div className="md:w-7/12 p-8 md:p-10">
            <div className="max-w-md mx-auto">
              <div className="inline-block mb-4 p-2 bg-pink-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-[#A10550] to-[#d4267a] rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Discover Your Skin Type</h2>

              <div className="h-1 w-20 bg-[#A10550] mb-6"></div>

              <p className="text-gray-600 mb-4">
                Unlock the secret to radiant skin with our comprehensive skin analysis test.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 mr-2 bg-[#A10550] rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Identify your exact skin type</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 mr-2 bg-[#A10550] rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Receive personalized product recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 mr-2 bg-[#A10550] rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Learn about your skin's unique needs</span>
                </li>
              </ul>

              <div className="space-y-4">
                <button
                  onClick={handleTakeTest}
                  className="w-full px-6 py-4 text-white bg-gradient-to-r from-[#A10550] to-[#d4267a] rounded-xl font-semibold hover:shadow-lg hover:from-[#8a0443] hover:to-[#b81e69] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Take the Skin Test Now
                </button>

                <p className="text-center text-sm text-gray-500">
                  It only takes <span className="font-medium">2 minutes</span> to complete!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PopupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

