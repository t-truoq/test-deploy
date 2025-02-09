import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Header/Navbar'
import Footer from './components/Footer/Footer'

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Blog from './pages/Blog/Blog';
import Products from './pages/Products/Products';
import Services from './pages/Services/Services';
import Login from './pages/Login/Login';

function App() {
  const location = useLocation();
  const hiddenNavbarAndFooter = ['/login'];
  return (
    <div className="app-container">
      {!hiddenNavbarAndFooter.includes(location.pathname) && <Navbar/>}
      <main>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!hiddenNavbarAndFooter.includes(location.pathname) && <Footer/>}
    </div>
  )
}

export default App
