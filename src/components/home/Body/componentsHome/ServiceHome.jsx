import React from 'react'
import { services } from '../../../../data/service/services'
import { useNavigate } from 'react-router-dom'

export default function ServiceHome() {
  const navigate = useNavigate()

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="relative bg-pink-50 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#A10550] mb-2">{service.name}</h3>
                  <p className="text-gray-700 mb-4">
                    ${service.price.toFixed(2)} - {service.duration}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <button
                    onClick={() => handleBookNow(service.id)}
                    className="bg-[#2D0A31] text-white px-6 py-2 rounded hover:bg-[#1a061d] transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
    </div>
  )
}
