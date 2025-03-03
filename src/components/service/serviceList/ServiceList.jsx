// import { useState } from "react";
// import { services } from "../../../data/service/services";
// // import ServiceSelects from "./components/ServiceSelects/ServiceSelects";
// import ServiceCard from "./components/ServiceCard/ServiceCard";

// const ServiceList = () => {
//   const [selectedServices, setSelectedServices] = useState([]);
//   const handleSelect = (service) => {
//     setSelectedServices((prev) =>
//       prev.includes(service)
//         ? prev.filter((s) => s !== service)
//         : [...prev, service]
//     );
//   };

//   const clearServices = () => {
//     setSelectedServices([]);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       <nav className="py-4">
//         <ol className="flex items-center space-x-2">
//           <li>
//             <a href="/" className="text-gray-800 hover:text-[#A10550]">
//               Home
//             </a>
//           </li>
//           <li className="text-gray-500">/</li>
//           <li className="text-[#A10550]">Services</li>
//         </ol>
//       </nav>
//       <h2 className="text-3xl font-bold mb-8">Services</h2>

//       <div className="flex flex-wrap mb-8 justify-center">
//         {services.map((service) => (
//           <ServiceCard
//             key={service.id}
//             service={service}
//             onSelect={handleSelect}
//             isSelected={selectedServices.includes(service)}
//           />
//         ))}
//       </div>
//       {/* <ServiceSelects
//         clearServices={clearServices}
//         selectedServices={selectedServices}
//         key={selectedServices.length}
//       /> */}
//     </div>
//   );
// };

// export default ServiceList;
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import ServiceCard from "./components/ServiceCard/ServiceCard"
import ServiceSearch from "./components/ServiceSearch"

const ServiceList = () => {
  const [selectedServices, setSelectedServices] = useState([])
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchServices = async () => {
      console.log("Token from localStorage:", token)

      if (!token) {
        setError("Vui lòng đăng nhập để xem dịch vụ")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get("https://a8d7-118-69-182-149.ngrok-free.app/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Bỏ qua trang cảnh báo ngrok
          },
        })

        console.log("API Response:", response.data)

        // Kiểm tra nếu response.data là mảng
        if (Array.isArray(response.data)) {
          setServices(response.data)
          setFilteredServices(response.data)
        } else {
          throw new Error("Dữ liệu dịch vụ không hợp lệ từ server")
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching services:", err)
        if (err.response) {
          console.log("Error Status:", err.response.status)
          console.log("Error Data:", err.response.data)
          if (err.response.status === 401) {
            setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.")
          } else if (err.response.status === 403) {
            setError("Bạn không có quyền truy cập danh sách dịch vụ.")
          } else {
            setError(err.response.data.message || "Không thể tải danh sách dịch vụ")
          }
        } else if (err.request) {
          setError("Không thể kết nối đến server")
        } else {
          setError(err.message || "Đã xảy ra lỗi khi tải dịch vụ")
        }
        setLoading(false)
      }
    }

    fetchServices()
  }, [token])

  const handleSelect = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.serviceId === service.serviceId)
        ? prev.filter((s) => s.serviceId !== service.serviceId)
        : [...prev, service],
    )
  }

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredServices(services)
      return
    }

    const filtered = services.filter(
      (service) =>
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredServices(filtered)
  }

  const clearServices = () => {
    setSelectedServices([])
  }

  if (loading) {
    return <div className="text-center py-8">Đang tải dịch vụ...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}{" "}
        <Link to="/signin" className="text-[#A10550] underline">
          Đăng nhập ngay
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <nav>
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-gray-800 hover:text-[#A10550]">
                Home
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-[#A10550]">Services</li>
          </ol>
        </nav>
        <div className="w-64">
          <ServiceSearch onSearch={handleSearch} />
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">Services</h2>

      <div className="flex flex-wrap mb-8 justify-center">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.serviceId}
            service={service}
            onSelect={handleSelect}
            isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
          />
        ))}
      </div>
    </div>
  )
}

export default ServiceList

