// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function ServiceHome() {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axios.get(
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/services",
//           {
//             headers: {
//               "ngrok-skip-browser-warning": "true",
//               // Không cần gửi token vì API đã public
//             },
//           }
//         );

//         console.log("API Response:", response.data);
//         if (Array.isArray(response.data)) {
//           setServices(response.data.slice(0, 4)); // Lấy 4 dịch vụ đầu tiên
//         } else {
//           throw new Error("Dữ liệu dịch vụ không hợp lệ từ server");
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching services:", err);
//         if (err.response?.status === 404) {
//           setError("Không tìm thấy dịch vụ.");
//         } else {
//           setError(
//             err.response?.data?.message || "Không thể tải danh sách dịch vụ"
//           );
//         }
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, []); // Không cần phụ thuộc vào token nữa

//   const handleBookNow = (serviceId) => {
//     navigate(`/services/${serviceId}`);
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   if (loading) {
//     return <div className="text-center py-8">Đang tải dịch vụ...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-600">{error}</div>;
//   }

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {services.map((service) => (
//           <div
//             key={service.serviceId}
//             className="relative bg-pink-50 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
//           >
//             <img
//               src={service.image || "/placeholder.svg"}
//               alt={service.name}
//               className="w-full h-64 object-cover rounded-lg"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-bold text-[#A10550] mb-2">
//                 {service.name}
//               </h3>
//               <p className="text-gray-700 mb-4">
//                 ${service.price.toFixed(2)} - {service.duration} min
//               </p>
//               <p className="text-sm text-gray-600 mb-4">
//                 {service.description}
//               </p>
//               <button
//                 onClick={() => handleBookNow(service.serviceId)}
//                 className="bg-[#2D0A31] text-white px-6 py-2 rounded hover:bg-[#1a061d] transition-colors"
//               >
//                 Book Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function ServiceHome() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/services",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          },
        )

        console.log("API Response:", response.data)
        if (Array.isArray(response.data)) {
          setServices(response.data.slice(0, 4)) // Lấy 4 dịch vụ đầu tiên
        } else {
          throw new Error("Dữ liệu dịch vụ không hợp lệ từ server")
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching services:", err)
        if (err.response?.status === 404) {
          setError("Không tìm thấy dịch vụ.")
        } else {
          setError(err.response?.data?.message || "Không thể tải danh sách dịch vụ")
        }
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (loading) {
    return <div className="text-center py-12 text-xl">Đang tải dịch vụ...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-xl text-red-600">{error}</div>
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <div
            key={service.serviceId}
            className="relative bg-pink-50 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-[#A10550] mb-3">{service.name}</h3>
              <p className="text-gray-700 mb-4 text-lg">
                ${service.price.toFixed(2)} - {service.duration} min
              </p>
              <p className="text-base text-gray-600 mb-6 line-clamp-3">{service.description}</p>
              <button
                onClick={() => handleBookNow(service.serviceId)}
                className="w-full bg-[#2D0A31] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#1a061d] transition-all duration-300 transform hover:scale-105"
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

