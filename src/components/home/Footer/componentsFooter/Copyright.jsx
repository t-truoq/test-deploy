import React from "react";
import { useNavigate } from "react-router-dom";

export default function Copyright() {
  const navigate = useNavigate();

  const handleTermClick = () => {
    navigate("/blog/1");
  };

  const handlePrivacyClick = () => {
    navigate("/blog/2");
  };
  return (
    <div className="border-t border-gray-500 mt-8 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-300">
      <p>© 2023 Beautya. All rights reserved.</p>
      <div className="flex space-x-4">
        <button onClick={handleTermClick} className="hover:text-gray-200">
          Terms & Conditions
        </button>
        <button onClick={handlePrivacyClick} className="hover:text-gray-200">
          Privacy Policy
        </button>
      </div>
    </div>
  );
}
