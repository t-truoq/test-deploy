// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import ServiceCard from "./components/ServiceCard/ServiceCard";
// import ServiceSearch from "./components/ServiceSearch";
// import BookingSummaryPanel from "./components/ServiceCard/BookingSummaryPanel";

// // Login Required Modal Component (inline)
// const LoginRequiredModal = ({ isOpen, onClose, onLogin, action }) => {
//   if (!isOpen) return null;

//   const getActionText = () => {
//     switch (action) {
//       case "booking":
//         return "book services";
//       case "detail":
//         return "view service details";
//       case "wishlist":
//         return "add to wishlist";
//       default:
//         return "continue";
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
//         <div className="text-center">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 mb-4">
//             <svg
//               className="h-6 w-6 text-pink-600"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
//           <p className="text-sm text-gray-600 mb-6">
//             You need to be logged in to {getActionText()}. Would you like to login now?
//           </p>
//           <div className="flex justify-center space-x-4">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onLogin}
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-700 hover:bg-pink-800 focus:outline-none"
//             >
//               Login Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ServiceList = () => {
//   const navigate = useNavigate();
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [recommendedServices, setRecommendedServices] = useState([]);
//   const [allServices, setAllServices] = useState([]);
//   const [filteredRecommendedServices, setFilteredRecommendedServices] = useState([]);
//   const [filteredAllServices, setFilteredAllServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [wishlist, setWishlist] = useState([]);
//   const [bookingError, setBookingError] = useState("");
//   const [bookingSuccess, setBookingSuccess] = useState("");
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [redirectAction, setRedirectAction] = useState("");
//   const [serviceForDetail, setServiceForDetail] = useState(null);
//   const [skinTypeResult, setSkinTypeResult] = useState(null);
//   const [hasFetched, setHasFetched] = useState(false);

//   // Check if user is logged in
//   const isLoggedIn = useCallback(() => {
//     return !!localStorage.getItem("token");
//   }, []);

//   // Redirect to login page
//   const redirectToLogin = () => {
//     if (redirectAction === "detail" && serviceForDetail) {
//       localStorage.setItem(
//         "redirectAfterLogin",
//         JSON.stringify({
//           action: "detail",
//           serviceId: serviceForDetail.serviceId,
//         }),
//       );
//     } else if (redirectAction === "booking") {
//       localStorage.setItem(
//         "redirectAfterLogin",
//         JSON.stringify({
//           action: "booking",
//           selectedServices: selectedServices.map((s) => s.serviceId),
//         }),
//       );
//     }

//     navigate("/login");
//   };

//   // Handle login required action
//   const handleLoginRequired = (action, service = null) => {
//     setRedirectAction(action);
//     if (service) {
//       setServiceForDetail(service);
//     }
//     setShowLoginModal(true);
//   };

//   // Lấy kết quả từ localStorage khi component mount
//   useEffect(() => {
//     const result = localStorage.getItem("skinTypeResult");
//     if (result) {
//       setSkinTypeResult(JSON.parse(result));
//     }
//   }, []);

//   // Hàm chọn/xóa dịch vụ khỏi danh sách "Booked"
//   const handleSelect = (service) => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("booking");
//       return;
//     }

//     const serviceWithDuration = {
//       ...service,
//       duration: service.duration,
//     };

//     setSelectedServices((prev) => {
//       const updatedServices = prev.some((s) => s.serviceId === service.serviceId)
//         ? prev.filter((s) => s.serviceId !== service.serviceId)
//         : [...prev, serviceWithDuration];

//       localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices));
//       return updatedServices;
//     });
//   };

//   // Handle removing a service from the selected list
//   const handleRemoveService = (serviceId) => {
//     setSelectedServices((prev) => {
//       const updatedServices = prev.filter((s) => s.serviceId !== serviceId);
//       if (updatedServices.length === 0) {
//         localStorage.removeItem("selectedServicesForBooking");
//       } else {
//         localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices));
//       }
//       return updatedServices;
//     });
//   };

