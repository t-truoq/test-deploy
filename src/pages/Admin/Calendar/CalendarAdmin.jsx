import CalendarDemo from "../../../components/Admin/CalendarAdmin/Calendar";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

const CalendarAdmin = () => {
  return (
    <div className="flex  bg-gray-100">
      {/* Sidebar giữ nguyên và luôn cố định khi cuộn */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex border-b border-gray-200">
          <div className="flex-1">
            <Header />
          </div>
        </div>
        <main className="p-7">
          <h1 className="mb-3 text-2xl font-semibold text-gray-900"></h1>
          <CalendarDemo />
        </main>
      </div>
    </div>
  );
};

export default CalendarAdmin;
