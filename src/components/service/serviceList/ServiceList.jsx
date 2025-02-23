import { useState } from "react";
import { services } from "../../../data/service/services";
// import ServiceSelects from "./components/ServiceSelects/ServiceSelects";
import ServiceCard from "./components/ServiceCard/ServiceCard";

const ServiceList = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const handleSelect = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const clearServices = () => {
    setSelectedServices([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <nav className="py-4">
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
      <h2 className="text-3xl font-bold mb-8">Services</h2>

      <div className="flex flex-wrap mb-8 justify-center">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={handleSelect}
            isSelected={selectedServices.includes(service)}
          />
        ))}
      </div>
      {/* <ServiceSelects
        clearServices={clearServices}
        selectedServices={selectedServices}
        key={selectedServices.length}
      /> */}
    </div>
  );
};

export default ServiceList;
