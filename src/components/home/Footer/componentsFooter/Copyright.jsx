import React from "react";

export default function Copyright() {
  return (
    <div className="border-t border-gray-500 mt-8 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-300">
      <p>© 2023 Beautya. All rights reserved.</p>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-gray-200">
          Terms & Conditions
        </a>
        <a href="#" className="hover:text-gray-200">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
