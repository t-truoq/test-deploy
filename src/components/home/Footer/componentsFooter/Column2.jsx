import React from "react";

export default function Column2() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Products</h3>
      <ul className="space-y-2">
        <li>
          <a href="#" className="hover:text-gray-300">
            Dưỡng ẩm
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300">
            Kem chống nắng
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300">
            Sửa rửa mặt
          </a>
        </li>
      </ul>
    </div>
  );
}
