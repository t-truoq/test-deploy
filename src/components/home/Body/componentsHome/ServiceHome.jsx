"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ServiceHome() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/services",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              // No token needed since API is public
            },
          }
        );

        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setServices(response.data.slice(0, 4)); // Take the first 4 services
        } else {
          throw new Error("Invalid service data from server");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        if (err.response?.status === 404) {
          setError("Cannot find services");
        } else {
          setError(
            err.response?.data?.message || "Unable to load service list"
          );
        }
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-xl">Loading services...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-xl text-red-600">{error}</div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => {
          // Get image URL from the images array (first image if available)
          const imageUrl =
            service.images && service.images.length > 0
              ? service.images[0].url
              : "/placeholder.svg";

          return (
            <div
              key={service.serviceId}
              className="relative bg-pink-50 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={imageUrl} // Use computed imageUrl
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-[#A10550] mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-700 mb-4 text-lg">
                  {service.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                  - {service.duration} min
                </p>
                <p className="text-base text-gray-600 mb-6 line-clamp-3">
                  {service.description}
                </p>
                <button
                  onClick={() => handleBookNow(service.serviceId)}
                  className="w-full bg-[#2D0A31] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#1a061d] transition-all duration-300 transform hover:scale-105"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
