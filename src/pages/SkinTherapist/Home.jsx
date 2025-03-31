import Booking from "../../components/SkinTherapist/Booking/Booking";
import { SKHeader } from "../../components/SkinTherapist/Header";
import SKsidebar from "../../components/SkinTherapist/Sidebar";
import { useState } from "react";

function HomeSkinTheorapist() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - hidden on mobile by default */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block sticky top-0 h-screen z-30`}
      >
        <SKsidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with sidebar toggle */}
        <SKHeader onMenuClick={toggleSidebar} />

        {/* Main Content - removed padding since Booking has its own container */}
        <main className="flex-1 overflow-auto">
          <Booking />
        </main>
      </div>
    </div>
  );
}

export default HomeSkinTheorapist;
