import { ContactDashboard } from "../../components/Staff/Contact/ContactDashboard";
import { Header } from "../../components/Staff/Header/Header";
import AppSidebar from "../../components/Staff/Sidebar";

function ContactManagment() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <AppSidebar />
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
          <ContactDashboard />
        </main>
      </div>
    </div>
  );
}

export default ContactManagment;
