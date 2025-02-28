import Contact from "../../../components/Admin/ContactAdmin/Contact";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

const ContactAdmin = () => {
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

        <main className="p-2">
          <div className="px-5">
            <h1 className="mb text-2xl font-semibold text-gray-900">Contact</h1>
          </div>
          <Contact />
        </main>
      </div>
    </div>
  );
};

export default ContactAdmin;
