import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";
import { Staffs } from "../../../components/Admin/Staff.jsx/Staff";

const StaffsManagement = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex border-b border-gray-200">
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="p-6">
          <div className="mb-6">
            <h1 className="mb text-2xl font-semibold text-gray-900">Staffs</h1>
          </div>
          <Staffs />
        </main>
      </div>
    </div>
  );
};

export default StaffsManagement;
