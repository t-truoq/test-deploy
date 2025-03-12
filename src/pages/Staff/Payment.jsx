import { Header } from "../../components/Staff/Header/Header";
import PaymentStaff from "../../components/Staff/PaymentStaff/PaymentStaff";
import AppSidebar from "../../components/Staff/Sidebar";

const Payment = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen">
        <AppSidebar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex border-b border-gray-200">
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="p-6">
          <PaymentStaff />
        </main>
      </div>
    </div>
  );
};

export default Payment;
