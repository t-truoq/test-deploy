import React from 'react';
import { useState } from "react";
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const services = [
  {
    id: 1,
    name: "Hydrating Facial",
    description: "A deeply hydrating treatment that restores moisture to dry skin.",
    image: "/services/HydratingFacial.webp",
    time: "60 minutes",
    skin_therapist: "Dr. Tam Dep Trai",
    price: 50.0,
    note: "Best for dry and dehydrated skin."
  },
  {
    id: 2,
    name: "Acne Treatment",
    description: "A specialized treatment to reduce acne and breakouts.",
    image: "/services/AcneTreatment.jpg",
    time: "75 minutes",
    skin_therapist: "Dr. Nam Suoi Vang",
    price: 70.0,
    note: "Recommended for oily and acne-prone skin."
  },
  // Thêm các dịch vụ khác ở đây...
];

const ServiceCard = ({ service, onSelect, isSelected }) => (
  <div className="w-full lg:w-1/2 p-4">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <img
        src={service.image}
        className="w-full h-[350px] object-cover rounded-xl mb-8"
        alt={service.name}
      />
      <div className="text-center">
        <h5 className="text-[#A10550] font-playfair font-bold text-2xl mb-4">
          {service.name}
        </h5>
        <p className="font-bold text-xl mb-4">
          ${service.price}.00 - {service.time}
        </p>
        <p className="text-gray-600 text-lg mb-8">
          {service.description}
        </p>
        <div className="flex gap-4">
          <button
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-lg transition-colors
              ${isSelected
                ? 'bg-[#A10550] text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'}`}
            onClick={() => onSelect(service)}>
            {isSelected ? 'Booked' : 'Book Now'}
          </button>
          <button
            className="flex-1 py-3 px-6 rounded-lg font-bold text-lg border-2 border-gray-800 hover:bg-gray-100">
            Details
          </button>
        </div>
      </div>
    </div>
    <hr className="my-8 border-gray-200" />
  </div>
);

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired
};

const Services = () => {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSelect = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const clearServices = () => {
    setSelectedServices([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <nav className="py-4">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-gray-800 hover:text-[#A10550]">Home</a></li>
          <li className="text-gray-500">/</li>
          <li className="text-[#A10550]">Services</li>
        </ol>
      </nav>
      <h2 className="text-3xl font-bold mb-8">Services</h2>

      <div className="flex flex-wrap -mx-4 mb-8">
        {services.map(service =>
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={handleSelect}
            isSelected={selectedServices.includes(service)}
          />
        )}
      </div>

      <div className="fixed bottom-5 right-5 bg-white rounded-xl shadow-lg p-5 w-[280px]">
        <h4 className="text-[#A10550] font-playfair font-bold text-lg mb-4">
          Selected Services: {selectedServices.length}
        </h4>
        <ul className="space-y-2 mb-4">
          {selectedServices.map(service => (
            <li key={service.id} className="bg-pink-50 p-3 rounded-lg text-left">
              {service.name}
            </li>
          ))}
        </ul>
        <button className="w-full bg-[#A10550] text-white py-2.5 rounded-lg font-bold mb-2">
          Booking
        </button>
        <button
          className="w-full bg-gray-100 text-gray-800 py-2.5 rounded-lg font-bold"
          onClick={clearServices}>
          Clear Services
        </button>
      </div>
      

    </div>

  );
};

export default Services;