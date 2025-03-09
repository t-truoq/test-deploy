// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import ServiceCard from "./components/ServiceCard/ServiceCard";
// import ServiceSearch from "./components/ServiceSearch";
// import BookingSummaryPanel from "./components/ServiceCard/BookingSummaryPanel";

// // Login Required Modal Component
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
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//       <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
//         <div className="text-center">
//           <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-pink-50 mb-6">
//             <svg
//               className="h-8 w-8 text-[#A10550]"
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

//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             Login Required
//           </h3>
//           <p className="text-sm text-gray-600 mb-6">
//             You need to be logged in to {getActionText()}. Would you like to
//             login now?

//           <h3 className="text-2xl font-serif font-medium text-gray-900 mb-3">Login Required</h3>
//           <p className="text-gray-600 mb-8">
//             You need to be logged in to {getActionText()}. Would you like to login now?

//           </p>
//           <div className="flex justify-center space-x-4">
//             <button
//               onClick={onClose}
//               className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onLogin}
//               className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#A10550] hover:bg-[#800440] transition-colors"
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
//   const [filteredRecommendedServices, setFilteredRecommendedServices] =
//     useState([]);
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
//         })
//       );
//     } else if (redirectAction === "booking") {
//       localStorage.setItem(
//         "redirectAfterLogin",
//         JSON.stringify({
//           action: "booking",
//           selectedServices: selectedServices.map((s) => s.serviceId),
//         })
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

//   // Load skin type result from localStorage when component mounts
//   useEffect(() => {
//     const result = localStorage.getItem("skinTypeResult");
//     if (result) {
//       setSkinTypeResult(JSON.parse(result));
//     }
//   }, []);

//   // Handle selecting/removing services
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
//       const updatedServices = prev.some(
//         (s) => s.serviceId === service.serviceId
//       )
//         ? prev.filter((s) => s.serviceId !== service.serviceId)
//         : [...prev, serviceWithDuration];


//       localStorage.setItem(
//         "selectedServicesForBooking",
//         JSON.stringify(updatedServices)
//       );

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
//         localStorage.setItem(
//           "selectedServicesForBooking",
//           JSON.stringify(updatedServices)
//         );
//       }
//       return updatedServices;
//     });
//   };

//   // Handle clearing all services
//   const handleClearAllServices = () => {
//     setSelectedServices([]);
//     localStorage.removeItem("selectedServicesForBooking");
//   };

//   // Handle viewing service details
//   const handleViewDetails = (service) => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("detail", service);
//       return;
//     }
//     navigate(`/services/${service.serviceId}`);
//   };

//   // Handle adding/removing services to/from wishlist
//   const handleAddToWishlist = (service) => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("wishlist");
//       return;
//     }

//     let updatedWishlist = [...wishlist];
//     const isInWishlist = updatedWishlist.some(
//       (item) => item.serviceId === service.serviceId
//     );

//     if (isInWishlist) {
//       updatedWishlist = updatedWishlist.filter(
//         (item) => item.serviceId !== service.serviceId
//       );
//     } else {
//       updatedWishlist.push(service);
//     }

//     Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
//     setWishlist(updatedWishlist);
//   };

//   // Handle searching services
//   const handleSearch = (searchTerm) => {
//     if (!searchTerm.trim()) {
//       setFilteredRecommendedServices(recommendedServices);
//       setFilteredAllServices(allServices);
//       return;
//     }

//     const filteredRecommended = recommendedServices.filter(
//       (service) =>
//         service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredAll = allServices.filter(
//       (service) =>
//         service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     setFilteredRecommendedServices(filteredRecommended);
//     setFilteredAllServices(filteredAll);
//   };

//   // Handle booking services
//   const handleBookServices = () => {
//     if (!isLoggedIn()) {
//       handleLoginRequired("booking");
//       return;
//     }

//     if (selectedServices.length === 0) {
//       setBookingError("Please select at least one service to book.");
//       return;
//     }

//     try {

