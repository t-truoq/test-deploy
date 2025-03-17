"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";

export default function EditQuestionForm({ question, onSave, onCancel }) {
  const [editedQuestion, setEditedQuestion] = useState({
    id: question.id,
    questionText: question.questionText,
    answers: [...question.answers],
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
    onSave(editedQuestion);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Question Text
        </label>
        <textarea
          id="question"
          value={editedQuestion.questionText}
          onChange={handleQuestionChange}
          placeholder="Enter question text"
          className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Answers
        </label>
        {editedQuestion.answers.map((answer, index) => (
          <div key={index} className="flex gap-2 mt-1">
            <input
              type="text"
              value={answer.answerText}
              onChange={(e) =>
                handleAnswerChange(index, "answerText", e.target.value)
              }
              className="w-2/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
              placeholder={`Answer ${index + 1}`}
            />
            <input
              type="number"
              value={answer.score}
              onChange={(e) =>
                handleAnswerChange(index, "score", parseInt(e.target.value))
              }
              className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
              placeholder="Score"
            />
            <select
              value={answer.skinType}
              onChange={(e) =>
                handleAnswerChange(index, "skinType", e.target.value)
              }
              className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
            >
              <option value="SENSITIVE">Sensitive</option>
              <option value="NORMAL">Normal</option>
              <option value="OILY">Oily</option>
              <option value="COMBINATION">Combination</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D]"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}