"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import EditQuestionForm from "./EditQuestion";

const BACKEND_URL =
  "https://b865-2405-4802-811e-11a0-875-581e-b53-2910.ngrok-free.app";

export default function QuestionDashboard() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({}); // Object to track open state per question ID
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    skinType: "",
    answers: [
      { answerText: "", score: 0 },
      { answerText: "", score: 0 },
      { answerText: "", score: 0 },
      { answerText: "", score: 0 },
    ],
  });

  // Ref object to store refs for each dropdown
  const dropdownRefs = useRef({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownOpen).forEach((questionId) => {
        if (
          dropdownOpen[questionId] &&
          dropdownRefs.current[questionId] &&
          !dropdownRefs.current[questionId].contains(event.target)
        ) {
          console.log(`Closing dropdown for question: ${questionId}`);
          setDropdownOpen((prev) => ({ ...prev, [questionId]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/quiz/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const transformedQuestions = response.data.map((q) => ({
        id: q.id,
        question: q.questionText,
        skinType: q.skinType,
        options: q.answers.map((a) => a.answerText),
      }));
      setQuestions(transformedQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message);
      showToast({
        title: "Error",
        message: err.message || "Failed to load questions.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setQuestionToDelete(id);
    setIsDeleteDialogOpen(true);
    setDropdownOpen((prev) => ({ ...prev, [id]: false })); // Close dropdown after action
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${BACKEND_URL}/api/quiz/questions/${questionToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(questions.filter((q) => q.id !== questionToDelete));
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
      showToast({
        title: "Deleted",
        message: "Question has been deleted.",
        type: "info",
      });
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(err.message);
      showToast({
        title: "Error",
        message: err.message || "Failed to delete question.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
    setDropdownOpen((prev) => ({ ...prev, [question.id]: false })); // Close dropdown after action
  };

  const saveEditedQuestion = async (editedQuestion) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        questionText: editedQuestion.question,
        skinType: editedQuestion.skinType,
        answers: editedQuestion.options.map((opt, index) => ({
          answerText: opt,
          score: index,
        })),
      };
      const response = await axios.put(
        `${BACKEND_URL}/api/quiz/questions/${editedQuestion.id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedQuestion = {
        id: response.data.id,
        question: response.data.questionText,
        skinType: response.data.skinType,
        options: response.data.answers.map((a) => a.answerText),
      };
      setQuestions(
        questions.map((q) => (q.id === editedQuestion.id ? updatedQuestion : q))
      );
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
      showToast({
        title: "Success",
        message: "Question updated successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Error updating question:", err);
      setError(err.message);
      showToast({
        title: "Error",
        message: err.message || "Failed to update question.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (
      newQuestion.questionText &&
      newQuestion.skinType &&
      newQuestion.answers.every((ans) => ans.answerText.trim() !== "")
    ) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const requestBody = {
          questionText: newQuestion.questionText,
          skinType: newQuestion.skinType,
          answers: newQuestion.answers,
        };
        const response = await axios.post(
          `${BACKEND_URL}/api/quiz/questions`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const addedQuestion = {
          id: response.data.id,
          question: response.data.questionText,
          skinType: response.data.skinType,
          options: response.data.answers.map((a) => a.answerText),
        };
        setQuestions([...questions, addedQuestion]);
        setIsAddDialogOpen(false);
        setNewQuestion({
          questionText: "",
          skinType: "",
          answers: [
            { answerText: "", score: 0 },
            { answerText: "", score: 0 },
            { answerText: "", score: 0 },
            { answerText: "", score: 0 },
          ],
        });
        showToast({
          title: "Success",
          message: "Question added successfully.",
          type: "success",
        });
      } catch (err) {
        console.error("Error adding question:", err);
        setError(err.message);
        showToast({
          title: "Error",
          message: err.message || "Failed to add question.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please fill in all fields!");
      showToast({
        title: "Error",
        message: "Please fill in all fields!",
        type: "error",
      });
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedAnswers = [...newQuestion.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white border-gray-100 p-8 rounded-xl shadow-lg border backdrop-blur-sm"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-20 h-20 rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-xl text-[#3D021E] font-medium">
            Loading questions...
          </h3>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-gray-200 p-6 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <div className="w-20 h-20 mx-auto mb-6 text-[#3D021E]">
            <svg
              className="h-20 w-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#3D021E] mb-2">{error}</h2>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors mt-4"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Question Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your skin type quiz questions
            </p>
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors flex items-center"
              onClick={() => setIsAddDialogOpen(true)}
              disabled={isLoading}
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
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Number of Options
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  questions.map((question, index) => (
                    <motion.tr
                      key={question.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {question.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px] truncate">
                        {question.question}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {question.options.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div
                          className="relative"
                          ref={(el) => (dropdownRefs.current[question.id] = el)}
                        >
                          <button
                            onClick={() => {
                              console.log(
                                `Toggling dropdown for question: ${question.id}`
                              );
                              setDropdownOpen((prev) => ({
                                ...prev,
                                [question.id]: !prev[question.id],
                              }));
                            }}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          {dropdownOpen[question.id] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 overflow-hidden ${
                                index === questions.length - 1
                                  ? "bottom-full mb-2"
                                  : "top-full mt-2"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1" role="menu">
                                <button
                                  onClick={() => handleEdit(question)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Edit Question
                                </button>
                                <button
                                  onClick={() => handleDelete(question.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Delete Question
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg max-w-md z-50 border-l-4 ${
              toast.type === "success"
                ? "bg-green-100 border-green-500"
                : toast.type === "error"
                ? "bg-red-100 border-red-500"
                : "bg-blue-100 border-blue-500"
            }`}
          >
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {toast.title}
                </h3>
                <div className="mt-1 text-sm text-gray-700">
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-full p-1.5"
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Add Question Modal */}
        {isAddDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#3D021E]">
                  Add New Question
                </h3>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newQuestion.questionText}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        questionText: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
                    placeholder="Enter question"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
                    disabled={isLoading}
                  >
                    <option value="">Select skin type</option>
                    <option value="OILY">Oily</option>
                    <option value="DRY">Dry</option>
                    <option value="SENSITIVE">Sensitive</option>
                    <option value="COMBINATION">Combination</option>
                    <option value="NORMAL">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answers
                  </label>
                  {newQuestion.answers.map((answer, index) => (
                    <div key={index} className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={answer.answerText}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            "answerText",
                            e.target.value
                          )
                        }
                        className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
                        placeholder={`Answer ${index + 1}`}
                        disabled={isLoading}
                      />
                      <input
                        type="number"
                        value={answer.score}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            "score",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E]"
                        placeholder="Score"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Question Modal */}
        {isEditDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#3D021E]">
                  Edit Question
                </h3>
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              {editingQuestion && (
                <EditQuestionForm
                  question={editingQuestion}
                  onSave={saveEditedQuestion}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-[#3D021E] mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this question? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
