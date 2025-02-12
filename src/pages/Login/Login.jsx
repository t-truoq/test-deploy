import './Login.css'; 
import { useEffect } from 'react';

function Login() {
    // Di chuyển meta tags và title ra khỏi component
    useEffect(() => {
        document.title = "Modern Login Page";
    }, []);

    // Thêm state và function xử lý chuyển đổi form
    const handleSignUpClick = () => {
      const container = document.getElementById('login-container');
      container.classList.add('active');
    };

    const handleSignInClick = () => {
      const container = document.getElementById('login-container');
      container.classList.remove('active');
    };

    return (
      <div className="login-wrapper">
        <div className="login-container" id="login-container">
          <div className="form-container sign-up">
            <form>
              <h1 style={{ color: '#A10550' }}>Create Account</h1>
              <div className="social-icons">
                <a href="https://accounts.google.com" className="icon">
                  <i className="fa-brands fa-google" />
                </a>
                <a href="https://www.facebook.com" className="icon">
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a href="https://github.com" className="icon">
                  <i className="fa-brands fa-github" />
                </a>
                <a href="https://www.linkedin.com" className="icon">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              </div>
              <span>or use your email for registeration</span>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button>Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in">
            <form>
              <h1 style={{ color: '#A10550' }}>Sign In</h1>
              <div className="social-icons">
                <a href="https://accounts.google.com" className="icon">
                  <i className="fa-brands fa-google" />
                </a>
                <a href="https://www.facebook.com" className="icon">
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a href="https://github.com" className="icon">
                  <i className="fa-brands fa-github" />
                </a>
                <a href="https://www.linkedin.com" className="icon">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
              </div>
              <span>or use your email password</span>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <a href="#">Forget Your Password?</a>
              <button>Sign In</button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1 style={{ color: '#A10550' }}>Welcome Back!</h1>
                <button className="hidden" id="login" onClick={handleSignInClick}>
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1 style={{ color: '#A10550' }}>Hello, Friend!</h1>
                <button className="hidden color: black" id="register" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login; 