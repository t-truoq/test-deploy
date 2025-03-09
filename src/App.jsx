import { useLocation } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/home/Header/Navbar";
import Footer from "./components/home/Footer/Footer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import Products from "./pages/Products/Products";
import Services from "./pages/Services/Services";
import ServiceDetail from "./components/service/serviceDetail/SeviceDetail";
import BlogInfo from "./components/blog/blogDetail/BlogInfor";
import SignUp from "./components/login/signUp/SignUp";
import LoginPage from "./components/login/LoginPage";
import ForgetPassword from "./components/login/forgetPass/forgetPass";
import SidebarProfile from "./components/Profile/SidebarProfile";
import Wishlist from "./components/Profile/ProfileComponents/Wishlist";

import HomeAdmin from "./pages/Admin/Home/HomeAdmin";
import OrderListAdmin from "./pages/Admin/Orderlists/OrderlistAdmin";
import CalendarAdmin from "./pages/Admin/Calendar/CalendarAdmin";
import ContactAdmin from "./pages/Admin/Contact/ContactAdmin";
import InvoiceAdmin from "./pages/Admin/Invoice/InvocieAdmin";
import FeedbackManagement from "./pages/Admin/Feedback/FeedbackAdmin";
import ServicesAdmin from "./pages/Admin/Services/ServicesAdmin";
import HomeStaff from "./pages/Staff/HomeStaff";
import MyBooking from "./components/Profile/ProfileComponents/MyBooking";
import Quiz from "./components/Quiz/Quiz";
import MySkinType from "./components/Profile/ProfileComponents/MySkinType";
import FeedbackStaff from "./pages/Staff/FeedbackStaff";
import HomeSkinTheorapist from "./pages/SkinTherapist/Home";
import FeedbackSK from "./pages/SkinTherapist/Feedback";
import ProfilePage from "./pages/SkinTherapist/Profile";

function App() {
  const location = useLocation();
  const hiddenNavbarAndFooter = [
    "/signup",
    "/login",
    "/forgetpass",
    "/admin/home",
    "/admin/services",
    "/admin/orderlists",
    "/admin/calendar",
    "/admin/contact",
    "/admin/invoice",
    "/admin/feedback",
    "/staff/home",
    "/staff/appointments",
    "/staff/schedule",
    "/staff/clients",
    "/staff/skintherapist",
    "/staff/feedback",
    "/skintherapist/home",
    "/skintherapist/feedback",
    "/skintherapist/profile",
  ];

  return (
    <>
      <div className="app-container">
        {!hiddenNavbarAndFooter.includes(location.pathname) && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogInfo />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgetpass" element={<ForgetPassword />} />
            <Route path="/profile" element={<SidebarProfile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/mybooking" element={<MyBooking />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/myskintype" element={<MySkinType />} />
            {/* Admin router*/}
            <Route path="/admin/home" element={<HomeAdmin />} />
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/orderlists" element={<OrderListAdmin />} />
            <Route path="/admin/calendar" element={<CalendarAdmin />} />
            <Route path="/admin/contact" element={<ContactAdmin />} />
            <Route path="/admin/invoice" element={<InvoiceAdmin />} />
            <Route path="/admin/feedback" element={<FeedbackManagement />} />
            {/* Staff router*/}
            <Route path="/staff/home" element={<HomeStaff />} />
            <Route path="/staff/appointments" element={<HomeStaff />} />
            <Route path="/staff/clients" element={<HomeStaff />} />
            <Route path="/staff/skintherapist" element={<HomeStaff />} />
            <Route path="/staff/schedule" element={<HomeStaff />} />
            <Route path="/staff/feedback" element={<FeedbackStaff />} />
            {/* Skin theorapist router*/}

            <Route
              path="/skintherapist/home"
              element={<HomeSkinTheorapist />}
            />
            <Route path="/skintherapist/feedback" element={<FeedbackSK />} />

            <Route path="/skintherapist/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        {!hiddenNavbarAndFooter.includes(location.pathname) && <Footer />}
      </div>
      {/* <div className="bg-green-500 text-white p-4 text-center">
  Nếu phần này có nền màu xanh lá, Tailwind đã hoạt động!
</div> */}
    </>
  );
}

export default App;
