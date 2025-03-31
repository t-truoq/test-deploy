import { useState } from "react";
import SKsidebar from "../../components/SkinTherapist/Sidebar";
import { SKHeader } from "../../components/SkinTherapist/Header";
import FeedbackFilter from "../../components/SkinTherapist/Feedback/FeedbackFilter";
import FeedbackList from "../../components/SkinTherapist/Feedback/FeedbackList";

export default function FeedbackSK() {
  const [filter, setFilter] = useState(0); // 0 means all ratings

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, collapsible on mobile */}
      <div className="sticky top-0 h-screen">
        <SKsidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <SKHeader />

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