//       // Lưu danh sách serviceId vào localStorage
//       const selectedServiceIds = selectedServices.map(
//         (service) => service.serviceId
//       );
//       console.log(
//         "Saving selectedServiceIds to localStorage:",
//         selectedServiceIds
//       ); // Thêm log để kiểm tra
//       localStorage.setItem(
//         "selectedServiceIdsForBooking",
//         JSON.stringify(selectedServiceIds)
//       );

//       const selectedServiceIds = selectedServices.map((service) => service.serviceId);
//       localStorage.setItem("selectedServiceIdsForBooking", JSON.stringify(selectedServiceIds));

//       setBookingSuccess("Proceeding to booking confirmation...");
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

//   // Fetch services from API
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
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/quiz/recommended-services",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
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
//           } else if (
//             error.response.status === 400 ||
//             error.response.status === 404
//           ) {
//             setError(
//               "No recommended services found. Please complete the skin type quiz to see recommended services."
//             );
//           } else {
//             setError(
//               error.response.data.message ||
//                 "Failed to load recommended services. Please try again."
//             );
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. Please try again.");
//         } else {
//           setError(
//             error.message ||
//               "Failed to load recommended services. Please try again."
//           );

//         if (error.response?.status === 401) {
//           setError("Unauthorized: Please login again.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else if (error.response?.status === 400 || error.response?.status === 404) {
//           setError("No recommended services found. Please complete the skin type quiz.");
//         } else {
//           setError(error.response?.data.message || "Failed to load recommended services.");

//         }
//       }
//     };

//     const fetchAllServices = async () => {
//       try {
//         const response = await axios.get(
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/services",
//           {

//             headers: {
//               "ngrok-skip-browser-warning": "true",
//             },

//             headers: { "ngrok-skip-browser-warning": "true" },

//           }
//         );

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
//             setError(
//               error.response.data.message ||
//                 "Failed to load services. Please try again."
//             );
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. Please try again.");
//         } else {
//           setError(
//             error.message || "Failed to load services. Please try again."
//           );
//         }

//         setError(error.response?.data.message || "Failed to load services.");

//       }
//     };

//     Promise.all([fetchRecommendedServices(), fetchAllServices()]).finally(
//       () => {
//         setLoading(false);
//         setHasFetched(true);
//       }
//     );
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
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/quiz/recommended-services",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
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
//           } else if (
//             error.response.status === 400 ||
//             error.response.status === 404
//           ) {
//             setError(
//               "No recommended services found. Please complete the skin type quiz to see recommended services."
//             );
//           } else {
//             setError(
//               error.response.data.message ||
//                 "Failed to load recommended services. Please try again."
//             );
//           }
//         } else if (error.request) {
//           setError("Unable to connect to server. Please try again.");
//         } else {
//           setError(
//             error.message ||
//               "Failed to load recommended services. Please try again."
//           );
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

//             const bookingPanel = document.getElementById(
//               "booking-summary-panel"
//             );
//             if (bookingPanel) {
//               bookingPanel.scrollIntoView({ behavior: "smooth" });
//             }

//             const bookingPanel = document.getElementById("booking-summary-panel");
//             if (bookingPanel) bookingPanel.scrollIntoView({ behavior: "smooth" });

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

//         const {
//           action,
//           serviceId,
//           selectedServices: savedServices,
//         } = JSON.parse(redirectInfo);

//         if (action === "detail" && serviceId) {
//           navigate(`/services/${serviceId}`);
//         } else if (
//           action === "booking" &&
//           savedServices &&
//           savedServices.length > 0
//         ) {
//           const servicesToSelect = allServices.filter((s) =>
//             savedServices.includes(s.serviceId)
//           );

//         const { action, serviceId, selectedServices: savedServices } = JSON.parse(redirectInfo);
//         if (action === "detail" && serviceId) {
//           navigate(`/services/${serviceId}`);
//         } else if (action === "booking" && savedServices?.length > 0) {
//           const servicesToSelect = allServices.filter((s) => savedServices.includes(s.serviceId));

//           if (servicesToSelect.length > 0) {
//             setSelectedServices(servicesToSelect);
//             localStorage.setItem(
//               "selectedServicesForBooking",
//               JSON.stringify(servicesToSelect)
//             );
//           }
//         }
//         localStorage.removeItem("redirectAfterLogin");
//       } catch (error) {
//         console.error("Error processing redirect after login:", error);
//       }
//     }
//   }, [allServices, isLoggedIn, navigate]);

