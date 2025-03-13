import { motion } from "framer-motion";
import { useEffect } from "react"; // Thêm useEffect để tự động đóng
import { AlertCircle, CheckCircle } from "lucide-react";

const ErrorPopup = ({ notification, setNotification }) => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  // Tự động đóng sau 3 giây
  useEffect(() => {
    if (notification.show) {
      const timeout = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
    }
  }, [notification, setNotification]);

  if (!notification.show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex flex-col items-center">
          {notification.isSuccess ? (
            <CheckCircle className="w-12 h-12 text-emerald-600 mb-4" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          )}
          <p className="text-lg font-medium text-gray-800 mb-6 text-center">{notification.message}</p>
          <motion.button
            onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ErrorPopup;