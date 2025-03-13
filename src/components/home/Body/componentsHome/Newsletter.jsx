"use client";

import axios from "axios";
import { useState } from "react";

export default function Newsletter() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    setIsLoading(true);

    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập họ và tên");
      setIsLoading(false);
      return;
    }
    if (!formData.phoneNumber || !/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10-11 số)");
      setIsLoading(false);
      return;
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      setIsLoading(false);
      return;
    }
    if (!formData.message.trim()) {
      setError("Vui lòng nhập nội dung tin nhắn");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://9592-118-69-70-166.ngrok-free.app/api/contact",
        formData,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      console.log("Contact request response:", response.data);
      setSubmitted(true);
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting contact:", error);
      setError(
        error.response?.data?.message ||
          "Không thể gửi yêu cầu. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 w-full bg-gradient-to-r from-[#3D021E] to-[#A10550]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Nhận Hỗ Trợ
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Điền thông tin dưới đây để nhận hỗ trợ từ chúng tôi về các vấn đề
            chăm sóc da và dịch vụ
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Họ và tên"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Số điện thoại"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Địa chỉ email"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Địa chỉ email"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nội dung tin nhắn"
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
              rows="4"
              aria-label="Nội dung tin nhắn"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-white text-[#A10550] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Đang gửi..." : "Gửi Yêu Cầu"}
            </button>
          </form>

          {error && <p className="mt-4 text-red-300">{error}</p>}
          {submitted && (
            <p className="mt-4 text-green-300">
              Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.
            </p>
          )}

          <p className="mt-6 text-white/70 text-sm">
            Bằng cách gửi yêu cầu, bạn đồng ý với Chính sách bảo mật của chúng
            tôi và cho phép chúng tôi liên hệ với bạn.
          </p>
        </div>
      </div>
    </section>
  );
}