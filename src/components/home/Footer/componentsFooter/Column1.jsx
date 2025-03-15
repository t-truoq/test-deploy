import React from "react";
import { useNavigate } from "react-router-dom";

export default function Column1() {
  const navigate = useNavigate();

  const handleBranchesClick = () => {
    navigate("/about#branches");
  };

  const handleOurBrandClick = () => {
    navigate("/about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactClick = () => {
    navigate("/#newsletter");
  };

  const handleQuizClick = () => {
    navigate("/quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBlogClick = () => {
    navigate("/blog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">How Can We Help?</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={handleBranchesClick}
            className="hover:text-gray-300 text-left"
          >
            Beautya Branches
          </button>
        </li>
        <li>
          <button onClick={handleContactClick} className="hover:text-gray-300">
            Contact Us
          </button>
        </li>
        <li>
          <button onClick={handleQuizClick} className="hover:text-gray-300">
            Quiz
          </button>
        </li>
        <li>
          <button onClick={handleOurBrandClick} className="hover:text-gray-300">
            Our Brand
          </button>
        </li>
        <li>
          <button onClick={handleBlogClick} className="hover:text-gray-300">
            Blog
          </button>
        </li>
      </ul>
    </div>
  );
}