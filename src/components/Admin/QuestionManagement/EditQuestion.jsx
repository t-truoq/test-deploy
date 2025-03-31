"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function EditQuestionForm({ question, onSave, onCancel }) {
  // Khởi tạo editedQuestion dựa trên prop question
  const [editedQuestion, setEditedQuestion] = useState({
    id: question.id,
    questionText: question.questionText || "",
    answers: question.answers.length
      ? question.answers.map((answer) => ({
          // Đảm bảo các trường cần thiết đều có giá trị
          answerText: answer.answerText || "",
          score: answer.score || 0,
          skinType: answer.skinType || "NORMAL", // Mặc định chỉ khi không có skinType
        }))
      : [],
  });

  const handleQuestionChange = (e) => {
    setEditedQuestion({ ...editedQuestion, questionText: e.target.value });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...editedQuestion.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Đảm bảo dữ liệu gửi đi không có giá trị undefined
    const cleanedQuestion = {
      ...editedQuestion,
      answers: editedQuestion.answers.map((answer) => ({
        answerText: answer.answerText || "",
        score: answer.score || 0,
        skinType: answer.skinType || "NORMAL",
      })),
    };
    onSave(cleanedQuestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-md md:max-w-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-[#3D021E]">
            Edit Question
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="question"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Question Text
            </label>
            <textarea
              id="question"
              value={editedQuestion.questionText}
              onChange={handleQuestionChange}
              placeholder="Enter question text"
              className="w-full min-h-[80px] sm:min-h-[100px] rounded-md border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Answers
            </label>
            {editedQuestion.answers.length > 0 ? (
              editedQuestion.answers.map((answer, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    value={answer.answerText}
                    onChange={(e) =>
                      handleAnswerChange(index, "answerText", e.target.value)
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                    placeholder={`Answer ${index + 1}`}
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
                      className="w-full sm:w-20 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                      placeholder="Score"
                    />
                    <select
                      value={answer.skinType} // Hiển thị skinType từ dữ liệu
                      onChange={(e) =>
                        handleAnswerChange(index, "skinType", e.target.value)
                      }
                      className="w-full sm:w-32 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                    >
                      <option value="SENSITIVE">Sensitive</option>
                      <option value="NORMAL">Normal</option>
                      <option value="OILY">Oily</option>
                      <option value="COMBINATION">Combination</option>
                      <option value="DRY">DRY</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">
                No answers available. Add answers in the parent component.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] text-xs sm:text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

EditQuestionForm.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    questionText: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        answerText: PropTypes.string,
        score: PropTypes.number,
        skinType: PropTypes.oneOf(["SENSITIVE", "NORMAL", "OILY", "COMBINATION","DRY"]),
      })
    ),
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};