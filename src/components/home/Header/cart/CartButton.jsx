import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function CartButton() {
  const cartItems = useSelector((state) => state.cart.items)
  const itemCount = cartItems.length

  return (
    <Link to="/cart" className="relative text-gray-700 text-2xl hover:text-pink-700 transition">
      <i className="bi bi-cart"></i>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  )
}
