"use client";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, DollarSign, CheckCircle } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchService = async () => {
      if (!token) {
        setError("Vui lòng đăng nhập để xem chi tiết dịch vụ");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://f820-2405-4802-8132-b860-a51b-6c41-f6c4-bde2.ngrok-free.app/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true", // Bỏ qua cảnh báo ngrok
            },
          }
        );

        console.log("Service data:", response.data);
        setService(response.data); // API trả về object chi tiết dịch vụ
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service:", err);
        if (err.response?.status === 404) {
          setError("Dịch vụ không tồn tại");
        } else if (err.response?.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError(
            err.response?.data?.message || "Không thể tải chi tiết dịch vụ"
          );
        }
        setLoading(false);
      }
    };

    fetchService();
  }, [id, token]);

  if (loading) {
    return <div className="text-center py-8">Đang tải chi tiết dịch vụ...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}{" "}
        <Link to="/login" className="text-[#A10550] underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (!service) {
    return <div className="text-center py-8">Service not found</div>;
  }

  // Tính giá dựa trên duration (giả sử duration trong JSON là tối đa)
  const durationPrices = {
    30: service.price,
    45: service.price * 1.5,
    60: service.price * 2,
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
  };

  // Giả lập khung giờ có sẵn
  const availableTimes = [
    new Date().setHours(9, 0, 0),
    new Date().setHours(10, 0, 0),
    new Date().setHours(11, 0, 0),
    new Date().setHours(14, 0, 0),
    new Date().setHours(15, 0, 0),
    new Date().setHours(16, 0, 0),
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset thời gian khi đổi ngày
  };

  const handleBookNow = () => {
    // Create a service object with all necessary properties
    const serviceToBook = {
      serviceId: service.serviceId,
      name: service.name,
      price: service.price,
      duration: service.duration,
    };

    // Store the service in localStorage to be picked up by the service list page
    const existingServices = JSON.parse(
      localStorage.getItem("selectedServicesForBooking") || "[]"
    );

    // Check if service is already in the list to avoid duplicates
    if (!existingServices.some((s) => s.serviceId === service.serviceId)) {
      existingServices.push(serviceToBook);
      localStorage.setItem(
        "selectedServicesForBooking",
        JSON.stringify(existingServices)
      );
    }

    // Navigate to the services page
    navigate("/services");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link
          to="/services"
          className="text-[#A10550] hover:underline flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Services
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-[500px] object-cover rounded-xl shadow-lg mb-8"
          />
        </div>

        <div>
          <h1 className="text-4xl font-playfair font-bold text-[#A10550] mb-6">
            {service.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{service.description}</p>

          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Service Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="text-[#A10550] mr-4" size={24} />
                <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-gray-600">{service.duration} minutes</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="text-[#A10550] mr-4" size={24} />
                <div>
                  <p className="font-semibold">Price</p>
                  <p className="text-gray-600">
                    ${durationPrices[selectedDuration].toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recommended Skin Types</h2>
            <ul className="space-y-2">
              {service.recommendedSkinTypes.map((type, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle
                    className="text-[#A10550] mr-2 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-600">{type}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleBookNow}
            className="w-full bg-[#A10550] text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#8a0443] transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
