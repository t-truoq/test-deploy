import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeedbackFilterStats({ currentFilter, onFilterChange }) {
  const navigate = useNavigate();
  const [isOpenTotal, setIsOpenTotal] = useState(false); // For mobile accordion (Total)
  const [isOpenFilter, setIsOpenFilter] = useState(false); // For mobile accordion (Filter)
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    resolutionRate: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem thống kê");
        navigate("/signin");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        };

        const response = await axios.get(
          "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/feedbacks",
          { headers }
        );

        const feedbackData = response.data;
        const total = feedbackData.length;
        const resolved = feedbackData.filter(
          (item) => item.response && item.response.trim() !== ""
        ).length;
        const resolutionRate =
          total > 0 ? Math.round((resolved / total) * 100) : 0;

        setStats({ total, resolved, resolutionRate });
      } catch (err) {
        console.error("Error fetching stats:", err);
        if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
        }
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Total Feedback Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden md:w-1/3">
        <div
          className="p-4 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white flex justify-between items-center cursor-pointer md:cursor-default"
          onClick={() => setIsOpenTotal(!isOpenTotal)}
        >
          <h3 className="text-lg font-semibold">Total Feedback</h3>
          <svg
            className={`h-5 w-5 md:hidden transform transition-transform ${
              isOpenTotal ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className={`p-4 ${isOpenTotal ? "block" : "hidden md:block"}`}>
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#3D021E]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-3xl font-bold text-[#3D021E]">{stats.total}</p>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Filter by Rating Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden md:w-2/3">
        <div
          className="p-4 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white flex justify-between items-center cursor-pointer md:cursor-default"
          onClick={() => setIsOpenFilter(!isOpenFilter)}
        >
          <h3 className="text-lg font-semibold">Filter by Rating</h3>
          <svg
            className={`h-5 w-5 md:hidden transform transition-transform ${
              isOpenFilter ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div
          className={`p-6 ${
            isOpenFilter ? "block" : "hidden md:block"
          } bg-gray-50`}
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 justify-items-center">
            {/* All Ratings */}
            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
              <input
                type="radio"
                id="all"
                name="rating"
                value="0"
                checked={currentFilter === 0}
                onChange={() => onFilterChange(0)}
                className="h-4 w-4 text-[#3D021E] focus:ring-[#3D021E] cursor-pointer"
              />
              <label
                htmlFor="all"
                className="text-sm text-gray-700 font-medium cursor-pointer"
              >
                All Ratings
              </label>
            </div>

            {/* Rating Options */}
            {[5, 4, 3, 2, 1].map((rating) => (
              <div
                key={rating}
                className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm"
              >
                <input
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  value={rating}
                  checked={currentFilter === rating}
                  onChange={() => onFilterChange(rating)}
                  className="h-4 w-4 text-[#3D021E] focus:ring-[#3D021E] cursor-pointer"
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm text-gray-700 font-medium flex items-center cursor-pointer"
                >
                  <span className="mr-1">{rating}</span>
                  <div className="flex">
                    {Array(rating)
                      .fill()
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

FeedbackFilterStats.propTypes = {
  currentFilter: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