//   // Monitor login status and clear services on logout
//   useEffect(() => {
//     if (!isLoggedIn() && selectedServices.length > 0) {
//       handleClearAllServices();
//     }
//   }, [isLoggedIn, selectedServices.length]);

//   if (loading) {
//     return (

//       <div className="text-center py-8 text-gray-600">Loading services...</div>

//       <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-[#A10550] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading luxury services...</p>
//         </div>
//       </div>

//     );
//   }

//   if (error && !allServices.length) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">

//         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
//           <div className="w-16 h-16 mx-auto mb-4 text-gray-500">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >

//         <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100">
//           <div className="w-20 h-20 mx-auto mb-6 text-gray-500">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">

//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//               />
//             </svg>
//           </div>
//           <p className="text-gray-600 mb-8 text-lg">{error}</p>
//           <Link
//             to="/quiz"
//             className="inline-block px-8 py-4 bg-gradient-to-r from-[#A10550] to-[#800440] text-white rounded-lg hover:from-[#800440] hover:to-[#A10550] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//           >
//             Take the Skin Type Quiz
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[1920px] mx-auto px-6 lg:px-8 bg-white">
//       {/* Elegant header with gold accents */}
//       <div className="py-12 text-center border-b border-gray-100">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//           Our <span className="text-[#A10550]">Luxury</span> Services
//         </h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           Indulge in our premium beauty treatments designed to enhance your natural beauty and provide a truly luxurious
//           experience.
//         </p>
//       </div>

//       <div className="flex justify-between items-center py-8">
//         <nav>
//           <ol className="flex items-center space-x-3 text-lg">
//             <li>
//               <Link to="/" className="text-gray-800 hover:text-[#A10550] transition-colors">
//                 Home
//               </Link>
//             </li>
//             <li className="text-gray-500">/</li>
//             <li className="text-[#A10550] font-medium">Services</li>
//           </ol>
//         </nav>
//         <div className="w-96">
//           <ServiceSearch onSearch={handleSearch} />
//         </div>
//       </div>


//       {/* Thông báo booking */}
//       {bookingError && (
//         <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">

//       {/* Notification messages */}
//       {bookingError && (
//         <div className="mb-10 p-6 bg-red-50 text-red-700 rounded-xl text-lg border border-red-100 shadow-sm">

//           {bookingError}
//         </div>
//       )}
//       {bookingSuccess && (

//         <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">

//         <div className="mb-10 p-6 bg-green-50 text-green-700 rounded-xl text-lg border border-green-100 shadow-sm">

//           {bookingSuccess}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 py-8">
//         {/* Main content - Services */}
//         <div className="lg:col-span-2">

//           {/* Phần Recommended Services */}
//           <div className="mb-12">
//             <h2 className="text-3xl font-bold mb-8 text-gray-800">
//               Recommended Services for Your Skin Type
//             </h2>

//           {/* Recommended Services Section */}
//           <div className="mb-20">
//             <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-12 text-gray-800 relative inline-block">
//               Recommended For You
//               <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-[#A10550]"></span>
//             </h2>


//             {error ? (
//               <div className="text-center py-12 bg-gray-50 rounded-xl">
//                 <p className="text-xl text-gray-600 mb-6">{error}</p>
//                 <Link
//                   to="/quiz"
//                   className="inline-block px-8 py-4 bg-[#A10550] text-white rounded-lg hover:bg-[#800440] transition-colors duration-300 font-medium"
//                 >
//                   Take the Skin Type Quiz
//                 </Link>
//               </div>
//             ) : recommendedServices.length === 0 ? (

//               <div className="text-center py-8 text-gray-600">
//                 No recommended services available. Please complete the skin type
//                 quiz to see recommendations.

//               <div className="text-center py-12 bg-gray-50 rounded-xl">
//                 <p className="text-xl text-gray-600 mb-6">
//                   No recommended services available. Please complete the skin type quiz to see personalized
//                   recommendations.
//                 </p>

