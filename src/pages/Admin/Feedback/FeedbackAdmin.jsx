import { useState } from "react";
import FeedbackStats from "../../../components/Admin/FeedbackMangament/FeedbackStart";
import FeedbackFilter from "../../../components/Admin/FeedbackMangament/FeedbackFilter";
import FeedbackList from "../../../components/Admin/FeedbackMangament/FeedbackList";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";

export default function FeedbackManagement() {
  const [filter, setFilter] = useState(0); // 0 means all ratings

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
            <h1 className="mb text-2xl font-semibold text-gray-900">
              Feedback Mangament
            </h1>
          </div>
          <div className="p-6 space-y-6">
            <FeedbackStats />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
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
