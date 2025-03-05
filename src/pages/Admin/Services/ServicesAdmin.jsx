import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import ServiceRow from "../../../components/Admin/ServiceAdmin/ServiceRow";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";
import AddServiceModal from "../../../components/Admin/ServiceAdmin/AddService";

const ServicesAdmin = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [services, setServices] = useState([
    {
      id: "00001",
      name: "clear start prevent & glow",
      price: "120.00",
      duration: "60",
      imageUrl: "https://example.com/facial-treatment-1.jpg",
      status: "Active",
    },
    {
      id: "00002",
      name: "pro clear skin treatment",
      price: "100.00",
      duration: "45",
      imageUrl: "https://example.com/facial-treatment-2.jpg",
      status: "Active",
    },
    {
      id: "00003",
      name: "clear start back treatment",
      price: "80.00",
      duration: "30",
      imageUrl: "https://example.com/facial-treatment-3.jpg",
      status: "Inactive",
    },
  ]);

  const handleAddService = (newService) => {
    setServices((prevServices) => [
      ...prevServices,
      {
        id: String(prevServices.length + 1).padStart(5, "0"),
        name: newService.name,
        price: newService.price,
        duration: newService.duration,
        imageUrl: newService.imageUrl,
        status: "Active",
      },
    ]);
    setIsAddModalOpen(false);
  };

  const handleEditService = (id, updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, ...updatedService } : service
      )
    );
  };

  const handleDeleteService = (id) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
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

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Service Management
            </h1>
          </div>

          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center rounded-md bg-[#4A0404] px-4 py-2 text-sm font-medium text-white hover:bg-[#3A0303] focus:outline-none focus:ring-2 focus:ring-[#4A0404] focus:ring-offset-2"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Service
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Service Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {services.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onEditService={handleEditService}
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
    </div>
  );
};

export default ServicesAdmin;
