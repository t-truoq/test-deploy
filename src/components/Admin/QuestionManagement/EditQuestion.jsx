"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Question
        </label>
        <textarea
          id="question"
          value={editedQuestion.question}
          onChange={handleQuestionChange}
          placeholder="Enter question"
          className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="skinType"
          className="block text-sm font-medium text-gray-700"
        >
          Skin Type
        </label>
        <select
          id="skinType"
          value={editedQuestion.skinType}
          onChange={handleSkinTypeChange}
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300"
        >
          <option value="OILY">Oily</option>
          <option value="DRY">Dry</option>
          <option value="SENSITIVE">Sensitive</option>
          <option value="COMBINATION">Combination</option>
          <option value="NORMAL">Normal</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        <div className="space-y-2">
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                readOnly
                className="flex-1 rounded-md border border-gray-300 p-2 bg-gray-50 text-gray-600"
              />
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                onClick={() => removeOption(index)}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Add new option"
            className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#3D021E] transition-all duration-300"
          />
          <button
            type="button"
            className="rounded-md bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] px-4 py-2 text-white hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
            onClick={addOption}
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
