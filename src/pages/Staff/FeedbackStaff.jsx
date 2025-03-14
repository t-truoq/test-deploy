import { useState } from "react";
import FeedbackFilter from "../../components/Staff/Feedback/FeedbackFilter";
import FeedbackList from "../../components/Staff/Feedback/FeedbackList";
import FeedbackStar from "../../components/Staff/Feedback/FeedbackStar"; // Sửa tên import từ FeedbackStats thành FeedbackStar
import { Header } from "../../components/Staff/Header/Header";
import AppSidebar from "../../components/Staff/Sidebar";

export default function FeedbackStaff() {
  const [filter, setFilter] = useState(0);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
                Feedback Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage customer feedback
              </p>
            </div>

            <FeedbackStar />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-6">
                <FeedbackFilter
                  currentFilter={filter}
                  onFilterChange={setFilter}
                />
              </div>
              <div className="md:col-span-3">
                <FeedbackList filter={filter} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
