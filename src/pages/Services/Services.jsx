import { useState } from "react";
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Services.css";

const services = [
  { 
    id: 1, 
    name: "Massage Thư Giãn", 
    description: "Trải nghiệm massage thư giãn giúp giảm căng thẳng và đau nhức.",
    image: "/services/massageThuGian.webp"
  },
  { 
    id: 2, 
    name: "Chăm Sóc Da Mặt", 
    description: "Dịch vụ chăm sóc da chuyên sâu giúp bạn có làn da khỏe mạnh và rạng rỡ.",
    image: "/services/chamSocDaMat.jpg"
  },
  { 
    id: 3, 
    name: "Tẩy Tế Bào Chết", 
    description: "Loại bỏ tế bào chết mang lại làn da mịn màng và tươi mới.",
    image: "/services/tayTeBaoChet.jpg"
  },
  { 
    id: 4, 
    name: "Xông Hơi Thảo Dược", 
    description: "Xông hơi thư giãn giúp cải thiện tuần hoàn và thải độc tố.",
    image: "/services/xongHoiThaoDuoc.jpg"
  },
  { 
    id: 5, 
    name: "Liệu Trình Trẻ Hóa", 
    description: "Trẻ hóa làn da bằng công nghệ và liệu pháp tiên tiến.",
    image: "/services/treHoa.jpg"
  },
  { 
    id: 6, 
    name: "Trị Mụn Chuyên Sâu", 
    description: "Điều trị mụn hiệu quả và an toàn cho làn da nhạy cảm.",
    image: "/services/triMunChuyenSau.jpg"
  },
  { 
    id: 7, 
    name: "Chăm Sóc Body", 
    description: "Liệu trình chăm sóc cơ thể toàn diện giúp bạn thư giãn hoàn toàn.",
    image: "/services/chamSocBody.jpg"
  },
  { 
    id: 8, 
    name: "Gội Đầu Thảo Dược", 
    description: "Gội đầu bằng thảo dược tự nhiên giúp giảm stress và làm sạch tóc.",
    image: "/services/goiDauThaoDuoc.jpg"
  },
];

const ServiceCard = ({ service, onSelect, isSelected }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="col-md-3 mb-4">
        <div 
          className={`card h-100 shadow-sm position-relative ${isSelected ? 'border-primary' : ''}`}
          onClick={(e) => {
            if (!e.target.classList.contains('form-check-input')) {
              setShowPopup(true);
            }
          }}
        >
          <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
            <input
              type="checkbox"
              className="form-check-input"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(service);
              }}
              style={{ width: '20px', height: '20px' }}
            />
          </div>
          <div id={`carousel-${service.id}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img 
                  src={service.image} 
                  className="d-block w-100" 
                  alt={service.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
          <div className="card-body text-center">
            <h5 className="card-title font-weight-bold">{service.name}</h5>
            <p className="card-text text-muted">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Popup */}
      <div className={`popup-overlay ${showPopup ? 'active' : ''}`} onClick={() => setShowPopup(false)}>
        <div className="popup-content" onClick={e => e.stopPropagation()}>
          <span className="popup-close" onClick={() => setShowPopup(false)}>&times;</span>
          <img src={service.image} alt={service.name} className="popup-image" />
          <h3 className="popup-title">{service.name}</h3>
          <p className="popup-description">{service.description}</p>
          <button 
            className="btn btn-booking w-100"
            onClick={() => {
              onSelect(service);
              setShowPopup(false);
            }}
          >
            {isSelected ? 'Hủy Chọn' : 'Chọn Dịch Vụ'}
          </button>
        </div>
      </div>
    </>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

const Services = () => {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleServiceSelect = (service) => {
    setSelectedServices(prev => {
      const isAlreadySelected = prev.find(s => s.id === service.id);
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-4">
        <span>Home</span>
        <span className="mx-2">&gt;</span>
        <span>Services</span>
      </div>
      
      <h2 className="mb-4">Services</h2>
      
      <div className="row">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onSelect={handleServiceSelect}
            isSelected={selectedServices.some(s => s.id === service.id)}
          />
        ))}
      </div>

      {/* Thanh đặt dịch vụ */}
      <div className="booking-bar bg-white p-3 mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="me-2">Number Of Services:</span>
            <strong>{selectedServices.length}</strong>
          </div>
          <button 
            className="btn btn-booking"
            onClick={() => {
              if (selectedServices.length === 0) {
                alert('Vui lòng chọn ít nhất một dịch vụ');
                return;
              }
              // Xử lý logic đặt hàng
            }}
          >
            Booking Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
