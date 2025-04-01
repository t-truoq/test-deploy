import { useLocation, Navigate } from "react-router-dom";
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
import LoginPage from "./components/login/LoginPage"; // Đảm bảo đây là SignIn của bạn
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
import StaffsManagement from "./pages/Admin/StaffsManagment/StaffsManagement";
import SkinTherapistsManagement from "./pages/Admin/SkinTherapistsManagement/SkinTherapistsManagement";
import ContactManagment from "./pages/Staff/ContactManagment";
import Payment from "./pages/Staff/Payment";
import QuestionAdmin from "./pages/Admin/Questions/QuestionAdmin";

// Component bảo vệ route dựa trên role
const ProtectedRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole") || "CUSTOMER"; // Lấy role từ localStorage, mặc định là CUSTOMER

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return element;
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
            {/* Customer routes */}
            <Route
              path="/"
              element={<ProtectedRoute element={<Home />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/about"
              element={<ProtectedRoute element={<About />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/blog"
              element={<ProtectedRoute element={<Blog />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/blog/:id"
              element={<ProtectedRoute element={<BlogInfo />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/specialist"
              element={<ProtectedRoute element={<Specialist />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/services"
              element={<ProtectedRoute element={<Services />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/services/:id"
              element={<ProtectedRoute element={<ServiceDetail />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute element={<SidebarProfile />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/wishlist"
              element={<ProtectedRoute element={<Wishlist />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/mybooking"
              element={<ProtectedRoute element={<MyBooking />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/quiz"
              element={<ProtectedRoute element={<Quiz />} allowedRoles={["CUSTOMER"]} />}
            />
            <Route
              path="/myskintype"
              element={<ProtectedRoute element={<MySkinType />} allowedRoles={["CUSTOMER"]} />}
            />

            {/* Public routes (ai cũng vào được) */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgetpass" element={<ForgetPassword />} />

            {/* Admin routes */}
            <Route
              path="/admin/home"
              element={<ProtectedRoute element={<HomeAdmin />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/services"
              element={<ProtectedRoute element={<ServicesAdmin />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/orderlists"
              element={<ProtectedRoute element={<OrderListAdmin />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/questions"
              element={<ProtectedRoute element={<QuestionAdmin />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/customersmanagement"
              element={<ProtectedRoute element={<CustomersManagement />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/staffsmanagement"
              element={<ProtectedRoute element={<StaffsManagement />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/skintherapistmanagement"
              element={<ProtectedRoute element={<SkinTherapistsManagement />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/paymentmanagement"
              element={<ProtectedRoute element={<PaymentManagement />} allowedRoles={["ADMIN"]} />}
            />
            <Route
              path="/admin/feedback"
              element={<ProtectedRoute element={<FeedbackManagement />} allowedRoles={["ADMIN"]} />}
            />

            {/* Staff routes */}
            <Route
              path="/staff/home"
              element={<ProtectedRoute element={<HomeStaff />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/appointments"
              element={<ProtectedRoute element={<HomeStaff />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/clients"
              element={<ProtectedRoute element={<HomeStaff />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/skintherapist"
              element={<ProtectedRoute element={<HomeStaff />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/schedule"
              element={<ProtectedRoute element={<HomeStaff />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/feedback"
              element={<ProtectedRoute element={<FeedbackStaff />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/contact"
              element={<ProtectedRoute element={<ContactManagment />} allowedRoles={["STAFF"]} />}
            />
            <Route
              path="/staff/paymentmanagement"
              element={<ProtectedRoute element={<Payment />} allowedRoles={["STAFF"]} />}
            />

            {/* Skin Therapist (Specialist) routes */}
            <Route
              path="/skintherapist/home"
              element={<ProtectedRoute element={<HomeSkinTheorapist />} allowedRoles={["SPECIALIST"]} />}
            />
            <Route
              path="/skintherapist/feedback"
              element={<ProtectedRoute element={<FeedbackSK />} allowedRoles={["SPECIALIST"]} />}
            />
            <Route
              path="/skintherapist/profile"
              element={<ProtectedRoute element={<ProfilePage />} allowedRoles={["SPECIALIST"]} />}
            />

            {/* Route mặc định: Nếu không khớp, chuyển về login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        {!hiddenNavbarAndFooter.includes(location.pathname) && <Footer />}
      </div>
    </>
  );
}

export default App;