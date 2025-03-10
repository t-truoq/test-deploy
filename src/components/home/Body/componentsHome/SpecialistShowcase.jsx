"use client"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { SpecialistDetail } from '../../../Therapist/SpecialistPage'; // Import SpecialistDetail
import axios from "axios";

export default function SpecialistShowcase() {
  const navigate = useNavigate()
  const [specialists, setSpecialists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSpecialist, setSelectedSpecialist] = useState(null) // State để quản lý popup
  const baseUrl = "https://f23c-118-69-182-149.ngrok-free.app"

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        // Gọi API mà không cần token
        const response = await axios.get(`${baseUrl}/api/users/specialists/active`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })

        console.log('Response status:', response.status)
        console.log('Response status text:', response.statusText)
        console.log('Full response data:', response.data)

        // Kiểm tra nếu response.data là mảng hoặc object
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
          throw new Error("No data returned from the API")
        }

        const processedSpecialists = Array.isArray(response.data) ? response.data : [response.data]
        const firstFourSpecialists = processedSpecialists.slice(0, 4).map(specialist => ({
          id: specialist.userId || specialist.id || Math.random().toString(36).substr(2, 9), // Fallback ID
          name: specialist.name || 'Unknown Specialist',
          role: specialist.role || 'Specialist',
          image: specialist.image || "/placeholder.svg?height=400&width=300", // Fallback image
          description: specialist.description || 'No description available', // Fallback description
        }))
        setSpecialists(firstFourSpecialists)
      } catch (err) {
        console.error("Error fetching specialists:", err)
        if (err.response) {
          console.log('Error response data:', err.response.data)
          console.log('Error response status:', err.response.status)
          console.log('Error response headers:', err.response.headers)
          setError(`Failed to fetch specialists: ${err.response.status} - ${err.response.statusText}. Details: ${err.message}`)
        } else if (err.request) {
          console.log('No response received:', err.request)
          setError("No response from the server. Check your network or API endpoint.")
        } else {
          console.log('Error in request setup:', err.message)
          setError(`Error: ${err.message}`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialists()
  }, [])

  const handleSpecialistClick = (specialist) => {
    setSelectedSpecialist(specialist) // Mở popup với thông tin của chuyên gia được chọn
  }

  const handleCloseDetail = () => {
    setSelectedSpecialist(null) // Đóng popup
  }

  const handleViewAllDoctors = () => {
    navigate("/specialist") // Điều hướng đến trang SpecialistPage
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="text-center">Loading specialists...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="text-center text-red-600">
            <p>Error loading specialists: {error}</p>
            <p>Please check the API endpoint or contact the administrator.</p>
          </div>
        </div>
      </section>
    )
  }

  if (specialists.length === 0) {
    return (
      <section className="py-16 md:py-24 w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="text-center">
            <p>No specialists available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Meet Our Specialists</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Our team of highly trained professionals is dedicated to providing you with the best skincare experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              onClick={() => handleSpecialistClick(specialist)} // Mở popup khi nhấp vào thẻ
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={specialist.image}
                  alt={specialist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#A10550] mb-1">{specialist.name}</h3>
                <p className="text-gray-600 font-medium mb-4">{specialist.role}</p>
                <p className="text-gray-700 mb-6">{specialist.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nút View All Doctors */}
        <div className="text-center mt-12">
          <button
            onClick={handleViewAllDoctors}
            className="bg-[#A10550] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#8c0443] transition-colors"
          >
            View All Doctors
          </button>
        </div>

        {/* Popup chi tiết chuyên gia */}
        {selectedSpecialist && (
          <SpecialistDetail 
            specialist={selectedSpecialist} 
            onClose={handleCloseDetail} 
          />
        )}
      </div>
    </section>
  )
}