//                 <Link
//                   to="/quiz"
//                   className="inline-block px-8 py-4 bg-[#A10550] text-white rounded-lg hover:bg-[#800440] transition-colors duration-300 font-medium"
//                 >
//                   Take the Quiz
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-10">
//                 {filteredRecommendedServices.map((service) => (
//                   <ServiceCard
//                     key={`recommended-${service.serviceId}`}
//                     service={service}
//                     onSelect={handleSelect}
//                     onViewDetails={() => handleViewDetails(service)}
//                     isSelected={selectedServices.some(
//                       (s) => s.serviceId === service.serviceId
//                     )}
//                     onAddToWishlist={handleAddToWishlist}
//                     isInWishlist={wishlist.some(
//                       (item) => item.serviceId === service.serviceId
//                     )}
//                     variant="recommended"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>


//           {/* Phần All Services */}
//           <div className="mb-12">
//             <h2 className="text-3xl font-bold mb-8 text-gray-800">
//               All Services
//             </h2>
//             {filteredAllServices.length === 0 ? (
//               <div className="text-center py-8 text-gray-600">
//                 No services available at the moment.

//           {/* All Services Section */}
//           <div className="mb-20">
//             <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-12 text-gray-800 relative inline-block">
//               All Services
//               <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-[#A10550]"></span>
//             </h2>

//             {filteredAllServices.length === 0 ? (
//               <div className="text-center py-12 bg-gray-50 rounded-xl">
//                 <p className="text-xl text-gray-600">No services available at the moment.</p>

//               </div>
//             ) : (
//               <div className="space-y-10">
//                 {filteredAllServices.map((service) => (
//                   <ServiceCard
//                     key={`all-${service.serviceId}`}
//                     service={service}
//                     onSelect={handleSelect}
//                     onViewDetails={() => handleViewDetails(service)}
//                     isSelected={selectedServices.some(
//                       (s) => s.serviceId === service.serviceId
//                     )}
//                     onAddToWishlist={handleAddToWishlist}
//                     isInWishlist={wishlist.some(
//                       (item) => item.serviceId === service.serviceId
//                     )}
//                     variant="all"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar - Booking Summary */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-8" id="booking-summary-panel">
//             <BookingSummaryPanel
//               selectedServices={selectedServices}
//               onRemoveService={handleRemoveService}
//               onBookServices={handleBookServices}
//               onClearAllServices={handleClearAllServices}
//               isLoggedIn={isLoggedIn()}
//             />
//           </div>
//         </div>
//       </div>

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

