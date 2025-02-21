import { Link, NavLink } from "react-router-dom";
import CartButton from "./cart/CartButton";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-100 to-white shadow-md py-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-pink-700 font-bold text-xl uppercase">
          <img src="/logo/logo.webp" alt="Beauty Logo" className="h-10 mr-2" />
          BEAUTYA
        </Link>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-700 text-2xl focus:outline-none">
          <i className="bi bi-list"></i>
        </button>

        {/* Menu items */}
        <div className="hidden lg:flex space-x-6 items-center">
          <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/">
            Home
          </NavLink>
          <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/about">
            About
          </NavLink>
          <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/blog">
            Blog
          </NavLink>
          <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/services">
            Services
          </NavLink>
          <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/products">
            Products
          </NavLink>
          

          {/* Search Bar */}
          <form className="relative">
            <input
              type="search"
              className="border rounded-lg px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Tìm kiếm..."
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Language */}
          <NavLink className="text-gray-700 font-medium hover:text-pink-700" to="/language">
            US (EN)
          </NavLink>

          {/* Login Button */}
          <Link to="/login" className="bg-pink-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-800 transition">
            Login
          </Link>

          {/* Shop Cart Icon */}
          <CartButton/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
