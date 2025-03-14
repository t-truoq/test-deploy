import { useState } from "react";
import EditQuestionForm from "./EditQuestion";

// Mock data for skin classification questions
const initialQuestions = [
  {
    id: "290719925474099",
    question: "Does your skin tend to get oily by the end of the day?",
    skinType: "OILY",
    options: ["Yes, a lot", "Yes, a little", "No, my skin is dry", "Not sure"],
  },
  {
    id: "290719925474100",
    question: "Do you frequently get acne?",
    skinType: "OILY",
    options: ["Yes, frequently", "Occasionally", "Rarely", "Never"],
  },
  {
    id: "290719925474101",
    question: "Is your skin sensitive to sunlight?",
    skinType: "SENSITIVE",
    options: [
      "Very sensitive",
      "Slightly sensitive",
      "Not sensitive",
      "Not sure",
    ],
  },
  {
    id: "290719925474102",
    question: "Does your skin get red after using new products?",
    skinType: "SENSITIVE",
    options: ["Frequently", "Sometimes", "Rarely", "Never"],
  },
  {
    id: "290719925474103",
    question: "What is the size of your pores?",
    skinType: "DRY",
    options: ["Large and visible", "Medium", "Small, hard to see", "Not sure"],
  },
];

export default function QuestionDashboard() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // New state for add modal
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // State for the new question form
  const [newQuestion, setNewQuestion] = useState({
    id: "",
    question: "",
    skinType: "",
    options: ["", "", "", ""], // Initialize with 4 empty options
  });

  const handleDelete = (id) => {
    setQuestionToDelete(id);
    setIsDeleteDialogOpen(true);
    setDropdownOpen(null);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      setQuestions(questions.filter((q) => q.id !== questionToDelete));
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
    setDropdownOpen(null);
  };

  const saveEditedQuestion = (editedQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === editedQuestion.id ? editedQuestion : q))
    );
    setIsEditDialogOpen(false);
    setEditingQuestion(null);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleAddQuestion = () => {
    if (
      newQuestion.id &&
      newQuestion.question &&
      newQuestion.skinType &&
      newQuestion.options.every((opt) => opt.trim() !== "")
    ) {
      setQuestions([...questions, newQuestion]);
      setIsAddDialogOpen(false);
      // Reset the form after adding
      setNewQuestion({
        id: "",
        question: "",
        skinType: "",
        options: ["", "", "", ""],
      });
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-4">
          {/* Add Question Button */}
          <div className="flex justify-end">
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center"
              onClick={() => setIsAddDialogOpen(true)}
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
              Add Question
            </button>
          </div>

          {/* Question List (always visible) */}
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Question
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Skin Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Number of Options
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No questions found.
                      </td>
                    </tr>
                  ) : (
                    questions.map((question) => (
                      <tr key={question.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {question.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[300px] truncate">
                          {question.question}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.skinType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.options.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              className="text-gray-400 hover:text-gray-500 h-8 w-8 p-0"
                              onClick={() => toggleDropdown(question.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                              </svg>
                            </button>
                            {dropdownOpen === question.id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <div className="px-4 py-2 text-xs text-gray-500">
                                    Actions
                                  </div>
                                  <hr />
                                  <button
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleEdit(question)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleDelete(question.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Question Modal */}
          {isAddDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Add New Question</h3>
                  <p className="text-sm text-gray-500">
                    Fill in the details for the skin type question.
                  </p>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ID
                    </label>
                    <input
                      type="text"
                      value={newQuestion.id}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, id: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter question ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          question: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Skin Type
                    </label>
                    <select
                      value={newQuestion.skinType}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          skinType: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select skin type</option>
                      <option value="OILY">Oily</option>
                      <option value="SENSITIVE">Sensitive</option>
                      <option value="DRY">Dry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    {newQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-end space-x-2 border-t">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    onClick={handleAddQuestion}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Question Dialog */}
          {isEditDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Edit Question</h3>
                  <p className="text-sm text-gray-500">
                    Edit the details for the skin type question.
                  </p>
                </div>
                {editingQuestion && (
                  <EditQuestionForm
                    question={editingQuestion}
                    onSave={saveEditedQuestion}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {isDeleteDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium">Confirm Delete</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this question? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="px-6 py-4 flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