// Login Required Modal Component
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-pink-50 mb-6">
            <svg
              className="h-8 w-8 text-[#A10550]"
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
          <h3 className="text-2xl font-serif font-medium text-gray-900 mb-3">Login Required</h3>
          <p className="text-gray-600 mb-8">
            You need to be logged in to {getActionText()}. Would you like to login now?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#A10550] hover:bg-[#800440] transition-colors"
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
  const [filteredRecommendedServices, setFilteredRecommendedServices] = useState([]);
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

  const isLoggedIn = useCallback(() => !!localStorage.getItem("token"), []);

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

  const handleLoginRequired = (action, service = null) => {
    setRedirectAction(action);
    if (service) setServiceForDetail(service);
    setShowLoginModal(true);
  };

  useEffect(() => {
    const result = localStorage.getItem("skinTypeResult");
    if (result) setSkinTypeResult(JSON.parse(result));
  }, []);

  const handleSelect = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("booking");
      return;
    }
    const serviceWithDuration = { ...service, duration: service.duration };
    setSelectedServices((prev) => {
      const updatedServices = prev.some((s) => s.serviceId === service.serviceId)
        ? prev.filter((s) => s.serviceId !== service.serviceId)
        : [...prev, serviceWithDuration];
      localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices));
      return updatedServices;
    });
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices((prev) => {
      const updatedServices = prev.filter((s) => s.serviceId !== serviceId);
      if (updatedServices.length === 0) {
        localStorage.removeItem("selectedServicesForBooking");
      } else {
        localStorage.setItem("selectedServicesForBooking", JSON.stringify(updatedServices));
      }
      return updatedServices;
    });
  };

  const handleClearAllServices = () => {
    setSelectedServices([]);
    localStorage.removeItem("selectedServicesForBooking");
  };

  const handleViewDetails = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("detail", service);
      return;
    }
    navigate(`/services/${service.serviceId}`);
  };

  const handleAddToWishlist = (service) => {
    if (!isLoggedIn()) {
      handleLoginRequired("wishlist");
      return;
    }
    let updatedWishlist = [...wishlist];
    const isInWishlist = updatedWishlist.some((item) => item.serviceId === service.serviceId);
    if (isInWishlist) {
      updatedWishlist = updatedWishlist.filter((item) => item.serviceId !== service.serviceId);
    } else {
      updatedWishlist.push(service);
    }
    Cookies.set("wishlist", JSON.stringify(updatedWishlist), { expires: 7 });
    setWishlist(updatedWishlist);
  };

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
      const selectedServiceIds = selectedServices.map((service) => service.serviceId);
      localStorage.setItem("selectedServiceIdsForBooking", JSON.stringify(selectedServiceIds));
      setBookingSuccess("Proceeding to booking confirmation...");
      setBookingError("");
      navigate("/mybooking");
      setTimeout(() => {
        setSelectedServices([]);
        localStorage.removeItem("selectedServicesForBooking");
      }, 1000);
    } catch (error) {
      console.error("Error preparing booking:", error);
      setBookingError("Failed to prepare booking. Please try again.");
    }
  };

  useEffect(() => {
    if (hasFetched) return;

    const savedWishlist = Cookies.get("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) setWishlist(parsedWishlist);
        else setWishlist([]);
      } catch (error) {
        console.error("Error parsing wishlist from cookie:", error);
        setWishlist([]);
      }
    }

    const fetchRecommendedServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/quiz/recommended-services",
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
            setTimeout(() => navigate("/login"), 2000);
          } else if (error.response.status === 400 || error.response.status === 404) {
            setError("No recommended services found. Please complete the skin type quiz.");
          } else {
            setError(error.response.data.message || "Failed to load recommended services.");
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(error.message || "Failed to load recommended services. Please try again.");
        }
      }
    };

    const fetchAllServices = async () => {
      try {
        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/services",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

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
            setError(error.response.data.message || "Failed to load services. Please try again.");
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(error.message || "Failed to load services. Please try again.");
        }
      }
    };

    Promise.all([fetchRecommendedServices(), fetchAllServices()]).finally(() => {
      setLoading(false);
      setHasFetched(true);
    });
  }, [navigate, hasFetched, isLoggedIn]);

  useEffect(() => {
    if (!skinTypeResult || hasFetched) return;

    const fetchRecommendedServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/quiz/recommended-services",
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
            setTimeout(() => navigate("/login"), 2000);
          } else if (error.response.status === 400 || error.response.status === 404) {
            setError("No recommended services found. Please complete the skin type quiz.");
          } else {
            setError(error.response.data.message || "Failed to load recommended services. Please try again.");
          }
        } else if (error.request) {
          setError("Unable to connect to server. Please try again.");
        } else {
          setError(error.message || "Failed to load recommended services. Please try again.");
        }
      }
    };

    fetchRecommendedServices();
  }, [skinTypeResult, navigate, hasFetched]);

  useEffect(() => {
    const storedServices = localStorage.getItem("selectedServicesForBooking");
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          setSelectedServices(parsedServices);
          setTimeout(() => {
            const bookingPanel = document.getElementById("booking-summary-panel");
            if (bookingPanel) bookingPanel.scrollIntoView({ behavior: "smooth" });
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing stored services:", error);
      }
    }
  }, []);

  useEffect(() => {
    const redirectInfo = localStorage.getItem("redirectAfterLogin");
    if (redirectInfo && isLoggedIn()) {
      try {
        const { action, serviceId, selectedServices: savedServices } = JSON.parse(redirectInfo);
        if (action === "detail" && serviceId) {
          navigate(`/services/${serviceId}`);
        } else if (action === "booking" && savedServices?.length > 0) {
          const servicesToSelect = allServices.filter((s) => savedServices.includes(s.serviceId));
          if (servicesToSelect.length > 0) {
            setSelectedServices(servicesToSelect);
            localStorage.setItem("selectedServicesForBooking", JSON.stringify(servicesToSelect));
          }
        }
        localStorage.removeItem("redirectAfterLogin");
      } catch (error) {
        console.error("Error processing redirect after login:", error);
      }
    }
  }, [allServices, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn() && selectedServices.length > 0) {
      handleClearAllServices();
    }
  }, [isLoggedIn, selectedServices.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A10550] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading luxury services...</p>
        </div>
      </div>
    );
  }

  if (error && !allServices.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <Link
            to="/quiz"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#A10550] to-[#800440] text-white rounded-lg hover:from-[#800440] hover:to-[#A10550] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Take the Skin Type Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-6 lg:px-8 bg-white">
      {/* Elegant header with gold accents */}
      <div className="py-12 text-center border-b border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our <span className="text-[#A10550]">Luxury</span> Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Indulge in our premium beauty treatments designed to enhance your natural beauty and provide a truly luxurious
          experience.
        </p>
      </div>

      <div className="flex justify-between items-center py-8">
        <nav>
          <ol className="flex items-center space-x-3 text-lg">
            <li>
              <Link to="/" className="text-gray-800 hover:text-[#A10550] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-[#A10550] font-medium">Services</li>
          </ol>
        </nav>
        <div className="w-96">
          <ServiceSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Notification messages */}
      {bookingError && (
        <div className="mb-10 p-6 bg-red-50 text-red-700 rounded-xl text-lg border border-red-100 shadow-sm">
          {bookingError}
        </div>
      )}
      {bookingSuccess && (
        <div className="mb-10 p-6 bg-green-50 text-green-700 rounded-xl text-lg border border-green-100 shadow-sm">
          {bookingSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 py-8">
        {/* Main content - Services */}
        <div className="lg:col-span-2">
          {/* Recommended Services Section */}
          <div className="mb-20">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-12 text-gray-800 relative inline-block">
              Recommended For You
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-[#A10550]"></span>
            </h2>
            {error ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-xl text-gray-600 mb-6">{error}</p>
                <Link
                  to="/quiz"
                  className="inline-block px-8 py-4 bg-[#A10550] text-white rounded-lg hover:bg-[#800440] transition-colors duration-300 font-medium"
                >
                  Take the Skin Type Quiz
                </Link>
              </div>
            ) : recommendedServices.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-xl text-gray-600 mb-6">
                  No recommended services available. Please complete the skin type quiz to see personalized
                  recommendations.
                </p>
                <Link
                  to="/quiz"
                  className="inline-block px-8 py-4 bg-[#A10550] text-white rounded-lg hover:bg-[#800440] transition-colors duration-300 font-medium"
                >
                  Take the Quiz
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredRecommendedServices.map((service) => (
                  <ServiceCard
                    key={`recommended-${service.serviceId}`}
                    service={service}
                    onSelect={handleSelect}
                    onViewDetails={() => handleViewDetails(service)}
                    isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
                    variant="recommended"
                  />
                ))}
              </div>
            )}
          </div>

          {/* All Services Section */}
          <div className="mb-20">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-12 text-gray-800 relative inline-block">
              All Services
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-[#A10550]"></span>
            </h2>
            {filteredAllServices.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-xl text-gray-600">No services available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredAllServices.map((service) => (
                  <ServiceCard
                    key={`all-${service.serviceId}`}
                    service={service}
                    onSelect={handleSelect}
                    onViewDetails={() => handleViewDetails(service)}
                    isSelected={selectedServices.some((s) => s.serviceId === service.serviceId)}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.some((item) => item.serviceId === service.serviceId)}
                    variant="all"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8" id="booking-summary-panel">
            <BookingSummaryPanel
              selectedServices={selectedServices}
              onRemoveService={handleRemoveService}
              onBookServices={handleBookServices}
              onClearAllServices={handleClearAllServices}
              isLoggedIn={isLoggedIn()}
            />
          </div>
        </div>
      </div>

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