import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedbackStar() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0, // Giữ lại để tính toán nếu cần
    resolutionRate: 0, // Giữ lại để tính toán nếu cần
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
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks",
          {
            headers,
          }
        );

        console.log("Feedback Response in FeedbackStar:", response.data);

        if (
          typeof response.data === "string" &&
          response.data.startsWith("<!DOCTYPE")
        ) {
          setError(
            "API trả về HTML thay vì JSON. Vui lòng kiểm tra server hoặc ngrok."
          );
          return;
        }

        const feedbackData = response.data;
        const total = feedbackData.length;

        const resolved = feedbackData.filter(
          (item) => item.response && item.response.trim() !== ""
        ).length;

        const resolutionRate =
          total > 0 ? Math.round((resolved / total) * 100) : 0;

        setStats({
          total,
          resolved,
          resolutionRate,
        });
      } catch (err) {
        console.error("Error fetching stats in FeedbackStar:", err);
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
    <div className="flex justify-start p-2 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 w-full md:w-1/3 lg:w-1/4">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-700">Total Feedback</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div className="text-3xl font-bold text-[#3D021E]">{stats.total}</div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 w-full md:w-1/3 lg:w-1/4">
          {error}
        </div>
      )}
    </div>
  );
}
