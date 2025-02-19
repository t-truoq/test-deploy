import { useEffect } from "react";

function Login() {
  useEffect(() => {
    document.title = "Modern Login Page";
  }, []);

  const handleSignUpClick = () => {
    const container = document.getElementById("login-container");
    container.classList.add("active");
  };

  const handleSignInClick = () => {
    const container = document.getElementById("login-container");
    container.classList.remove("active");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white w-full max-w-4xl shadow-lg rounded-lg overflow-hidden" id="login-container">
        <div className="absolute inset-0 flex">
          {/* Left Panel - Sign In */}
          <div className="w-1/2 p-10 flex flex-col items-center justify-center transition-transform duration-500 transform">
            <h1 className="text-pink-700 text-2xl font-bold">Sign In</h1>
            <div className="flex space-x-4 my-4">
              <a href="https://accounts.google.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="https://www.facebook.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://github.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://www.linkedin.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span className="text-sm text-gray-600">or use your email password</span>
            <form className="w-full flex flex-col items-center">
              <input type="email" placeholder="Email" className="w-full mt-3 p-3 border rounded-lg bg-gray-100 focus:outline-none" autoComplete="current-email" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full mt-3 p-3 border rounded-lg bg-gray-100 focus:outline-none"
                autoComplete="current-password"
              />
              <a href="#" className="text-sm text-gray-600 mt-2">Forgot your password?</a>
              <button type="submit" className="bg-pink-700 text-white px-6 py-2 mt-4 rounded-lg hover:bg-pink-800 transition">Sign In</button>
            </form>
          </div>

          {/* Right Panel - Sign Up */}
          <div className="w-1/2 p-10 flex flex-col items-center justify-center transition-transform duration-500 transform opacity-0 absolute top-0 left-0">
            <h1 className="text-pink-700 text-2xl font-bold">Create Account</h1>
            <div className="flex space-x-4 my-4">
              <a href="https://accounts.google.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="https://www.facebook.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://github.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://www.linkedin.com" className="text-xl text-gray-500 hover:text-pink-700">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span className="text-sm text-gray-600">or use your email for registration</span>
            <form className="w-full flex flex-col items-center">
              <input type="text" placeholder="Name" className="w-full mt-3 p-3 border rounded-lg bg-gray-100 focus:outline-none" />
              <input type="email" placeholder="Email" className="w-full mt-3 p-3 border rounded-lg bg-gray-100 focus:outline-none" autoComplete="new-email" />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full mt-3 p-3 border rounded-lg bg-gray-100 focus:outline-none"
                autoComplete="new-password"
              />
              <button type="submit" className="bg-pink-700 text-white px-6 py-2 mt-4 rounded-lg hover:bg-pink-800 transition">Sign Up</button>
            </form>
          </div>
        </div>

        {/* Toggle Panels */}
        <div className="absolute inset-0 flex">
          {/* Toggle Left */}
          <div className="w-1/2 flex items-center justify-center bg-pink-700 text-white p-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <button onClick={handleSignInClick} className="border border-white px-6 py-2 mt-4 rounded-lg hover:bg-white hover:text-pink-700 transition">
                Sign In
              </button>
            </div>
          </div>

          {/* Toggle Right */}
          <div className="w-1/2 flex items-center justify-center bg-pink-700 text-white p-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Hello, Friend!</h1>
              <button onClick={handleSignUpClick} className="border border-white px-6 py-2 mt-4 rounded-lg hover:bg-white hover:text-pink-700 transition">
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
