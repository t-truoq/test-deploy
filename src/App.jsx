import { useLocation } from 'react-router-dom';


import { Routes, Route } from 'react-router-dom';
import Navbar from './components/home/Header/Navbar'
import Footer from './components/home/Footer/Footer'

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Blog from './pages/Blog/Blog';
import Products from './pages/Products/Products';
import Services from './pages/Services/Services';
import ServiceDetail from './components/service/serviceDetail/SeviceDetail';
import BlogInfo from "./components/blog/blogDetail/BlogInfor";
import SignUp from './components/login/signUp/SignUp';
import LoginPage from './components/login/LoginPage';
import ForgetPassword from './components/login/forgetPass/forgetPass';
function App() {
  const location = useLocation();
  const hiddenNavbarAndFooter = [ '/signup','/login','/forgetpass'];
  return (
    <>
     <div className="app-container">
      {!hiddenNavbarAndFooter.includes(location.pathname) && <Navbar/>}
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
        </Routes>
      </main>
      {!hiddenNavbarAndFooter.includes(location.pathname) && <Footer/>}
      
    </div>
{/* <div className="bg-green-500 text-white p-4 text-center">
  Nếu phần này có nền màu xanh lá, Tailwind đã hoạt động!
</div> */}

    </>
   

    
  )
}

export default App
