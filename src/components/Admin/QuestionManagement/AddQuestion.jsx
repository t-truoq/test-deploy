"use client";

import { useState } from "react";

export default function AddQuestionForm({ onSuccess }) {
  const [skinType, setSkinType] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (newOption.trim() !== "") {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send this data to your API
      console.log({
        question,
        skinType,
        options,
      });

      // Reset form
      setQuestion("");
      setSkinType("");
      setOptions([]);
      setIsSubmitting(false);

      // Notify parent component
      onSuccess();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium">Thêm câu hỏi mới</h3>
        <p className="text-sm text-gray-500">
          Tạo câu hỏi mới cho hệ thống phân loại da.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Câu hỏi
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi phân loại da"
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
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Chọn loại da
              </option>
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
              {options.map((option, index) => (
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
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center"
                onClick={addOption}
                disabled={newOption.trim() === ""}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm
              </button>
            </div>
            {options.length === 0 && (
              <p className="text-sm text-gray-500">
                Thêm ít nhất 2 lựa chọn cho câu hỏi.
              </p>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-between">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setQuestion("");
              setSkinType("");
              setOptions([]);
              setNewOption("");
            }}
          >
            Xóa tất cả
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            disabled={
              isSubmitting ||
              question.trim() === "" ||
              skinType === "" ||
              options.length < 2
            }
          >
            {isSubmitting ? "Đang lưu..." : "Lưu câu hỏi"}
          </button>
        </div>
      </form>
    </div>
  );
}
