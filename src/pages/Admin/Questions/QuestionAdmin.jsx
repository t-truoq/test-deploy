import Header from "../../../components/Admin/HeaderAdmin/Header";
import QuestionDashboard from "../../../components/Admin/QuestionManagement/QuestionDashboard";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

const QuestionAdmin = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
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

        <main className="p-2">
          <QuestionDashboard />
        </main>
      </div>
    </div>
  );
};

export default QuestionAdmin;
