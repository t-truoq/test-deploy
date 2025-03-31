import { useState } from "react";
import FeedbackFilter from "../../components/Staff/Feedback/FeedbackFilter";
import FeedbackList from "../../components/Staff/Feedback/FeedbackList";
import { Header } from "../../components/Staff/Header/Header";
import AppSidebar from "../../components/Staff/Sidebar";

export default function FeedbackStaff() {
  const [filter, setFilter] = useState(0); // 0 means all ratings
  const [isLoading, setIsLoading] = useState(true); // Keep loading state if you need it

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, collapsible on mobile */}
      <div className="sticky top-0 h-screen">
        <AppSidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
                Feedback Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage customer feedback
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Combined Feedback Filter and Stats */}
              <FeedbackFilter
                currentFilter={filter}
                onFilterChange={setFilter}
              />

              {/* Feedback List */}
              <div className="w-full">
                <FeedbackList filter={filter} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