//   // Handle clear all services
//   const handleClearAllServices = () => {
//     setSelectedServices([]);
//     localStorage.removeItem("selectedServicesForBooking");
//   };

//   // Handle view service details
//   const handleViewDetails = (service) => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("detail", service);
//       return;
//     }

//     navigate(`/services/${service.serviceId}`);
//   };

//   // Hàm thêm/xóa dịch vụ vào wishlist (lưu vào cookie)
//   const handleAddToWishlist = (service) => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("wishlist");
//       return;
//     }

//     let updatedWishlist = [...wishlist];
//     const isInWishlist = updatedWishlist.some((item) => item.serviceId === service.serviceId);

//     if (isInWishlist) {
//       updatedWishlist = updatedWishlist.filter((item) => item.serviceId !== service.serviceId);
//     } else {
//       updatedWishlist.push(service);
//     }

//     Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
//     setWishlist(updatedWishlist);
//   };

//   // Hàm tìm kiếm dịch vụ
//   const handleSearch = (searchTerm) => {
//     if (!searchTerm.trim()) {
//       setFilteredRecommendedServices(recommendedServices);
//       setFilteredAllServices(allServices);
//       return;
//     }

//     const filteredRecommended = recommendedServices.filter(
//       (service) =>
//         service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
//     );

//     const filteredAll = allServices.filter(
//       (service) =>
//         service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         service.description?.toLowerCase().includes(searchTerm.toLowerCase()),
//     );

//     setFilteredRecommendedServices(filteredRecommended);
//     setFilteredAllServices(filteredAll);
//   };

//   // Hàm gọi API để tạo booking
//   const handleBookServices = async () => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("booking");
//       return;
//     }

//     if (selectedServices.length === 0) {
//       setBookingError("Please select at least one service to book.");
//       return;
//     }

//     try {
//       localStorage.setItem("selectedServicesForBooking", JSON.stringify(selectedServices));
//       setBookingSuccess("Proceeding to booking page...");
//       setBookingError("");

//       navigate("/mybooking");

//       setTimeout(() => {
//         setSelectedServices([]);
//         localStorage.removeItem("selectedServicesForBooking");
//       }, 1000);
//     } catch (error) {
//       console.error("Error preparing booking:", error);
//       setBookingError("Failed to prepare booking. Please try again.");
//     }
//   };

//   // Lấy danh sách dịch vụ từ API
//   useEffect(() => {
//     if (hasFetched) return;

//     const savedWishlist = Cookies.get("wishlist");
//     if (savedWishlist) {
//       try {
//         const parsedWishlist = JSON.parse(savedWishlist);
//         if (Array.isArray(parsedWishlist)) {
//           setWishlist(parsedWishlist);
//         } else {
//           setWishlist([]);
//         }
//       } catch (error) {
//         console.error("Error parsing wishlist from cookie:", error);
//         setWishlist([]);
//       }
//     }

//     const fetchRecommendedServices = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No token found. Please login again.");
//         }

//         const response = await axios.get(
//           "https://b64a-118-69-182-149.ngrok-free.app/api/quiz/recommended-services",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           },
//         );

//         console.log("Recommended services data:", response.data);
//         if (Array.isArray(response.data)) {
//           setRecommendedServices(response.data);
//           setFilteredRecommendedServices(response.data);
//         } else {
//           throw new Error("Recommended services data is not an array");
//         }
//       } catch (error) {
//         console.error("Error fetching recommended services:", error);
//         if (error.response) {
//           if (error.response.status === 401) {
//             setError("Unauthorized: Please login again.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 2000);
//           } else if (error.response.status === 400 || error.response.status === 404) {
//             setError("No recommended services found. Please complete the skin type quiz to see recommended services.");
//           } else {
//             setError(error.response.data.message || "Failed to load recommended services. Please try again.");
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. Please try again.");
//         } else {
//           setError(error.message || "Failed to load recommended services. Please try again.");
//         }
//       }
//     };

