import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeedbackStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
  });
  const [error, setError] = useState("");
  const [lastMonthTotal, setLastMonthTotal] = useState(0); // Để tính % tăng/giảm so với tháng trước

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
          "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/feedbacks/specialist/feedbacks",
          { headers }
        );

        console.log("Feedback Response in FeedbackStats:", response.data);

        if (
          typeof response.data === "string" &&
          response.data.startsWith("<!DOCTYPE")
        ) {
          setError(
            "API trả về HTML thay vì JSON. Vui lòng kiểm tra server hoặc ngrok."
          );
          return;
        }

        // Tính toán thống kê
        const feedbackData = response.data;
        const total = feedbackData.length;

        // Giả lập % tăng/giảm so với tháng trước (cần API bổ sung nếu muốn chính xác)
        const lastMonthTotal = 116; // Giả định giá trị tháng trước (cần API thực tế)
        setLastMonthTotal(lastMonthTotal);

        setStats({
          total,
        });
      } catch (err) {
        console.error("Error fetching stats in FeedbackStats:", err);
        if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          navigate("/signin");
        } else if (
          err.response?.data &&
          typeof err.response.data === "string" &&
          err.response.data.startsWith("<!DOCTYPE")
        ) {
          setError(
            "API trả về HTML thay vì JSON. Vui lòng kiểm tra server hoặc ngrok."
          );
        } else {
          setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
        }
      }
    };

    fetchStats();
  }, [navigate]);

  // Tính % tăng/giảm so với tháng trước
  const growthPercent =
    lastMonthTotal > 0
      ? Math.round(((stats.total - lastMonthTotal) / lastMonthTotal) * 100)
      : 0;

  return (
    <div className="grid gap-4">
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Feedback</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
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
        <div>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-gray-500">
            {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`}{" "}
            from last month
          </p>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
    </div>
  );
}