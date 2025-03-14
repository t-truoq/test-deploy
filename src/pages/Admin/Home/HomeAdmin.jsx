import Dashboard from "../../../components/Admin/DashboardAdmin/Dashboard";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

function HomeAdmin() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex">
          {/* Header */}
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="p-7">
          <h1 className="mb-3 text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default HomeAdmin;