//     const fetchAllServices = async () => {
//       try {
//         const response = await axios.get("https://b64a-118-69-182-149.ngrok-free.app/api/services", {
//           headers: {
//             "ngrok-skip-browser-warning": "true",
//           },
//         });

//         console.log("All services data:", response.data);
//         if (Array.isArray(response.data)) {
//           setAllServices(response.data);
//           setFilteredAllServices(response.data);
//         } else {
//           throw new Error("All services data is not an array");
//         }
//       } catch (error) {
//         console.error("Error fetching all services:", error);
//         if (error.response) {
//           if (error.response.status === 404) {
//             setError("No services found.");
//           } else {
//             setError(error.response.data.message || "Failed to load services. Please try again.");
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. Please try again.");
//         } else {
//           setError(error.message || "Failed to load services. Please try again.");
//         }
//       }
//     };

//     Promise.all([fetchRecommendedServices(), fetchAllServices()]).finally(() => {
//       setLoading(false);
//       setHasFetched(true);
//     });
//   }, [navigate, hasFetched, isLoggedIn]);

//   // Gọi lại API nếu skinTypeResult thay đổi (người dùng làm lại quiz)
//   useEffect(() => {
//     if (!skinTypeResult || hasFetched) return;

//     const fetchRecommendedServices = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No token found. Please login again.");
//         }

//         const response = await axios.get(
//           "https://b64a-118-69-182-149.ngrok-free.app/api/quiz/recommended-services",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           },
//         );

//         console.log("Recommended services data:", response.data);
//         if (Array.isArray(response.data)) {
//           setRecommendedServices(response.data);
//           setFilteredRecommendedServices(response.data);
//         } else {
//           throw new Error("Recommended services data is not an array");
//         }
//       } catch (error) {
//         console.error("Error fetching recommended services:", error);
//         if (error.response) {
//           if (error.response.status === 401) {
//             setError("Unauthorized: Please login again.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 2000);
//           } else if (error.response.status === 400 || error.response.status === 404) {
//             setError("No recommended services found. Please complete the skin type quiz to see recommended services.");
//           } else {
//             setError(error.response.data.message || "Failed to load recommended services. Please try again.");
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. Please try again.");
//         } else {
//           setError(error.message || "Failed to load recommended services. Please try again.");
//         }
//       }
//     };

//     fetchRecommendedServices();
//   }, [skinTypeResult, navigate, hasFetched]);

//   // Load selected services from localStorage when component mounts
//   useEffect(() => {
//     const storedServices = localStorage.getItem("selectedServicesForBooking");
//     if (storedServices) {
//       try {
//         const parsedServices = JSON.parse(storedServices);
//         if (Array.isArray(parsedServices) && parsedServices.length > 0) {
//           setSelectedServices(parsedServices);
//           setTimeout(() => {
//             const bookingPanel = document.getElementById("booking-summary-panel");
//             if (bookingPanel) {
//               bookingPanel.scrollIntoView({ behavior: "smooth" });
//             }
//           }, 500);
//         }
//       } catch (error) {
//         console.error("Error parsing stored services:", error);
//       }
//     }
//   }, []);

//   // Check for redirect after login
//   useEffect(() => {
//     const redirectInfo = localStorage.getItem("redirectAfterLogin");
//     if (redirectInfo && isLoggedIn()) {
//       try {
//         const { action, serviceId, selectedServices: savedServices } = JSON.parse(redirectInfo);

//         if (action === "detail" && serviceId) {
//           navigate(`/services/${serviceId}`);
//         } else if (action === "booking" && savedServices && savedServices.length > 0) {
//           const servicesToSelect = allServices.filter((s) => savedServices.includes(s.serviceId));
//           if (servicesToSelect.length > 0) {
//             setSelectedServices(servicesToSelect);
//             localStorage.setItem("selectedServicesForBooking", JSON.stringify(servicesToSelect));
//           }
//         }

//         localStorage.removeItem("redirectAfterLogin");
//       } catch (error) {
//         console.error("Error processing redirect after login:", error);
//       }
//     }
//   }, [allServices, isLoggedIn, navigate]);

