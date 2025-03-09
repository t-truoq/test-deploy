// "use client";

// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// const MyBooking = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refresh, setRefresh] = useState(false); // State để làm mới danh sách booking

//   // Lấy danh sách booking từ API
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No token found. Please login again.");
//         }

//         const response = await axios.get(
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/user",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Fetch bookings response:", response.data);

//         if (Array.isArray(response.data)) {
//           setBookings(response.data);
//         } else {
//           throw new Error("Invalid response format: Expected an array of bookings");
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         if (error.response) {
//           console.log("Error response:", error.response.data);
//           console.log("Status:", error.response.status);
//           if (error.response.status === 401) {
//             setError("Unauthorized: Please login again.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 2000);
//           } else if (error.response.status === 403) {
//             setError("You do not have permission to access your bookings.");
//           } else if (error.response.status === 404) {
//             setError("No bookings found.");
//           } else {
//             setError(error.response.data.message || "Failed to load bookings. Please try again.");
//           }
//         } else if (error.request) {
//           console.log("No response received:", error.request);
//           setError("Unable to connect to server. CORS issue or server error. Please try again.");
//         } else {
//           setError(error.message || "Failed to load bookings. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate, refresh]);

//   // Làm mới danh sách booking khi người dùng truy cập lại trang
//   useEffect(() => {
//     setRefresh((prev) => !prev); // Kích hoạt làm mới khi location thay đổi
//   }, [location]);

//   // Hủy booking
//   const handleCancelBooking = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found. Please login again.");
//       }

//       const response = await axios.post(
//         `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/cancel`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Cancel booking response:", response.data);

//       // Cập nhật danh sách booking sau khi hủy
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking.bookingId === bookingId ? { ...booking, status: "CANCELLED" } : booking
//         )
//       );
//     } catch (error) {
//       console.error("Error canceling booking:", error);
//       if (error.response) {
//         if (error.response.status === 401) {
//           setError("Unauthorized: Please login again.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);
//         } else if (error.response.status === 403) {
//           setError("You do not have permission to cancel this booking.");
//         } else {
//           setError(error.response.data.message || "Failed to cancel booking. Please try again.");
//         }
//       } else {
//         setError("Failed to cancel booking. Please try again.");
//       }
//     }
//   };

//   // Check-in booking
//   const handleCheckIn = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found. Please login again.");
//       }

//       const response = await axios.post(
//         `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/checkin`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Check-in booking response:", response.data);

//       // Cập nhật danh sách booking sau khi check-in
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking.bookingId === bookingId
//             ? { ...booking, checkInTime: new Date().toISOString(), status: "IN_PROGRESS" }
//             : booking
//         )
//       );
//     } catch (error) {
//       console.error("Error checking in booking:", error);
//       if (error.response) {
//         if (error.response.status === 401) {
//           setError("Unauthorized: Please login again.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);
//         } else {
//           setError(error.response.data.message || "Failed to check-in booking. Please try again.");
//         }
//       } else {
//         setError("Failed to check-in booking. Please try again.");
//       }
//     }
//   };

//   // Check-out booking
//   const handleCheckOut = async (bookingId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found. Please login again.");
//       }

//       const response = await axios.post(
//         `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/checkout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "ngrok-skip-browser-warning": "true",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Check-out booking response:", response.data);

//       // Cập nhật danh sách booking sau khi check-out
//       setBookings((prevBookings) =>
//         prevBookings.map((booking) =>
//           booking.bookingId === bookingId
//             ? { ...booking, checkOutTime: new Date().toISOString(), status: "COMPLETED" }
//             : booking
//         )
//       );
//     } catch (error) {
//       console.error("Error checking out booking:", error);
//       if (error.response) {
//         if (error.response.status === 401) {
//           setError("Unauthorized: Please login again.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);
//         } else {
//           setError(error.response.data.message || "Failed to check-out booking. Please try again.");
//         }
//       } else {
//         setError("Failed to check-out booking. Please try again.");
//       }
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8 text-gray-600">Loading bookings...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-600">
//         {error}
//         <Link to="/login" className="block mt-4 text-[#A10550] underline">
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Breadcrumb */}
//       <nav className="py-4">
//         <ol className="flex items-center space-x-2">
//           <li>
//             <Link to="/" className="text-gray-800 hover:text-[#A10550]">
//               Home
//             </Link>
//           </li>
//           <li className="text-gray-500">/</li>
//           <li className="text-[#A10550]">My Bookings</li>
//         </ol>
//       </nav>

//       <h2 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h2>

