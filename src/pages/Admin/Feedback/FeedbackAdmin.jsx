import { useState } from "react";
import FeedbackStats from "../../../components/Admin/FeedbackMangament/FeedbackStart";
import FeedbackFilter from "../../../components/Admin/FeedbackMangament/FeedbackFilter";
import FeedbackList from "../../../components/Admin/FeedbackMangament/FeedbackList";
import Header from "../../../components/Admin/HeaderAdmin/Header";
import Sidebar from "../../../components/Admin/SidebarAdmin/sidebar";
import { motion } from "framer-motion";

export default function FeedbackManagement() {
  const [filter, setFilter] = useState(0); // 0 means all ratings
  const [isLoading, setIsLoading] = useState(true); // Thêm state để theo dõi loading

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
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
                Feedback Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage customer feedback
              </p>
            </div>
          </div>
          <div className="relative">
            {/* Hiệu ứng loading bao phủ toàn bộ nội dung chính */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center bg-white p-6 rounded-lg shadow-lg"
                >
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 border-4 border-[#3D021E] border-t-transparent rounded-full"
                    />
                  </div>
                  <h3 className="text-lg text-[#3D021E] font-medium">
                    Loading feedback...
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Please wait while we fetch your data
                  </p>
                </motion.div>
              </div>
            )}
            {/* Nội dung chính */}
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
                  <FeedbackList
                    filter={filter}
                    onLoadingChange={(loading) => setIsLoading(loading)}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