//   if (loading) {
//     return <div className="text-center py-8 text-gray-600">Loading services...</div>;
//   }

//   if (error && !allServices.length) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
//           <div className="w-16 h-16 mx-auto mb-4 text-gray-500">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//               />
//             </svg>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <Link
//             to="/quiz"
//             className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium"
//           >
//             Take the Skin Type Quiz
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       <div className="flex justify-between items-center py-4">
//         <nav>
//           <ol className="flex items-center space-x-2">
//             <li>
//               <Link to="/" className="text-gray-800 hover:text-[#A10550]">
//                 Home
//               </Link>
//             </li>
//             <li className="text-gray-500">/</li>
//             <li className="text-[#A10550]">Services</li>
//           </ol>
//         </nav>
//         <div className="w-64">
//           <ServiceSearch onSearch={handleSearch} />
//         </div>
//       </div>

//       {/* Thông báo booking */}
//       {bookingError && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{bookingError}</div>}
//       {bookingSuccess && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{bookingSuccess}</div>}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main content - Services */}
//         <div className="lg:col-span-2">
//           {/* Phần Recommended Services */}
//           <div className="mb-12">
//             <h2 className="text-3xl font-bold mb-8 text-gray-800">Recommended Services for Your Skin Type</h2>
//             {error ? (
//               <div className="text-center py-8 text-gray-600">
//                 {error}
//                 <Link
//                   to="/quiz"
//                   className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium ml-2"
//                 >
//                   Take the Skin Type Quiz
//                 </Link>
//               </div>
//             ) : recommendedServices.length === 0 ? (
//               <div className="text-center py-8 text-gray-600">
//                 No recommended services available. Please complete the skin type quiz to see recommendations.
//                 <Link
//                   to="/quiz"
//                   className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium ml-2"
//                 >
//                   Take the Quiz
//                 </Link>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {filteredRecommendedServices.map((service) => (
//                   <ServiceCard
//                     key={`recommended-${service.serviceId}`}
//                     service={service}
//                     onSelect={handleSelect}
//                     onViewDetails={() => handleViewDetails(service)}
//                     isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
//                     onAddToWishlist={handleAddToWishlist}
//                     isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
//                     variant="recommended"
//                     className="h-72"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Phần All Services */}
//           <div className="mb-12">
//             <h2 className="text-3xl font-bold mb-8 text-gray-800">All Services</h2>
//             {filteredAllServices.length === 0 ? (
//               <div className="text-center py-8 text-gray-600">No services available at the moment.</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {filteredAllServices.map((service) => (
//                   <ServiceCard
//                     key={`all-${service.serviceId}`}
//                     service={service}
//                     onSelect={handleSelect}
//                     onViewDetails={() => handleViewDetails(service)}
//                     isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
//                     onAddToWishlist={handleAddToWishlist}
//                     isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
//                     variant="all"
//                     className="h-64"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar - Booking Summary */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-4">
//             <BookingSummaryPanel
//               id="booking-summary-panel"
//               selectedServices={selectedServices}
//               onRemoveService={handleRemoveService}
//               onBookServices={handleBookServices}
//               onClearAllServices={handleClearAllServices}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Login Required Modal */}
//       <LoginRequiredModal
//         isOpen={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         onLogin={redirectToLogin}
//         action={redirectAction}
//       />
//     </div>
//   );
// };

// export default ServiceList;
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ServiceCard from "./components/ServiceCard/ServiceCard";
import ServiceSearch from "./components/ServiceSearch";
import BookingSummaryPanel from "./components/ServiceCard/BookingSummaryPanel";

