import { useNavigate } from 'react-router-dom'

const AboutButton = ({ text, onClick, className = "" }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/services');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
      <button
        onClick={handleClick}
        className={`px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300 font-medium ${className}`}
      >
        {text}
      </button>
    )
  }
  
  export default AboutButton
  
  