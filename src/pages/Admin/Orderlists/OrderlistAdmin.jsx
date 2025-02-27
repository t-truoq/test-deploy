import Header from "../../../components/Admin/HeaderAdmin/Header";
import OrderLists from "../../../components/Admin/OrderlistAdmin/OrderLists";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

const OrderListAdmin = () => {
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
          <div className="px-5">
            <h1 className="mb text-2xl font-semibold text-gray-900">
              OrderLists
            </h1>
          </div>
          <OrderLists />
        </main>
      </div>
    </div>
  );
};

export default OrderListAdmin;
