"use client";

import { useState } from "react";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import ServiceCard from "../../../components/Admin/ServiceAdmin/Service";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";
import AddServiceModal from "../../../components/Admin/ServiceAdmin/AddService";

const ServicesAdmin = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      title: "clear start prevent & glow",
      price: "120.00",
      image: "https://example.com/facial-treatment-1.jpg",
    },
    {
      id: 2,
      title: "pro clear skin treatment",
      price: "100.00",
      image: "https://example.com/facial-treatment-2.jpg",
    },
    {
      id: 3,
      title: "clear start back treatment",
      price: "80.00",
      image: "https://example.com/facial-treatment-3.jpg",
    },
    {
      id: 4,
      title: "clear start back treatment",
      price: "80.00",
      image: "https://example.com/facial-treatment-3.jpg",
    },
    {
      id: 5,
      title: "clear start back treatment",
      price: "80.00",
      image: "https://example.com/facial-treatment-3.jpg",
    },
    {
      id: 6,
      title: "clear start back treatment",
      price: "80.00",
      image: "https://example.com/facial-treatment-3.jpg",
    },
  ]);

  const handleAddService = (newService) => {
    setServices((prevServices) => [
      ...prevServices,
      {
        id: prevServices.length + 1,
        title: newService.name, // Convert name to title
        price: newService.price,
        image: newService.image,
      },
    ]);
  };

  const handleEditService = (id, updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, ...updatedService } : service
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1">
        <div className="flex border-b border-gray-200 bg-white shadow-sm">
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
            <AddServiceModal onAddService={handleAddService} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                image={service.image}
                title={service.title}
                price={service.price}
                onEditService={handleEditService}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServicesAdmin;
