"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

const ErrorPopup = ({ message, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <p className="text-lg font-medium text-gray-800 mb-6 text-center">{message}</p>
          <motion.button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ErrorPopup

