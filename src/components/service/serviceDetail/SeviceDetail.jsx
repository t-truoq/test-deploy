"use client"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Clock, User, DollarSign, Bookmark } from "lucide-react"
import { services } from '../../../data/services';

// This would typically come from an API or database

export default function ServiceDetail() {
    const { id } = useParams();
    console.log(id)
    const service = services.find((s) => s.id === Number(id));
  
    if (!service) {
      return <div>Service not found</div>;
    }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link to="/services" className="text-[#A10550] hover:underline flex items-center">
          <ArrowLeft className="mr-2" size={20} />
          Back to Services
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-[500px] object-cover rounded-xl shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-playfair font-bold text-[#A10550] mb-4">{service.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{service.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center">
              <Clock className="text-[#A10550] mr-2" size={24} />
              <span className="font-semibold">{service.time}</span>
            </div>
            <div className="flex items-center">
              <User className="text-[#A10550] mr-2" size={24} />
              <span className="font-semibold">{service.skin_therapist}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="text-[#A10550] mr-2" size={24} />
              <span className="font-semibold">${service.price}.00</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="text-[#A10550] mr-2" size={24} />
              <span className="font-semibold">{service.note}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Benefits</h2>
          <ul className="list-disc pl-5 mb-8">
            {service.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600 mb-2">
                {benefit}
              </li>
            ))}
          </ul>

          <button className="w-full bg-[#A10550] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-[#8a0443] transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

