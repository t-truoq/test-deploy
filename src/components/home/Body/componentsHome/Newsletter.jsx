// "use client";

// import axios from "axios";
// import { useState } from "react";

// export default function Newsletter() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     email: "",
//     message: "",
//   });
  
//   const [submitted, setSubmitted] = useState(false)
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false) // Added loading state

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSubmitted(false);
//     setIsLoading(true);
  

//     // Check required fields
//     if (!formData.fullName.trim()) {
//       setError("Please enter your full name")
//       return
//     }
//     if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone)) {
//       setError("Please enter a valid phone number (10-11 digits)")
//       return
//     }
//     if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
//       setError("Please enter a valid email address")
//       return
//     }
//     if (!formData.message.trim()) {
//       setError("Please enter your message")
//       return
//     }

//     // Prepare data for API
//     const requestData = {
//       fullName: formData.fullName,
//       phoneNumber: formData.phone,
//       email: formData.email,
//       message: formData.message
//     }

//     try {
//       setIsLoading(true) // Show loading state
//       const response = await fetch('https://9592-118-69-70-166.ngrok-free.app/api/contact', {
//         method: 'post',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       })
//       ////
//       if (!response.ok) {
//         throw new Error('An error occurred while sending the request')
//       }

//       // Handle success
//       setSubmitted(true)
//       setError("")
//       setFormData({
//         fullName: "",
//         phone: "",
//         email: "",
//         message: ""
//       })

//       // Reset success message after 5 seconds
//       setTimeout(() => {
//         setSubmitted(false)
//       }, 5000)

//     } catch (err) {
//       setError(err.message || "An error occurred while sending the request")
//     } finally {
//       setIsLoading(false) // Hide loading state
//     }
//   }

//   return (
//     <section className="py-16 md:py-24 w-full bg-gradient-to-r from-[#3D021E] to-[#A10550]">
//       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Get Support</h2>
//           <p className="text-lg md:text-xl text-white/90 mb-8">
//             Fill in the information below to receive support from us regarding skincare issues and services
//           </p>

//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col gap-4 max-w-xl mx-auto"
//           >
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Full Name"
//               className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
//               aria-label="Full Name"
//             />
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
//               aria-label="Phone Number"
//             />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email Address"
//               className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
//               aria-label="Email Address"
//             />
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               placeholder="Support Request Message"
//               className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white min-h-[120px]"
//               aria-label="Support Request Message"
//             />
//             <button
//               type="submit"
//               disabled={isLoading} // Disable button when loading
//               className={`bg-white text-[#A10550] px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
//                 isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
//               }`}
//             >
//               {isLoading ? 'Sending...' : 'Send Request'}
//             </button>
//           </form>

//           {error && <p className="mt-4 text-red-300">{error}</p>}

//           {submitted && <p className="mt-4 text-green-300">Thank you! We will contact you soon.</p>}

//           <p className="mt-6 text-white/70 text-sm">
//             By submitting this request, you agree to our Privacy Policy and allow us to contact you.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }


// "use client"

// import { useState } from "react"

// export default function Newsletter() {
//   const [email, setEmail] = useState("")
//   const [submitted, setSubmitted] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
//       setError("Please enter a valid email address")
//       return
//     }

//     // Here you would typically send the email to your backend
//     console.log("Subscribing email:", email)

//     // Simulate success
//     setSubmitted(true)
//     setError("")
//     setEmail("")

//     // Reset the success message after 5 seconds
//     setTimeout(() => {
//       setSubmitted(false)
//     }, 5000)
//   }

//   return (
//     <section className="py-16 md:py-24 w-full bg-gradient-to-r from-[#3D021E] to-[#A10550]">
//       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Stay Updated</h2>
//           <p className="text-lg md:text-xl text-white/90 mb-8">
//             Subscribe to our newsletter for exclusive skincare tips, special offers, and the latest beauty trends
//           </p>

//           <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Your email address"
//               className="flex-grow px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
//               aria-label="Email address"
//             />
//             <button
//               type="submit"
//               className="bg-white text-[#A10550] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
//             >
//               Subscribe
//             </button>
//           </form>

//           {error && <p className="mt-4 text-red-300">{error}</p>}

//           {submitted && <p className="mt-4 text-green-300">Thank you for subscribing!</p>}

//           <p className="mt-6 text-white/70 text-sm">
//             By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
//           </p>
//         </div>
//       </div>
//     </section>
//   )
// }


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