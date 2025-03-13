import { motion } from "framer-motion";
import { Calendar, XCircle } from "lucide-react";

const FilterByDate = ({ searchDate, setSearchDate }) => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div className="mb-8" variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-rose-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filter by Date</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="date"
              id="searchDate"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          {searchDate && (
            <motion.button
              onClick={() => setSearchDate("")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <XCircle className="w-4 h-4 mr-2" /> Clear Filter
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterByDate;