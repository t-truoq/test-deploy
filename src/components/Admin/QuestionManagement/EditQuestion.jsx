"use client";
import { useState } from "react";

export default function EditQuestionForm({ question, onSave, onCancel }) {
  const [editedQuestion, setEditedQuestion] = useState({ ...question });
  const [newOption, setNewOption] = useState("");

  const handleQuestionChange = (e) => {
    setEditedQuestion({ ...editedQuestion, question: e.target.value });
  };

  const handleSkinTypeChange = (e) => {
    setEditedQuestion({ ...editedQuestion, skinType: e.target.value });
  };

  const addOption = () => {
    if (newOption.trim() !== "") {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (index) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions.splice(index, 1);
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedQuestion);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Câu hỏi
        </label>
        <textarea
          id="question"
          value={editedQuestion.question}
          onChange={handleQuestionChange}
          placeholder="Nhập câu hỏi"
          className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="skinType"
          className="block text-sm font-medium text-gray-700"
        >
          Loại da
        </label>
        <select
          id="skinType"
          value={editedQuestion.skinType}
          onChange={handleSkinTypeChange}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="OILY">OILY</option>
          <option value="DRY">DRY</option>
          <option value="SENSITIVE">SENSITIVE</option>
          <option value="COMBINATION">COMBINATION</option>
          <option value="NORMAL">NORMAL</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Các lựa chọn
        </label>
        <div className="space-y-2">
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                readOnly
                className="flex-1 rounded-md border border-gray-300 p-2 bg-gray-50"
              />
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => removeOption(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Thêm lựa chọn mới"
            className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={addOption}
          >
            Thêm
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}
