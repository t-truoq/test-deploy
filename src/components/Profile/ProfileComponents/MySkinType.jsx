"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MySkinType = () => {
  const [skinTypeResult, setSkinTypeResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Hàm lấy kết quả từ localStorage
  const loadSkinTypeResult = () => {
    const result = localStorage.getItem("skinTypeResult");
    if (result) {
      setSkinTypeResult(JSON.parse(result));
    } else {
      setSkinTypeResult(null);
    }
  };

  // Lấy kết quả khi component mount
  useEffect(() => {
    loadSkinTypeResult();

    // Lắng nghe sự kiện storage để cập nhật khi localStorage thay đổi
    const handleStorageChange = (event) => {
      if (event.key === "skinTypeResult") {
        loadSkinTypeResult();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Hàm lấy icon cho từng loại da
  const getSkinTypeIcon = (skinType) => {
    switch (skinType?.toUpperCase()) {
      case "OILY":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        );
      case "DRY":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2h8M12 2v6M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
          </svg>
        );
      case "COMBINATION":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20Z" />
          </svg>
        );
      case "NORMAL":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
          </svg>
        );
      case "SENSITIVE":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9M19.1 4.9C23 8.8 23 15.2 19.1 19.1M16.2 7.8C18.2 9.8 18.2 13.1 16.2 15.1M7.8 15.1C5.8 13.1 5.8 9.8 7.8 7.8" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
          </svg>
        );
    }
  };

  // Hàm lấy mô tả cho từng loại da
  const getSkinTypeDescription = (skinType) => {
    switch (skinType?.toUpperCase()) {
      case "OILY":
        return "Oily skin produces excess sebum, giving a shiny appearance. It's prone to acne and enlarged pores, but often ages well with fewer wrinkles.";
      case "DRY":
        return "Dry skin lacks moisture and natural oils, feeling tight and rough. It's prone to flaking, redness, and fine lines, requiring consistent hydration.";
      case "COMBINATION":
        return "Combination skin features both oily and dry areas. Typically, the T-zone (forehead, nose, chin) is oily while cheeks are dry, requiring balanced care.";
      case "NORMAL":
        return "Normal skin is well-balanced, neither too oily nor too dry. It has good circulation, a smooth texture, small pores, and few imperfections.";
      case "SENSITIVE":
        return "Sensitive skin reacts easily to products or environmental factors with redness, itching, or burning. It requires gentle, fragrance-free products.";
      default:
        return "Your skin type determines how your skin looks, feels, and reacts to products. Understanding your skin type helps you choose the right skincare routine.";
    }
  };

  if (!skinTypeResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 text-pink-500 bg-pink-50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12h6m-3-3v6m-9 3h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-8">
            You haven't taken the skin type quiz yet. Discover your unique skin profile to get personalized
            recommendations.
          </p>
          <Link
            to="/quiz"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#A10550] to-pink-600 text-white rounded-lg hover:from-[#8a0443] hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Take the Quiz Now
          </Link>
        </div>
      </div>
    );
  }

  // Tính tổng điểm
  const totalScore = skinTypeResult.skinTypeScores
    ? Object.values(skinTypeResult.skinTypeScores).reduce((a, b) => a + b, 0)
    : 0;

  // Tìm loại da có điểm cao nhất
  const dominantSkinType = skinTypeResult.skinTypeScores
    ? Object.entries(skinTypeResult.skinTypeScores).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#A10550] to-pink-600 p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-10 -ml-10"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                {getSkinTypeIcon(skinTypeResult.detectedSkinType)}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Your Skin Type: {skinTypeResult.detectedSkinType || "Not Determined"}
                </h1>
                <p className="text-white/80 max-w-2xl">
                  {getSkinTypeDescription(skinTypeResult.detectedSkinType)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                  activeTab === "overview"
                    ? "border-[#A10550] text-[#A10550]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("scores")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                  activeTab === "scores"
                    ? "border-[#A10550] text-[#A10550]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Skin Type Scores
              </button>
              <button
                onClick={() => setActiveTab("answers")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                  activeTab === "answers"
                    ? "border-[#A10550] text-[#A10550]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Your Answers
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-pink-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-[#A10550]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
                      <path d="m15 9-6 6" />
                      <path d="m9 9 6 6" />
                    </svg>
                    Key Characteristics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800 mb-2">Dominant Skin Type</h4>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#A10550]/10 flex items-center justify-center mr-3">
                          {getSkinTypeIcon(dominantSkinType)}
                        </div>
                        <span className="text-[#A10550] font-semibold">{dominantSkinType || "Not determined"}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-800 mb-2">Total Score Points</h4>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#A10550]/10 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#A10550]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                        <span className="text-[#A10550] font-semibold">{totalScore} points</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-[#A10550]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Skincare Recommendations
                  </h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-[#A10550] mb-2">For {skinTypeResult.detectedSkinType} Skin</h4>
                    
                    {skinTypeResult.detectedSkinType?.toUpperCase() === "OILY" && (
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use a gentle foaming cleanser twice daily
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Apply oil-free, non-comedogenic moisturizers
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use products with salicylic acid or niacinamide
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Consider clay masks 1-2 times weekly
                        </li>
                      </ul>
                    )}
                    
                    {skinTypeResult.detectedSkinType?.toUpperCase() === "DRY" && (
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use a creamy, hydrating cleanser
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Apply rich moisturizers with ceramides or hyaluronic acid
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Consider facial oils as part of your routine
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use hydrating masks 1-2 times weekly
                        </li>
                      </ul>
                    )}
                    
                    {skinTypeResult.detectedSkinType?.toUpperCase() === "COMBINATION" && (
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use a balanced cleanser that won't strip skin
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Consider multi-masking (different masks for different areas)
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24  packer.com/350/1" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use lightweight, oil-free moisturizers
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Apply targeted treatments to specific areas as needed
                        </li>
                      </ul>
                    )}
                    
                    {skinTypeResult.detectedSkinType?.toUpperCase() === "NORMAL" && (
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Maintain with a gentle cleanser
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use a light, balanced moisturizer
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Focus on prevention and maintenance
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use antioxidant serums to protect skin
                        </li>
                      </ul>
                    )}
                    
                    {skinTypeResult.detectedSkinType?.toUpperCase() === "SENSITIVE" && (
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Use fragrance-free, hypoallergenic products
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Patch test new products before full application
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Look for soothing ingredients like aloe, chamomile, and oat
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Avoid harsh exfoliants and alcohol-based products
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Scores Tab */}
            {activeTab === "scores" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#A10550]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20V10" />
                    <path d="M18 20V4" />
                    <path d="M6 20v-4" />
                  </svg>
                  Skin Type Distribution
                </h3>
                
                {skinTypeResult.skinTypeScores && typeof skinTypeResult.skinTypeScores === "object" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(skinTypeResult.skinTypeScores).map(([type, score]) => {
                        const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;
                        
                        return (
                          <div
                            key={type}
                            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#A10550]/10 flex items-center justify-center mr-3">
                                  {getSkinTypeIcon(type)}
                                </div>
                                <span className="font-medium text-gray-800">{type}</span>
                              </div>
                              <span className="font-bold text-[#A10550]">{percentage.toFixed(1)}%</span>
                            </div>
                            
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#A10550] bg-pink-100">
                                    {score} points
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                                <div
                                  style={{ width: `${percentage}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#A10550] to-pink-500 transition-all duration-500 ease-in-out"
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-pink-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">What Your Scores Mean</h4>
                      <p className="text-gray-700 mb-4">
                        Your skin type scores show the distribution of different skin characteristics based on your quiz answers. 
                        The dominant type represents your primary skin type, but most people have a combination of characteristics.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white p-3 rounded-lg">
                          <span className="font-medium text-[#A10550]">Higher percentages</span>: More prominent characteristics
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="font-medium text-[#A10550]">Lower percentages</span>: Less prominent characteristics
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Answers Tab */}
            {activeTab === "answers" && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#A10550]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  Your Quiz Responses
                </h3>

                <div className="space-y-4">
                  {skinTypeResult.userResponses && Array.isArray(skinTypeResult.userResponses) ? (
                    skinTypeResult.userResponses.map((response, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-[#A10550] text-white flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium mb-2">{response.questionText}</p>
                            <div className="bg-pink-50 p-3 rounded-lg mb-2">
                              <p className="text-gray-700">
                                Your Answer: <span className="text-[#A10550] font-medium">{response.answerText}</span>
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-1 bg-pink-100 text-[#A10550] rounded-full">
                                Score: {response.score}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                Skin Type: {response.skinType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-600">No response data available.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 border-2 border-[#A10550] text-[#A10550] rounded-lg hover:bg-pink-50 transition-colors duration-300 font-medium flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
            </svg>
            View Services
          </Link>
          <Link
            to="/quiz"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MySkinType;