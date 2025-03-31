"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import ServiceRow from "../../../components/Admin/ServiceAdmin/ServiceRow";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";
import AddServiceModal from "../../../components/Admin/ServiceAdmin/AddService";
import EditServiceModal from "../../../components/Admin/ServiceAdmin/EditService";
import { motion } from "framer-motion";

const BASE_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/services";

const ServicesAdmin = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllServices = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await axios.get(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (Array.isArray(response.data)) {
        const formattedData = response.data.map((service) => ({
          id: service.serviceId,
          serviceId: service.serviceId,
          name: service.name,
          price: service.price != null ? service.price.toString() : "0",
          duration:
            service.duration != null ? service.duration.toString() : "0",
          imageUrl:
            service.images && service.images.length > 0
              ? service.images[0].url
              : "https://example.com/placeholder.jpg",
          status: "Active",
          description: service.description,
          recommendedSkinTypes: service.recommendedSkinTypes || [],
        }));
        setServices(formattedData);
        setFilteredServices(formattedData);
      } else {
        throw new Error("All services data is not an array");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      if (error.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.");
        } else if (error.response.status === 404) {
          setError("No services found.");
        } else {
          setError(error.response.data.message || "Failed to load services.");
        }
      } else if (error.request) {
        setError("Unable to connect to server. Please try again.");
      } else {
        setError(error.message || "Failed to load services.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  const handleAddService = (newService) => {
    const formattedService = {
      id: newService.serviceId,
      serviceId: newService.serviceId,
      name: newService.name,
      price: newService.price != null ? newService.price.toString() : "0",
      duration:
        newService.duration != null ? newService.duration.toString() : "0",
      imageUrl:
        newService.images && newService.images.length > 0
          ? newService.images[0].url
          : "https://example.com/placeholder.jpg",
      status: "Active",
      description: newService.description,
      recommendedSkinTypes: newService.recommendedSkinTypes || [],
    };
    setServices((prev) => [...prev, formattedService]);
    setFilteredServices((prev) => [...prev, formattedService]);
  };

  const handleEditService = (serviceId, updatedService) => {
    const formattedService = {
      id: updatedService.serviceId,
      serviceId: updatedService.serviceId,
      name: updatedService.name,
      price:
        updatedService.price != null ? updatedService.price.toString() : "0",
      duration:
        updatedService.duration != null
          ? updatedService.duration.toString()
          : "0",
      imageUrl:
        updatedService.images && updatedService.images.length > 0
          ? updatedService.images[0].url
          : "https://example.com/placeholder.jpg",
      status: "Active",
      description: updatedService.description,
      recommendedSkinTypes: updatedService.recommendedSkinTypes || [],
    };
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? formattedService : service
      )
    );
    setFilteredServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? formattedService : service
      )
    );
  };

  const handleDeleteService = (serviceId) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
    setFilteredServices((prev) =>
      prev.filter((service) => service.id !== serviceId)
    );
  };

  const openEditModal = (service) => {
    setSelectedService({
      serviceId: service.serviceId,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      images: service.imageUrl ? [{ url: service.imageUrl }] : [],
      recommendedSkinTypes: service.recommendedSkinTypes,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Ẩn trên mobile, hiển thị trên desktop */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex border-b border-gray-200 bg-white shadow-sm">
          <div className="flex-1">
            <Header />
          </div>
        </div>
        {/* Main Content */}
        <main className="p-4 sm:p-6">
          {loading ? (
            <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center bg-white border-gray-100 p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
                  />
                </div>
                <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
                  Loading services...
                </h3>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                  Please wait while we fetch your data
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
                  Service Management
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Manage your services
                </p>
              </div>
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <input
                  type="text"
                  placeholder="Search services by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full sm:w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center rounded-md bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] px-4 py-2 text-sm font-medium text-white hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Add New Service
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="hidden sm:table-cell px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Price
                      </th>
                      <th className="hidden md:table-cell px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {error ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-xs sm:text-sm text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : filteredServices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-xs sm:text-sm text-gray-500"
                        >
                          No services found.
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((service) => (
                        <ServiceRow
                          key={service.id}
                          service={service}
                          onEditService={() => openEditModal(service)}
                          onDeleteService={handleDeleteService}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
      {isAddModalOpen && (
        <AddServiceModal
          onAddService={handleAddService}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      {isEditModalOpen && (
        <EditServiceModal
          service={selectedService}
          onEditService={handleEditService}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ServicesAdmin;