// Login Required Modal Component (giữ nguyên)
const LoginRequiredModal = ({ isOpen, onClose, onLogin, action }) => {
  if (!isOpen) return null;

  const getActionText = () => {
    switch (action) {
      case "booking":
        return "book services";
      case "detail":
        return "view service details";
      case "wishlist":
        return "add to wishlist";
      default:
        return "continue";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 mb-4">
            <svg
              className="h-6 w-6 text-pink-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            You need to be logged in to {getActionText()}. Would you like to
            login now?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={onLogin}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-700 hover:bg-pink-800 focus:outline-none"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceList = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [recommendedServices, setRecommendedServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [filteredRecommendedServices, setFilteredRecommendedServices] =
    useState([]);
  const [filteredAllServices, setFilteredAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectAction, setRedirectAction] = useState("");
  const [serviceForDetail, setServiceForDetail] = useState(null);
  const [skinTypeResult, setSkinTypeResult] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Check if user is logged in
  const isLoggedIn = useCallback(() => {
    return !!localStorage.getItem("token");
  }, []);

  // Redirect to login page
  const redirectToLogin = () => {
    if (redirectAction === "detail" && serviceForDetail) {
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          action: "detail",
          serviceId: serviceForDetail.serviceId,
        })
      );
    } else if (redirectAction === "booking") {
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          action: "booking",
          selectedServices: selectedServices.map((s) => s.serviceId),
        })
      );
    }

    navigate("/login");
  };

  // Handle login required action
  const handleLoginRequired = (action, service = null) => {
    setRedirectAction(action);
    if (service) {
      setServiceForDetail(service);
    }
    setShowLoginModal(true);
  };

  // Lấy kết quả từ localStorage khi component mount
  useEffect(() => {
    const result = localStorage.getItem("skinTypeResult");
    if (result) {
      setSkinTypeResult(JSON.parse(result));
    }
  }, []);

  // Hàm chọn/xóa dịch vụ khỏi danh sách "Booked"
  const handleSelect = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("booking");
      return;
    }

    const serviceWithDuration = {
      ...service,
      duration: service.duration,
    };

    setSelectedServices((prev) => {
      const updatedServices = prev.some(
        (s) => s.serviceId === service.serviceId
      )
        ? prev.filter((s) => s.serviceId !== service.serviceId)
        : [...prev, serviceWithDuration];

      localStorage.setItem(
        "selectedServicesForBooking",
        JSON.stringify(updatedServices)
      );
      return updatedServices;
    });
  };

  // Handle removing a service from the selected list
  const handleRemoveService = (serviceId) => {
    setSelectedServices((prev) => {
      const updatedServices = prev.filter((s) => s.serviceId !== serviceId);
      if (updatedServices.length === 0) {
        localStorage.removeItem("selectedServicesForBooking");
      } else {
        localStorage.setItem(
          "selectedServicesForBooking",
          JSON.stringify(updatedServices)
        );
      }
      return updatedServices;
    });
  };

  // Handle clear all services
  const handleClearAllServices = () => {
    setSelectedServices([]);
    localStorage.removeItem("selectedServicesForBooking");
  };

  // Handle view service details
  const handleViewDetails = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("detail", service);
      return;
    }

    navigate(`/services/${service.serviceId}`);
  };

  // Hàm thêm/xóa dịch vụ vào wishlist (lưu vào cookie)
  const handleAddToWishlist = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("wishlist");
      return;
    }

    let updatedWishlist = [...wishlist];
    const isInWishlist = updatedWishlist.some(
      (item) => item.serviceId === service.serviceId
    );

    if (isInWishlist) {
      updatedWishlist = updatedWishlist.filter(
        (item) => item.serviceId !== service.serviceId
      );
    } else {
      updatedWishlist.push(service);
    }

    Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
    setWishlist(updatedWishlist);
  };

  // Hàm tìm kiếm dịch vụ
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredRecommendedServices(recommendedServices);
      setFilteredAllServices(allServices);
      return;
    }

    const filteredRecommended = recommendedServices.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAll = allServices.filter(
      (service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRecommendedServices(filteredRecommended);
    setFilteredAllServices(filteredAll);
  };

  // Hàm gọi để lưu vào localStorage và chuyển hướng đến MyBooking
  const handleBookServices = () => {
    if (!isLoggedIn()) {
      handleLoginRequired("booking");
      return;
    }

    if (selectedServices.length === 0) {
      setBookingError("Please select at least one service to book.");
      return;
    }

    try {
      // Lưu danh sách serviceId vào localStorage
      const selectedServiceIds = selectedServices.map(
        (service) => service.serviceId
      );
      console.log(
        "Saving selectedServiceIds to localStorage:",
        selectedServiceIds
      ); // Thêm log để kiểm tra
      localStorage.setItem(
        "selectedServiceIdsForBooking",
        JSON.stringify(selectedServiceIds)
      );
      setBookingSuccess("Proceeding to booking confirmation...");
      setBookingError("");

      // Chuyển hướng sang MyBooking
      navigate("/mybooking");

      // Sau khi chuyển hướng, xóa selectedServices để tránh lặp lại
      setTimeout(() => {
        setSelectedServices([]);
        localStorage.removeItem("selectedServicesForBooking"); // Xóa tạm nếu có
      }, 1000);
    } catch (error) {
      console.error("Error preparing booking:", error);
      setBookingError("Failed to prepare booking. Please try again.");
    }
  };

  // Lấy danh sách dịch vụ từ API
  useEffect(() => {
    if (hasFetched) return;

    const savedWishlist = Cookies.get("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error parsing wishlist from cookie:", error);
        setWishlist([]);
      }
    }

    const fetchRecommendedServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(
          "https://b64a-118-69-182-149.ngrok-free.app/api/quiz/recommended-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Recommended services data:", response.data);
        if (Array.isArray(response.data)) {
          setRecommendedServices(response.data);
          setFilteredRecommendedServices(response.data);
        } else {
          throw new Error("Recommended services data is not an array");
        }
      } catch (error) {
        console.error("Error fetching recommended services:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else if (
            error.response.status === 400 ||
            error.response.status === 404
          ) {
            setError(
              "No recommended services found. Please complete the skin type quiz to see recommended services."
            );
          } else {
            setError(
              error.response.data.message ||
                "Failed to load recommended services. Please try again."
            );
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(
            error.message ||
              "Failed to load recommended services. Please try again."
          );
        }
      }
    };

    const fetchAllServices = async () => {
      try {
        const response = await axios.get(
          "https://b64a-118-69-182-149.ngrok-free.app/api/services",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const response = await axios.get("https://b64a-118-69-182-149.ngrok-free.app/api/services", {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        console.log("All services data:", response.data);
        if (Array.isArray(response.data)) {
          setAllServices(response.data);
          setFilteredAllServices(response.data);
        } else {
          throw new Error("All services data is not an array");
        }
      } catch (error) {
        console.error("Error fetching all services:", error);
        if (error.response) {
          if (error.response.status === 404) {
            setError("No services found.");
          } else {
            setError(
              error.response.data.message ||
                "Failed to load services. Please try again."
            );
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(
            error.message || "Failed to load services. Please try again."
          );
        }
      }
    };

    Promise.all([fetchRecommendedServices(), fetchAllServices()]).finally(
      () => {
        setLoading(false);
        setHasFetched(true);
      }
    );
  }, [navigate, hasFetched, isLoggedIn]);

  // Gọi lại API nếu skinTypeResult thay đổi (người dùng làm lại quiz)
  useEffect(() => {
    if (!skinTypeResult || hasFetched) return;

    const fetchRecommendedServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(
          "https://b64a-118-69-182-149.ngrok-free.app/api/quiz/recommended-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Recommended services data:", response.data);
        if (Array.isArray(response.data)) {
          setRecommendedServices(response.data);
          setFilteredRecommendedServices(response.data);
        } else {
          throw new Error("Recommended services data is not an array");
        }
      } catch (error) {
        console.error("Error fetching recommended services:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else if (
            error.response.status === 400 ||
            error.response.status === 404
          ) {
            setError(
              "No recommended services found. Please complete the skin type quiz to see recommended services."
            );
          } else {
            setError(
              error.response.data.message ||
                "Failed to load recommended services. Please try again."
            );
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(
            error.message ||
              "Failed to load recommended services. Please try again."
          );
        }
      }
    };

    fetchRecommendedServices();
  }, [skinTypeResult, navigate, hasFetched]);

  // Load selected services from localStorage when component mounts
  useEffect(() => {
    const storedServices = localStorage.getItem("selectedServicesForBooking");
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices);
          setTimeout(() => {
            const bookingPanel = document.getElementById(
              "booking-summary-panel"
            );
            if (bookingPanel) {
              bookingPanel.scrollIntoView({ behavior: "smooth" });
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing stored services:", error);
      }
    }
  }, []);

  // Check for redirect after login
  useEffect(() => {
    const redirectInfo = localStorage.getItem("redirectAfterLogin");
    if (redirectInfo && isLoggedIn()) {
      try {
        const {
          action,
          serviceId,
          selectedServices: savedServices,
        } = JSON.parse(redirectInfo);

        if (action === "detail" && serviceId) {
          navigate(`/services/${serviceId}`);
        } else if (
          action === "booking" &&
          savedServices &&
          savedServices.length > 0
        ) {
          const servicesToSelect = allServices.filter((s) =>
            savedServices.includes(s.serviceId)
          );
          if (servicesToSelect.length > 0) {
            setSelectedServices(servicesToSelect);
            localStorage.setItem(
              "selectedServicesForBooking",
              JSON.stringify(servicesToSelect)
            );
          }
        }

        localStorage.removeItem("redirectAfterLogin");
      } catch (error) {
        console.error("Error processing redirect after login:", error);
      }
    }
  }, [allServices, isLoggedIn, navigate]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading services...</div>
    );
  }

  if (error && !allServices.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/quiz"
            className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium"
          >
            Take the Skin Type Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <nav>
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-800 hover:text-[#A10550]">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-[#A10550]">Services</li>
          </ol>
        </nav>
        <div className="w-64">
          <ServiceSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Thông báo booking */}
      {bookingError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {bookingError}
        </div>
      )}
      {bookingSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {bookingSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Services */}
        <div className="lg:col-span-2">
          {/* Phần Recommended Services */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Recommended Services for Your Skin Type
            </h2>
            {error ? (
              <div className="text-center py-8 text-gray-600">
                {error}
                <Link
                  to="/quiz"
                  className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium ml-2"
                >
                  Take the Skin Type Quiz
                </Link>
              </div>
            ) : recommendedServices.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No recommended services available. Please complete the skin type
                quiz to see recommendations.
                <Link
                  to="/quiz"
                  className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium ml-2"
                >
                  Take the Quiz
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommendedServices.map((service) => (
                  <ServiceCard
                    key={`recommended-${service.serviceId}`}
                    service={service}
                    onSelect={handleSelect}
                    onViewDetails={() => handleViewDetails(service)}
                    isSelected={selectedServices.some(
                      (s) => s.serviceId === service.serviceId
                    )}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.some(
                      (item) => item.serviceId === service.serviceId
                    )}
                    variant="recommended"
                    className="h-72"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Phần All Services */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              All Services
            </h2>
            {filteredAllServices.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No services available at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAllServices.map((service) => (
                  <ServiceCard
                    key={`all-${service.serviceId}`}
                    service={service}
                    onSelect={handleSelect}
                    onViewDetails={() => handleViewDetails(service)}
                    isSelected={selectedServices.some(
                      (s) => s.serviceId === service.serviceId
                    )}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.some(
                      (item) => item.serviceId === service.serviceId
                    )}
                    variant="all"
                    className="h-64"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BookingSummaryPanel
              id="booking-summary-panel"
              selectedServices={selectedServices}
              onRemoveService={handleRemoveService}
              onBookServices={handleBookServices}
              onClearAllServices={handleClearAllServices}
            />
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={redirectToLogin}
        action={redirectAction}
      />
    </div>
  );
};

export default ServiceList;
