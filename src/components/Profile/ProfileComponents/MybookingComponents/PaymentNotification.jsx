import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

const PaymentNotification = ({ paymentNotification, setPaymentNotification }) => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  if (!paymentNotification.show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          {paymentNotification.isSuccess ? (
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          )}
          <p className="text-lg font-medium text-gray-800 mb-6 text-center">
            {paymentNotification.message}
          </p>
          <motion.button
            onClick={() => setPaymentNotification((prev) => ({ ...prev, show: false }))}
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

export default PaymentNotification;