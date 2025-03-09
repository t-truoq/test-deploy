import { SKHeader } from "../../components/SkinTherapist/Header";
import Profile from "../../components/SkinTherapist/Profile/Profile";
import SKsidebar from "../../components/SkinTherapist/Sidebar";

function ProfilePage() {
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
        <main>
          <Profile />
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
