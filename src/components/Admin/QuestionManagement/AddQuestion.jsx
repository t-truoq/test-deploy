"use client";

import { useState } from "react";
import axios from "axios";
import { XIcon } from "lucide-react";

const BACKEND_URL = "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app";

export default function AddQuestionForm({ onSuccess, onCancel }) {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { answerText: "Căng rát", score: 3, skinType: "SENSITIVE" },
    { answerText: "Mềm mại, không khô chịu", score: 2, skinType: "SENSITIVE" },
    {
      answerText: "Dấu xuất hiện sau vài giờ",
      score: 3,
      skinType: "SENSITIVE",
    },
    {
      answerText: "Khô ở một số vùng, đầu ở vùng khác",
      score: 2,
      skinType: "SENSITIVE",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || answers.some((ans) => !ans.answerText.trim())) {
      setError("Vui lòng điền đầy đủ câu hỏi và tất cả các đáp án!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const requestBody = { questionText, answers };

      const response = await axios.post(
        `${BACKEND_URL}/api/quiz/questions`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      onSuccess(response.data);
      setQuestionText("");
      setAnswers([
        { answerText: "", score: 0, skinType: "SENSITIVE" },
        { answerText: "", score: 0, skinType: "NORMAL" },
        { answerText: "", score: 0, skinType: "OILY" },
        { answerText: "", score: 0, skinType: "COMBINATION" },
      ]);
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Không thể thêm câu hỏi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm w-full max-w-[90%] sm:max-w-2xl mx-auto">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-medium text-[#3D021E]">
            Thêm câu hỏi mới
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Tạo câu hỏi mới cho hệ thống phân loại da.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="questionText"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Câu hỏi
            </label>
            <textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập câu hỏi phân loại da"
              className="w-full min-h-[80px] sm:min-h-[100px] rounded-md border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Các đáp án
            </label>
            {answers.map((answer, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  value={answer.answerText}
                  onChange={(e) =>
                    handleAnswerChange(index, "answerText", e.target.value)
                  }
                  placeholder={`Đáp án ${index + 1}`}
                  className="w-full rounded-md border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
                  required
                  disabled={isSubmitting}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    value={answer.score}
                    onChange={(e) =>
                      handleAnswerChange(
                        index,
                        "score",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Điểm"
                    className="w-full sm:w-20 rounded-md border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
                    required
                    disabled={isSubmitting}
                  />
                  <select
                    value={answer.skinType}
                    onChange={(e) =>
                      handleAnswerChange(index, "skinType", e.target.value)
                    }
                    className="w-full sm:w-32 rounded-md border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    <option value="SENSITIVE">Sensitive</option>
                    <option value="NORMAL">Normal</option>
                    <option value="OILY">Oily</option>
                    <option value="COMBINATION">Combination</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
          <button
            type="button"
            className="w-full sm:w-auto rounded-md border border-gray-300 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => {
              setQuestionText("");
              setAnswers([
                { answerText: "", score: 0, skinType: "SENSITIVE" },
                { answerText: "", score: 0, skinType: "NORMAL" },
                { answerText: "", score: 0, skinType: "OILY" },
                { answerText: "", score: 0, skinType: "COMBINATION" },
              ]);
              setError(null);
            }}
            disabled={isSubmitting}
          >
            Xóa tất cả
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-md bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
}
