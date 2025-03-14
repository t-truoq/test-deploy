"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import ServiceRow from "../../../components/Admin/ServiceAdmin/ServiceRow";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";
import AddServiceModal from "../../../components/Admin/ServiceAdmin/AddService";
import EditServiceModal from "../../../components/Admin/ServiceAdmin/EditService";

const BASE_URL =
  "https://a66f-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/services";

const ServicesAdmin = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]); // State for filtered services
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          maxRedirects: 5,
        });

        console.log("API Response:", response.data);

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
          setFilteredServices(formattedData); // Initialize filteredServices with all services
        } else {
          throw new Error("All services data is not an array");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        if (error.response) {
          if (error.response.status === 302) {
            setError(
              "Redirect detected. Please check authentication or server configuration."
            );
          } else if (error.response.status === 401) {
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
        setHasFetched(true);
      }
    };

    fetchAllServices();
  }, [hasFetched]);

  // Handle search input change
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
    setFilteredServices((prev) => [...prev, formattedService]); // Update filtered list
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A0404] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-6 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
        </div>
      </div>
    );
  }

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
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Service Management
            </h1>
          </div>
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              placeholder="Search services by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center rounded-md bg-[#4A0404] px-4 py-2 text-sm font-medium text-white hover:bg-[#3A0303]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Service
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredServices.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onEditService={() => openEditModal(service)}
                    onDeleteService={handleDeleteService}
                  />
                ))}
              </tbody>
            </table>
          </div>
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
