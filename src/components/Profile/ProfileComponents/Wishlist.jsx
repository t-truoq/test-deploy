"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import ServiceCard from "../../service/serviceList/components/ServiceCard/ServiceCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSelect = (service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.serviceId === service.serviceId)
        ? prev.filter((s) => s.serviceId !== service.serviceId)
        : [...prev, service]
    );
  };

  const handleAddToWishlist = (service) => {
    let updatedWishlist = [...wishlist];
    const isInWishlist = updatedWishlist.some((item) => item.serviceId === service.serviceId);

    if (isInWishlist) {
      updatedWishlist = updatedWishlist.filter((item) => item.serviceId !== service.serviceId);
    } else {
      updatedWishlist.push(service);
    }

    Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
    setWishlist(updatedWishlist);
  };

  useEffect(() => {
    const savedWishlist = Cookies.get("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error parsing wishlist from cookie:", error);
        setWishlist([]);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading your wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <nav className="py-4">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-800 hover:text-[#A10550]">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-[#A10550]">Wishlist</li>
        </ol>
      </nav>

      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
          <Link
            to="/services"
            className="mt-4 inline-block bg-[#A10550] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#800440] transition-colors"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((service) => (
            <ServiceCard
              key={service.serviceId}
              service={service}
              onSelect={handleSelect}
              isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
              onAddToWishlist={handleAddToWishlist}
              isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;