import Booking from "../../components/SkinTherapist/Booking/Booking";
import { SKHeader } from "../../components/SkinTherapist/Header";
import SKsidebar from "../../components/SkinTherapist/Sidebar";

function HomeSkinTheorapist() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen w-64 bg-white shadow">
        <SKsidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <SKHeader />

        {/* Main Content */}
        <main className="p-6">
          <Booking />
        </main>
      </div>
    </div>
  );
}

export default HomeSkinTheorapist;
