import { useLocation, Navigate, Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/home/Header/Navbar";
import Footer from "./components/home/Footer/Footer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
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
import Specialist from "./components/Therapist/SpecialistPage";
import PaymentManagement from "./pages/Admin/Invoice/PaymentAdmin";
import CustomersManagement from "./pages/Admin/CustomersManagement/CustomersManagement";

import SkinTherapistsManagement from "./pages/Admin/SkinTherapistsManagement/SkinTherapistsManagement";
import ContactManagment from "./pages/Staff/ContactManagment";
import Payment from "./pages/Staff/Payment";
import QuestionAdmin from "./pages/Admin/Questions/QuestionAdmin";
import StaffsManagement from "./pages/Admin/StaffsManagment/StaffsManagement";

// Component ProtectedRoute để bảo vệ các route
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Nếu không có token, chuyển hướng về /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Giải mã token để lấy vai trò
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userRole = decodedToken.role?.toUpperCase();

    // Nếu vai trò không nằm trong danh sách allowedRoles, chuyển hướng về /login
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    // Nếu token không hợp lệ, xóa token và chuyển hướng về /login
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

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
    "/admin/customersmanagement",
    "/admin/staffsmanagement",
    "/admin/skintherapistmanagement",
    "/admin/paymentmanagement",
    "/admin/feedback",
    "/admin/questions",
    "/staff/home",
    "/staff/appointments",
    "/staff/schedule",
    "/staff/clients",
    "/staff/skintherapist",
    "/staff/contact",
    "/staff/paymentmanagement",
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
            {/* Public routes - Không yêu cầu đăng nhập */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogInfo />} />
            <Route path="/specialist" element={<Specialist />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgetpass" element={<ForgetPassword />} />

            {/* Customer routes - Không yêu cầu đăng nhập */}
            <Route path="/profile" element={<SidebarProfile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/mybooking" element={<MyBooking />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/myskintype" element={<MySkinType />} />

            {/* Admin routes - Chỉ ADMIN truy cập được */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/home" element={<HomeAdmin />} />
              <Route path="/admin/services" element={<ServicesAdmin />} />
              <Route path="/admin/orderlists" element={<OrderListAdmin />} />
              <Route path="/admin/questions" element={<QuestionAdmin />} />
              <Route path="/admin/customersmanagement" element={<CustomersManagement />} />
              <Route path="/admin/staffsmanagement" element={<StaffsManagement />} />
              <Route path="/admin/skintherapistmanagement" element={<SkinTherapistsManagement />} />
              <Route path="/admin/paymentmanagement" element={<PaymentManagement />} />
              <Route path="/admin/feedback" element={<FeedbackManagement />} />
            </Route>

            {/* Staff routes - Chỉ STAFF truy cập được */}
            <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
              <Route path="/staff/home" element={<HomeStaff />} />
              <Route path="/staff/appointments" element={<HomeStaff />} />
              <Route path="/staff/clients" element={<HomeStaff />} />
              <Route path="/staff/skintherapist" element={<HomeStaff />} />
              <Route path="/staff/schedule" element={<HomeStaff />} />
              <Route path="/staff/feedback" element={<FeedbackStaff />} />
              <Route path="/staff/contact" element={<ContactManagment />} />
              <Route path="/staff/paymentmanagement" element={<Payment />} />
            </Route>

            {/* Skin therapist routes - Chỉ SPECIALIST truy cập được */}
            <Route element={<ProtectedRoute allowedRoles={["SPECIALIST"]} />}>
              <Route path="/skintherapist/home" element={<HomeSkinTheorapist />} />
              <Route path="/skintherapist/feedback" element={<FeedbackSK />} />
              <Route path="/skintherapist/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
        {!hiddenNavbarAndFooter.includes(location.pathname) && <Footer />}
      </div>
    </>
  );
}

export default App;