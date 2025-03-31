import Dashboard from "../../../components/Admin/DashboardAdmin/Dashboard";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

function HomeAdmin() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* Main Section */}
        <main className="p-4 sm:p-6 md:p-7">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default HomeAdmin;
