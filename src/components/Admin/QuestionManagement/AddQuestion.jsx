"use client";

import { useState } from "react";
import axios from "axios";
import { XIcon } from "lucide-react";

const BACKEND_URL = "https://1728-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app";

export default function AddQuestionForm({ onSuccess, onCancel }) {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { answerText: "", score: 0, skinType: "SENSITIVE" },
    { answerText: "", score: 0, skinType: "NORMAL" },
    { answerText: "", score: 0, skinType: "OILY" },
    { answerText: "", score: 0, skinType: "COMBINATION" },
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

    // Kiểm tra dữ liệu đầu vào
    if (
      !questionText.trim() ||
      answers.some((ans) => !ans.answerText.trim())
    ) {
      setError("Vui lòng điền đầy đủ câu hỏi và tất cả các đáp án!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        questionText,
        answers,
      };

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

      // Gọi hàm onSuccess từ props để thông báo thành công
      onSuccess(response.data);

      // Reset form
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
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#3D021E]">Thêm câu hỏi mới</h3>
          <p className="text-sm text-gray-500">
            Tạo câu hỏi mới cho hệ thống phân loại da.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-4 space-y-4">
          {/* Question Text */}
          <div className="space-y-2">
            <label
              htmlFor="questionText"
              className="block text-sm font-medium text-gray-700"
            >
              Câu hỏi
            </label>
            <textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập câu hỏi phân loại da"
              className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Answers */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Các đáp án
            </label>
            {answers.map((answer, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={answer.answerText}
                  onChange={(e) =>
                    handleAnswerChange(index, "answerText", e.target.value)
                  }
                  placeholder={`Đáp án ${index + 1}`}
                  className="flex-1 rounded-md border border-gray-300 p-2 focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
                  required
                  disabled={isSubmitting}
                />
                <input
                  type="number"
                  value={answer.score}
                  onChange={(e) =>
                    handleAnswerChange(index, "score", parseInt(e.target.value) || 0)
                  }
                  placeholder="Điểm"
                  className="w-20 rounded-md border border-gray-300 p-2 focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
                  required
                  disabled={isSubmitting}
                />
                <select
                  value={answer.skinType}
                  onChange={(e) =>
                    handleAnswerChange(index, "skinType", e.target.value)
                  }
                  className="w-32 rounded-md border border-gray-300 p-2 focus:border-[#3D021E] focus:outline-none focus:ring-1 focus:ring-[#3D021E] transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <option value="SENSITIVE">Sensitive</option>
                  <option value="NORMAL">Normal</option>
                  <option value="OILY">Oily</option>
                  <option value="COMBINATION">Combination</option>
                </select>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
            className="rounded-md bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] px-4 py-2 text-sm font-medium text-white hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
}