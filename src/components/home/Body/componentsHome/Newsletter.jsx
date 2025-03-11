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


"use client"

import { useState } from "react"

export default function Newsletter() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Kiểm tra các trường bắt buộc
    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập họ và tên")
      return
    }
    if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone)) {
      setError("Vui lòng nhập số điện thoại hợp lệ (10-11 số)")
      return
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ")
      return
    }

    // Log thông tin (thay bằng API call thực tế trong ứng dụng của bạn)
    console.log("Yêu cầu hỗ trợ:", formData)

    // Simulate success
    setSubmitted(true)
    setError("")
    setFormData({
      fullName: "",
      phone: "",
      email: "",
    })

    // Reset thông báo thành công sau 5 giây
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  return (
    <section className="py-16 md:py-24 w-full bg-gradient-to-r from-[#3D021E] to-[#A10550]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Nhận Hỗ Trợ</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Điền thông tin dưới đây để nhận hỗ trợ từ chúng tôi về các vấn đề chăm sóc da và dịch vụ
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
              name="phone"
              value={formData.phone}
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
            <button
              type="submit"
              className="bg-white text-[#A10550] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gửi Yêu Cầu
            </button>
          </form>

          {error && <p className="mt-4 text-red-300">{error}</p>}

          {submitted && <p className="mt-4 text-green-300">Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.</p>}

          <p className="mt-6 text-white/70 text-sm">
            Bằng cách gửi yêu cầu, bạn đồng ý với Chính sách bảo mật của chúng tôi và cho phép chúng tôi liên hệ với bạn.
          </p>
        </div>
      </div>
    </section>
  )
}