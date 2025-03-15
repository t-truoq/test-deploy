import React from "react";
import { useNavigate } from "react-router-dom";

export default function Column2() {
  const navigate = useNavigate();

  const handleService1Click = () => {
    navigate("/services/1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleService2Click = () => {
    navigate("/services/2");
    window.scrollTo({ top: 0, behavior: "smooth" });

  };
  const handleService3Click = () => {
    navigate("/services/3");
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Services</h3>
      <ul className="space-y-2">
        <li>
          <button onClick={handleService1Click} className="hover:text-gray-300">
            Exo Booster
          </button>
        </li>
        <li>
          <button onClick={handleService2Click} className="hover:text-gray-300">
            Pro Calm Skin Treatment
          </button>
        </li>
        <li>
          <button onClick={handleService3Click} className="hover:text-gray-300">
            Pro Bright Skin Treatment
          </button>
        </li>
      </ul>
    </div>
  );
}
