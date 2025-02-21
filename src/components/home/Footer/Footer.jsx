

const Footer = () => {
  return (
    <footer className="bg-[#3D021E] text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">How Can We Help?</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300">Beautya Branches</a></li>
              <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-300">FAQ</a></li>
              <li><a href="#" className="hover:text-gray-300">Our Brand</a></li>
              <li><a href="#" className="hover:text-gray-300">Blog</a></li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300">Dưỡng ẩm</a></li>
              <li><a href="#" className="hover:text-gray-300">Kem chống nắng</a></li>
              <li><a href="#" className="hover:text-gray-300">Sửa rửa mặt</a></li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Keep In Touch With Beautya</h3>
            <form className="flex space-x-2 mb-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-2/3 px-3 py-2 bg-transparent border border-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button className="px-4 py-2 bg-white text-[#3D021E] font-bold hover:bg-gray-300 transition">
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-300">
              By submitting your email, you agree to receive advertising emails from Beautya. Please review our Privacy Policy.
            </p>

            {/* Icons mạng xã hội */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-2xl hover:text-gray-300"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-2xl hover:text-gray-300"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-2xl hover:text-gray-300"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-2xl hover:text-gray-300"><i className="fab fa-pinterest"></i></a>
              <a href="#" className="text-2xl hover:text-gray-300"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-500 mt-8 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-300">
          <p>© 2023 Beautya. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-200">Terms & Conditions</a>
            <a href="#" className="hover:text-gray-200">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
