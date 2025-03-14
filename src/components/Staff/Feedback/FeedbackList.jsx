import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeedbackList({ filter }) {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem phản hồi");
        navigate("/signin");
        return;
      }

      try {
        // Cấu hình headers với token và ngrok-skip-browser-warning
        const headers = {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        };

        // Gọi API feedbacks
        const feedbackResponse = await axios.get(
          "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/feedbacks",
          { headers }
        );

        // Log dữ liệu để kiểm tra
        console.log("Feedback Response:", feedbackResponse.data);

        // Kiểm tra xem dữ liệu có phải JSON không
        if (
          typeof feedbackResponse.data === "string" &&
          feedbackResponse.data.startsWith("<!DOCTYPE")
        ) {
          setError(
            "API trả về HTML thay vì JSON. Vui lòng kiểm tra server hoặc ngrok."
          );
          return;
        }

        // Ánh xạ dữ liệu phản hồi (tạm thời không dùng customers và specialists)
        const mappedData = feedbackResponse.data.map((item) => ({
          id: item.feedbackId,
          customer: `Khách hàng ID: ${item.customerId}`, // Thay vì tên, dùng ID nếu không có API customers
          email: "Email không khả dụng", // Cần API customers để lấy email
          avatar: "/placeholder.svg?height=40&width=40",
          service: `Dịch vụ ID: ${item.specialistId}`, // Thay vì tên dịch vụ, dùng ID nếu không có API specialists
          message: item.comment,
          rating: item.rating,
          date: item.createdAt.split("T")[0],
          response: item.response || "",
        }));

        setFeedbackItems(mappedData);
      } catch (err) {
        console.error("Error fetching data:", err);
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
          setError("Không thể tải dữ liệu phản hồi. Vui lòng thử lại.");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ));
  };

  const handleFeedbackClick = (item) => {
    setSelectedFeedback(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  useEffect(() => {
    if (selectedFeedback) {
      setResponseText(selectedFeedback.response || "");
    }
  }, [selectedFeedback]);

  const handleSaveResponse = () => {
    const updatedItems = feedbackItems.map((item) => {
      if (item.id === selectedFeedback.id) {
        return { ...item, response: responseText };
      }
      return item;
    });
    setFeedbackItems(updatedItems);
    closeModal();
  };

  const filteredItems =
    filter === 0
      ? feedbackItems
      : feedbackItems.filter((item) => item.rating === filter);

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 text-center text-gray-500">
              Không tìm thấy phản hồi nào phù hợp với bộ lọc đã chọn.
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow border border-gray-200 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleFeedbackClick(item)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={item.avatar || "/placeholder.svg"}
                        alt={item.customer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.customer}</h3>
                      <p className="text-sm text-gray-500">{item.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(item.rating)}
                  </div>
                  <p className="text-sm font-medium"> {item.service}</p>
                  <p className="mt-2 text-sm">{item.message}</p>

                  {item.response && (
                    <div className="mt-4 pl-4 border-l-2 border-primary/20">
                      <p className="text-sm font-medium">
                        Phản hồi của chúng tôi:
                      </p>
                      <p className="text-sm text-gray-500">{item.response}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                    {item.response ? "Chỉnh sửa phản hồi" : "Phản hồi"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  Phản hồi từ {selectedFeedback.customer}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Dịch vụ</p>
                  <p className="text-sm">{selectedFeedback.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ngày</p>
                  <p className="text-sm">{selectedFeedback.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Đánh giá</p>
                  <div className="flex items-center gap-1">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Phản hồi</p>
                <p className="text-sm mt-1 p-3 bg-gray-100 rounded-md">
                  {selectedFeedback.message}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Phản hồi của chúng tôi</p>
                <textarea
                  placeholder="Nhập phản hồi của bạn tại đây..."
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveResponse}
                className="px-4 py-2 bg-[#4A0404] hover:bg-[#3A0303] text-white rounded-md transition-colors"
              >
                Lưu phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

FeedbackList.propTypes = {
  filter: PropTypes.number.isRequired,
};
