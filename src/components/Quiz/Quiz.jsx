"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Lấy danh sách câu hỏi
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please login before doing quiz!");
        }

        const response = await axios.get("https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/quiz/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });

        console.log("Fetch questions response:", response.data);

        // Đảm bảo dữ liệu là mảng
        if (Array.isArray(response.data)) {
          // Chuyển đổi dữ liệu để khớp với giao diện
          const formattedQuestions = response.data.map((q) => ({
            questionId: q.id,
            questionText: q.questionText,
            answers: q.answers.map((a) => ({
              answerId: a.id || `${q.id}-${a.answerText}`, // Nếu API không trả về answerId thì tạo tạm
              answerText: a.answerText,
              score: a.score,
              skinType: a.skinType,
            })),
          }));
          setQuestions(formattedQuestions);
        } else {
          throw new Error("Invalid response format from API: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [navigate]);

  // Xử lý lỗi chung
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        setError("Unauthorized: Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response.status === 404) {
        setError("No quiz questions found.");
      } else {
        setError(error.response.data.message || "Failed to load quiz questions.");
      }
    } else if (error.request) {
      setError("Please login before take a quiz!");
    } else {
      setError(error.message || "Failed to load quiz questions.");
    }
  };

  // Xử lý chọn đáp án
  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId, // Lưu answerId trực tiếp
    }));
  };

  // Gửi kết quả quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Object.keys(answers).length !== questions.length) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      // Format dữ liệu gửi đi
      const submissionData = {};
      Object.keys(answers).forEach((questionId) => {
        submissionData[questionId] = answers[questionId];
      });

      const response = await axios.post(
        "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/quiz/submit",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Quiz submission response:", response.data);

      const resultToSave = {
        detectedSkinType: response.data.detectedSkinType,
        skinTypeScores: response.data.skinTypeScores,
        userResponses: response.data.userResponses,
      };
      localStorage.setItem("skinTypeResult", JSON.stringify(resultToSave));

      setQuizResult(response.data);
      setShowResult(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      handleError(error);
    }
  };

  const closePopup = () => {
    setShowResult(false);
    setQuizResult(null);
    setAnswers({});
  };

  const getOptionLabel = (answerIndex) => {
    return String.fromCharCode(65 + answerIndex); // A, B, C, D
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A10550] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error && error !== `Please answer all ${questions.length} questions before submitting.`) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 mb-6">No quiz questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A10550] to-pink-600">
              Skin Type Quiz
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Answer these {questions.length} questions to determine your skin type!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#A10550] to-pink-500 mx-auto"></div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Your progress</span>
            <span>
              {Math.round((Object.keys(answers).length / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-[#A10550] to-pink-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.questionId}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A10550] text-white flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <span>{question.questionText}</span>
              </h3>
              <div className="space-y-4">
                {question.answers.map((answer, answerIndex) => (
                  <label
                    key={answer.answerId}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      answers[question.questionId] === answer.answerId
                        ? "bg-pink-50 border-2 border-[#A10550]"
                        : "bg-gray-50 border border-gray-200 hover:bg-pink-50"
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full border-2 mr-3 ${
                          answers[question.questionId] === answer.answerId
                            ? "border-[#A10550] bg-[#A10550]"
                            : "border-gray-400"
                        }`}
                      >
                        {answers[question.questionId] === answer.answerId && (
                          <svg
                            className="w-4 h-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">
                          {getOptionLabel(answerIndex)}. {answer.answerText}
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      value={answer.answerId}
                      checked={answers[question.questionId] === answer.answerId}
                      onChange={() => handleAnswerChange(question.questionId, answer.answerId)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-[#A10550] to-pink-600 text-white rounded-lg hover:from-[#8a0443] hover:to-pink-700 transition-colors duration-300 shadow-lg"
            >
              Submit Quiz
            </button>
            {error && <p className="mt-3 text-red-600 text-sm font-medium">{error}</p>}
          </div>
        </form>
      </div>

      {showResult && quizResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#A10550] to-pink-600 p-6 rounded-t-2xl relative">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-white hover:text-pink-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-bold text-white">Your Skin Type Result</h3>
            </div>

            <div className="p-6">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-700 mb-2">
                  Based on your answers, your skin type is:
                </p>
                <h4 className="text-3xl font-bold text-[#A10550] mb-2">
                  {quizResult.detectedSkinType}
                </h4>
                <div className="w-24 h-1 bg-[#A10550] mx-auto"></div>
              </div>

              {quizResult.skinTypeScores && (
                <div className="mb-8 bg-pink-50 p-4 rounded-xl">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Skin Type Scores
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(quizResult.skinTypeScores).map(([type, score]) => {
                      const totalScore = Object.values(quizResult.skinTypeScores).reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;
                      return (
                        <div key={type} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">{type}</span>
                            <span className="font-bold text-[#A10550]">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#A10550] h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <details className="group mb-6">
                <summary className="flex justify-between items-center cursor-pointer list-none bg-gray-100 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-900">Your Answers</h4>
                  <div className="text-[#A10550] group-open:rotate-180 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </summary>
                <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
                  {quizResult.userResponses && Array.isArray(quizResult.userResponses) ? (
                    <div className="space-y-4">
                      {quizResult.userResponses.map((response, index) => (
                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                          <p className="text-gray-800 font-medium mb-1">
                            {index + 1}. {response.questionText}
                          </p>
                          <p className="text-gray-600">
                            Your Answer:{" "}
                            <span className="text-[#A10550]">{response.answerText}</span>
                          </p>
                          <div className="flex gap-2 mt-1 text-xs">
                            <span className="px-2 py-0.5 bg-pink-50 text-[#A10550] rounded-full">
                              Score: {response.score}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded-full">
                              Skin Type: {response.skinType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">No user responses available.</p>
                  )}
                </div>
              </details>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link
                  to="/"
                  className="px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443]"
                >
                  Back to Home
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3 border-2 border-[#A10550] text-[#A10550] rounded-lg hover:bg-pink-50"
                >
                  View Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;