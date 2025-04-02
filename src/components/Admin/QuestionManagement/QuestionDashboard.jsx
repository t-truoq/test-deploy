"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import EditQuestionForm from "./EditQuestion";

const BACKEND_URL = "https://enhanced-perfectly-dog.ngrok-free.app";

export default function QuestionDashboard() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    answers: [
      { answerText: "", score: 0, skinType: "SENSITIVE" },
      { answerText: "", score: 0, skinType: "NORMAL" },
      { answerText: "", score: 0, skinType: "OILY" },
      { answerText: "", score: 0, skinType: "COMBINATION" },
  
    ],
  });

  const dropdownRefs = useRef({});

  useEffect(() => {
    fetchQuestions();
  }, []); // Removed fetchQuestions from dependency array since it's defined inside the component

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownOpen).forEach((questionId) => {
        if (
          dropdownOpen[questionId] &&
          dropdownRefs.current[questionId] &&
          !dropdownRefs.current[questionId].contains(event.target)
        ) {
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
        questionText: q.questionText,
        answers: q.answers.map((a) => ({
          answerText: a.answerText,
          score: a.score,
          skinType: a.skinType,
        })),
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
    setDropdownOpen((prev) => ({ ...prev, [id]: false }));
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${BACKEND_URL}/api/quiz/questions/${questionToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
    setDropdownOpen((prev) => ({ ...prev, [question.id]: false }));
  };

  const saveEditedQuestion = async (editedQuestion) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const requestBody = {
        questionText: editedQuestion.questionText,
        answers: editedQuestion.answers,
      };
      const response = await axios.put(
        `${BACKEND_URL}/api/quiz/questions/${editedQuestion.id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const updatedQuestion = {
        id: response.data.id,
        questionText: response.data.questionText,
        answers: response.data.answers,
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
      newQuestion.answers.every((ans) => ans.answerText.trim() !== "")
    ) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const requestBody = {
          questionText: newQuestion.questionText,
          answers: newQuestion.answers,
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
        const addedQuestion = {
          id: response.data.id,
          questionText: response.data.questionText,
          answers: response.data.answers,
        };
        setQuestions([...questions, addedQuestion]);
        setIsAddDialogOpen(false);
        setNewQuestion({
          questionText: "",
          answers: [
            { answerText: "", score: 0, skinType: "SENSITIVE" },
            { answerText: "", score: 0, skinType: "NORMAL" },
            { answerText: "", score: 0, skinType: "OILY" },
            { answerText: "", score: 0, skinType: "COMBINATION" },
          
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

  const handleAnswerChange = (index, field, value) => {
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-6 rounded-xl shadow-lg border"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-[#3D021E] border-t-transparent"
            />
          </div>
          <h3 className="text-lg sm:text-xl text-[#3D021E] font-medium">
            Loading questions...
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
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
          className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center border"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D021E] mb-2">
            Error: {error}
          </h2>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D]">
              Question Dashboard
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Manage your skin type quiz questions
            </p>
          </div>
          <button
            className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white rounded-lg hover:from-[#4A0404] hover:to-[#7D1F4D] transition-colors text-xs sm:text-sm"
            onClick={() => setIsAddDialogOpen(true)}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 sm:mr-2 h-4 w-4"
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

        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] text-white">
                <tr>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Question Text
                  </th>
                  <th className="hidden md:table-cell px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Number of Answers
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <motion.tr key={question.id}>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {question.id}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-[200px] sm:max-w-[300px] truncate">
                      {question.questionText}
                    </td>
                    <td className="hidden md:table-cell px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {question.answers.length}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current[question.id] = el)}
                      >
                        <button
                          onClick={() =>
                            setDropdownOpen((prev) => ({
                              ...prev,
                              [question.id]: !prev[question.id],
                            }))
                          }
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-200"
                        >
                          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        {dropdownOpen[question.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`absolute right-0 w-40 sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${
                              index === questions.length - 1
                                ? "bottom-full mb-2" // Last row: dropdown above
                                : "top-full mt-2" // Other rows: dropdown below
                            }`}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(question)}
                                className="block w-full text-left px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit Question
                              </button>
                              <button
                                onClick={() => handleDelete(question.id)}
                                className="block w-full text-left px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete Question
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Question Modal */}
        {isAddDialogOpen && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-[#3D021E]">
                  Add New Question
                </h3>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Question Text
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
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                    placeholder="Enter question text"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Answers
                  </label>
                  {newQuestion.answers.map((answer, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-2 mt-1"
                    >
                      <input
                        type="text"
                        value={answer.answerText}
                        onChange={(e) =>
                          handleAnswerChange(
                            index,
                            "answerText",
                            e.target.value
                          )
                        }
                        className="w-full sm:w-2/4 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                        placeholder={`Answer ${index + 1}`}
                      />
                      <input
                        type="number"
                        value={answer.score}
                        onChange={(e) =>
                          handleAnswerChange(
                            index,
                            "score",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full sm:w-1/4 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                        placeholder="Score"
                      />
                      <select
                        value={answer.skinType}
                        onChange={(e) =>
                          handleAnswerChange(index, "skinType", e.target.value)
                        }
                        className="w-full sm:w-1/4 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D021E] text-xs sm:text-sm"
                      >
                        <option value="SENSITIVE">Sensitive</option>
                        <option value="NORMAL">Normal</option>
                        <option value="OILY">Oily</option>
                        <option value="COMBINATION">Combination</option>
                        <option value="DRY">DRY</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] text-xs sm:text-sm"
                >
                  {isLoading ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Question Modal */}
        {isEditDialogOpen && (
          <EditQuestionForm
            question={editingQuestion}
            onSave={saveEditedQuestion}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteDialogOpen && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#3D021E] mb-3 sm:mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                Are you sure you want to delete this question?
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-[#3D021E] text-white rounded-lg hover:bg-[#4A0404] text-xs sm:text-sm"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toast Notification */}
        {toast && (
          <motion.div
            className={`fixed bottom-4 right-4 p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md z-50 border-l-4 ${
              toast.type === "success"
                ? "bg-green-100 border-green-500"
                : toast.type === "error"
                ? "bg-red-100 border-red-500"
                : "bg-blue-100 border-blue-500"
            }`}
          >
            <div className="flex items-start">
              <div className="ml-2 sm:ml-3">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                  {toast.title}
                </h3>
                <div className="mt-1 text-xs sm:text-sm text-gray-700">
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-full p-1 sm:p-1.5"
              >
                <XIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
