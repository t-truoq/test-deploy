"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Home, ChevronRight } from "lucide-react"

const BookingHeader = () => {
  return (
    <>
      <motion.nav
        className="py-4 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-600 hover:text-rose-600 flex items-center">
              <Home className="w-4 h-4 mr-1" /> Home
            </Link>
          </li>
          <li>
            <Link to="/services" className="text-gray-600 hover:text-rose-600 flex items-center">
              <ChevronRight className="w-4 h-4 mr-1" /> Services
            </Link>
          </li>
          <li className="text-gray-400">
            <ChevronRight className="w-3 h-3" />
          </li>
          <li className="text-rose-600 font-medium">My Bookings</li>
        </ol>
      </motion.nav>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage all your service appointments</p>
      </motion.div>
    </>
  )
}

export default BookingHeader

