import Header from "../../../components/Admin/HeaderAdmin/Header";
import Payment from "../../../components/Admin/PaymentManagement/PaymentManagement";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

const PaymentManagement = () => {
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
          <Payment />
        </main>
      </div>
    </div>
  );
};

export default PaymentManagement;