//       {bookings.length === 0 ? (
//         <div className="text-center py-8 text-gray-600">
//           You have no bookings yet.{" "}
//           <Link to="/services" className="text-[#A10550] underline">
//             Book a service now
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {bookings.map((booking) => (
//             <div
//               key={booking.bookingId}
//               className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Booking ID: {booking.bookingId}
//                   </h3>
//                   <p className="mt-2 text-gray-600">
//                     <span className="font-medium">Date:</span> {booking.bookingDate}
//                   </p>
//                   <p className="mt-1 text-gray-600">
//                     <span className="font-medium">Time Slot:</span> {booking.timeSlot}
//                   </p>
//                   <p className="mt-1 text-gray-600">
//                     <span className="font-medium">Total Price:</span> ${booking.totalPrice}
//                   </p>
//                   <p className="mt-1 text-gray-600">
//                     <span className="font-medium">Status:</span>{" "}
//                     <span
//                       className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
//                         booking.status === "PENDING"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : booking.status === "CONFIRMED"
//                           ? "bg-blue-100 text-blue-800"
//                           : booking.status === "IN_PROGRESS"
//                           ? "bg-green-100 text-green-800"
//                           : booking.status === "COMPLETED"
//                           ? "bg-teal-100 text-teal-800"
//                           : booking.status === "CANCELLED"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {booking.status}
//                     </span>
//                   </p>
//                   <p className="mt-1 text-gray-600">
//                     <span className="font-medium">Payment Status:</span>{" "}
//                     <span
//                       className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
//                         booking.paymentStatus === "PENDING"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : booking.paymentStatus === "SUCCESS"
//                           ? "bg-green-100 text-green-800"
//                           : booking.paymentStatus === "FAILED"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {booking.paymentStatus}
//                     </span>
//                   </p>
//                   {booking.checkInTime && (
//                     <p className="mt-1 text-gray-600">
//                       <span className="font-medium">Check-in Time:</span>{" "}
//                       {new Date(booking.checkInTime).toLocaleString()}
//                     </p>
//                   )}
//                   {booking.checkOutTime && (
//                     <p className="mt-1 text-gray-600">
//                       <span className="font-medium">Check-out Time:</span>{" "}
//                       {new Date(booking.checkOutTime).toLocaleString()}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex space-x-2">
//                   {booking.status === "PENDING" && (
//                     <button
//                       onClick={() => handleCancelBooking(booking.bookingId)}
//                       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                   {booking.status === "CONFIRMED" && !booking.checkInTime && (
//                     <button
//                       onClick={() => handleCheckIn(booking.bookingId)}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       Check-in
//                     </button>
//                   )}
//                   {booking.status === "IN_PROGRESS" && !booking.checkOutTime && (
//                     <button
//                       onClick={() => handleCheckOut(booking.bookingId)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Check-out
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBooking;

"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const MyBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false); // State để làm mới danh sách booking
  const [searchDate, setSearchDate] = useState(""); // State để lưu ngày tìm kiếm
  const [selectedServiceIds, setSelectedServiceIds] = useState([]); // Lưu danh sách serviceIds từ localStorage

  // Lấy danh sách serviceIds từ localStorage khi component mount
  useEffect(() => {
    const storedServiceIds = localStorage.getItem(
      "selectedServiceIdsForBooking"
    );
    console.log(
      "Retrieved selectedServiceIds from localStorage:",
      storedServiceIds
    ); // Thêm log để kiểm tra

    if (storedServiceIds) {
      try {
        const parsedServiceIds = JSON.parse(storedServiceIds);
        console.log("Parsed serviceIds:", parsedServiceIds); // Thêm log để kiểm tra
        if (Array.isArray(parsedServiceIds) && parsedServiceIds.length > 0) {
          setSelectedServiceIds(parsedServiceIds);
        } else {
          setSelectedServiceIds([]);
        }
      } catch (error) {
        console.error("Error parsing serviceIds from localStorage:", error);
        setSelectedServiceIds([]);
      }
    }

    // Lấy danh sách booking từ API
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch bookings response:", response.data);

        if (Array.isArray(response.data)) {
          // Sắp xếp booking theo ngày giảm dần (mới nhất lên đầu)
          const sortedBookings = [...response.data].sort((a, b) => {
            return new Date(b.bookingDate) - new Date(a.bookingDate);
          });
          setBookings(sortedBookings);
        } else {
          throw new Error(
            "Invalid response format: Expected an array of bookings"
          );
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Status:", error.response.status);
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else if (error.response.status === 403) {
            setError("You do not have permission to access your bookings.");
          } else if (error.response.status === 404) {
            setError("No bookings found.");
          } else {
            setError(
              error.response.data.message ||
                "Failed to load bookings. Please try again."
            );
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          setError(
            "Unable to connect to server. CORS issue or server error. Please try again."
          );
        } else {
          setError(
            error.message || "Failed to load bookings. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, refresh]);

  // Làm mới danh sách booking khi người dùng truy cập lại trang
  useEffect(() => {
    setRefresh((prev) => !prev); // Kích hoạt làm mới khi location thay đổi
  }, [location]);

  // Lọc booking theo ngày tìm kiếm
  const filteredBookings = searchDate
    ? bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate)
          .toISOString()
          .split("T")[0]; // Lấy ngày dưới dạng YYYY-MM-DD
        return bookingDate === searchDate;
      })
    : bookings;

  // Hàm xác nhận thanh toán và gửi request API
  const handleConfirmPayment = async () => {
    if (selectedServiceIds.length === 0) {
      setError("No services selected for booking.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      // Giả định specialistId (có thể lấy từ form hoặc API sau này)
      const specialistId = "9007199254740991"; // Hardcode tạm thời, thay bằng giá trị thực tế
      const bookingDate = new Date().toISOString(); // Định dạng ISO: "2025-03-06T00:00:00.000Z"
      const startTime = "10:00"; // Giờ bắt đầu, theo định dạng API

      const response = await axios.post(
        "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings",
        {
          specialistId,
          bookingDate,
          startTime,
          serviceIds: selectedServiceIds.map(Number), // Chuyển đổi serviceIds thành mảng số nguyên
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking confirmation response:", response.data);

      // Sau khi gửi thành công, làm mới danh sách booking và xóa dữ liệu tạm
      setRefresh((prev) => !prev);
      setSelectedServiceIds([]);
      localStorage.removeItem("selectedServiceIdsForBooking");
      setError(""); // Xóa lỗi sau khi thành công
      alert("Booking successful!"); // Thông báo thành công
    } catch (error) {
      console.error("Error confirming payment and creating booking:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        setError(
          error.response.data.message ||
            "Failed to confirm payment and create booking. Please try again."
        );
      } else {
        setError(
          error.message ||
            "Failed to confirm payment and create booking. Please try again."
        );
      }
    }
  };

  // Hủy booking
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.post(
        `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Cancel booking response:", response.data);

      // Cập nhật danh sách booking sau khi hủy
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );
    } catch (error) {
      console.error("Error canceling booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (error.response.status === 403) {
          setError("You do not have permission to cancel this booking.");
        } else {
          setError(
            error.response.data.message ||
              "Failed to cancel booking. Please try again."
          );
        }
      } else {
        setError("Failed to cancel booking. Please try again.");
      }
    }
  };

  // Check-in booking
  const handleCheckIn = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.post(
        `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/checkin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Check-in booking response:", response.data);

      // Cập nhật danh sách booking sau khi check-in
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? {
                ...booking,
                checkInTime: new Date().toISOString(),
                status: "IN_PROGRESS",
              }
            : booking
        )
      );
    } catch (error) {
      console.error("Error checking in booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(
            error.response.data.message ||
              "Failed to check-in booking. Please try again."
          );
        }
      } else {
        setError("Failed to check-in booking. Please try again.");
      }
    }
  };

  // Check-out booking
  const handleCheckOut = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.post(
        `https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/bookings/${bookingId}/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Check-out booking response:", response.data);

      // Cập nhật danh sách booking sau khi check-out
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? {
                ...booking,
                checkOutTime: new Date().toISOString(),
                status: "COMPLETED",
              }
            : booking
        )
      );
    } catch (error) {
      console.error("Error checking out booking:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Unauthorized: Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(
            error.response.data.message ||
              "Failed to check-out booking. Please try again."
          );
        }
      } else {
        setError("Failed to check-out booking. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading bookings...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <Link to="/login" className="block mt-4 text-[#A10550] underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="py-4">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-800 hover:text-[#A10550]">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-[#A10550]">My Bookings</li>
        </ol>
      </nav>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h2>

      {/* Hiển thị danh sách dịch vụ đã chọn để xác nhận */}
      {selectedServiceIds.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Selected Services for Booking
          </h3>
          <ul className="space-y-2">
            {selectedServiceIds.map((serviceId) => (
              <li key={serviceId} className="bg-gray-100 p-2 rounded-md">
                Service ID: {serviceId}
              </li>
            ))}
          </ul>
          <button
            onClick={handleConfirmPayment}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm Payment and Book
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm theo ngày */}
      <div className="mb-6">
        <label
          htmlFor="searchDate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Search by Date
        </label>
        <input
          type="date"
          id="searchDate"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A10550] focus:border-[#A10550]"
          placeholder="YYYY-MM-DD"
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No bookings found for the selected date.{" "}
          <Link to="/services" className="text-[#A10550] underline">
            Book a service now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Booking ID: {booking.bookingId}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {booking.bookingDate}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <span className="font-medium">Time Slot:</span>{" "}
                    {booking.startTime} (Start)
                  </p>
                  <p className="mt-1 text-gray-600">
                    <span className="font-medium">Total Price:</span> $
                    {booking.totalPrice || "N/A"}
                  </p>
                  <p className="mt-1 text-gray-600">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : booking.status === "IN_PROGRESS"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "COMPLETED"
                          ? "bg-teal-100 text-teal-800"
                          : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-600">
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        booking.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : booking.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </p>
                  {booking.checkInTime && (
                    <p className="mt-1 text-gray-600">
                      <span className="font-medium">Check-in Time:</span>{" "}
                      {new Date(booking.checkInTime).toLocaleString()}
                    </p>
                  )}
                  {booking.checkOutTime && (
                    <p className="mt-1 text-gray-600">
                      <span className="font-medium">Check-out Time:</span>{" "}
                      {new Date(booking.checkOutTime).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {booking.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelBooking(booking.bookingId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status === "CONFIRMED" && !booking.checkInTime && (
                    <button
                      onClick={() => handleCheckIn(booking.bookingId)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Check-in
                    </button>
                  )}
                  {booking.status === "IN_PROGRESS" &&
                    !booking.checkOutTime && (
                      <button
                        onClick={() => handleCheckOut(booking.bookingId)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Check-out
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
