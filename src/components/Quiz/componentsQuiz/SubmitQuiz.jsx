import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SubmitQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizResult } = location.state || {};

  // Nếu không có kết quả, hiển thị thông báo
  if (!quizResult) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Result Found</h2>
          <p className="text-gray-600 mb-8">
            It looks like you haven't completed the quiz yet.
          </p>
          <Link
            to="/quiz"
            className="px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300"
          >
            Take the Quiz
          </Link>
        </div>
      </div>
    );
  }

  // Kiểm tra dữ liệu quizResult có hợp lệ không
  const isValidResult = quizResult && quizResult.skinType && quizResult.details;

  // Hàm quay lại làm lại quiz
  const handleRetakeQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
          {isValidResult ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Skin Type Result
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Based on your answers, your skin type is:
              </p>
              <p className="text-2xl font-semibold text-[#A10550] mb-6">
                {quizResult.skinType}
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Total Score: <span className="font-semibold">{quizResult.totalScore}</span> points
              </p>
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-semibold text-gray-900">Detailed Scores:</h3>
                {quizResult.details && typeof quizResult.details === "object" ? (
                  Object.entries(quizResult.details).map(([type, score]) => (
                    <p key={type} className="text-gray-600">
                      {type}: {score} points
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600">No detailed scores available.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Error Processing Result</h2>
              <p className="text-lg text-gray-700 mb-4">
                We couldn't determine your skin type due to an issue with the response data.
              </p>
              <p className="text-gray-600 mb-8">
                Please try again or contact support if the issue persists.
              </p>
            </>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRetakeQuiz}
              className="px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300"
            >
              Retake Quiz
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuiz;