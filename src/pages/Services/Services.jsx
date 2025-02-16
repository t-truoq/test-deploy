import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Services.css';

const services = [
{
      id: 1,
      name: "Hydrating Facial",
      description: "A deeply hydrating treatment that restores moisture to dry skin.",
      image: "/services/HydratingFacial.webp",
      time: "60 minutes",
      skin_therapist: "Dr. Tam Dep Trai",
      price: 50.0,
      note: "Best for dry and dehydrated skin."
    },
    {
      id: 2,
      name: "Acne Treatment",
      description: "A specialized treatment to reduce acne and breakouts.",
      image: "/services/AcneTreatment.jpg",
      time: "75 minutes",
      skin_therapist: "Dr. Nam Suoi Vang",
      price: 70.0,
      note: "Recommended for oily and acne-prone skin."
    },
    {
      id: 3,
      name: "Anti-Aging Facial",
      description: "A rejuvenating facial to reduce fine lines and wrinkles.",
      image: "/services/AntiAgingFacial.jpg",
      time: "90 minutes",
      skin_therapist: "Dr. Truong Mot Lan",
      price: 90.0,
      note: "Best for mature skin."
    },
    {
      id: 4,
      name: "Brightening Facial",
      description: "A facial treatment to enhance skin radiance and even tone.",
      image: "/services/BrighteningFacial.avif",
      time: "75 minutes",
      skin_therapist: "Dr. SNam Gay",
      price: 80.0,
      note: "Ideal for dull and uneven skin tone."
    },
    {
      id: 5,
      name: "Deep Cleansing Facial",
      description: "A deep pore cleansing facial to remove impurities.",
      image: "/services/DeepCleansingFacial.jpg",
      time: "60 minutes",
      skin_therapist: "Dr. SNam Gay",
      price: 60.0,
      note: "Best for congested and oily skin."
    },
    {
      id: 6,
      name: "Collagen Boosting Facial",
      description: "A treatment to boost collagen production for firm skin.",
      image: "/services/CollageBoostingFacial.jpeg",
      time: "90 minutes",
      skin_therapist: "Dr. Truong Mot Lan",
      price: 100.0,
      note: "Great for reducing fine lines."
    },
    {
      id: 7,
      name: "Oxygen Facial",
      description: "A skin-revitalizing treatment using pure oxygen infusion.",
      image: "/services/OxygenFacial.jpg",
      time: "75 minutes",
      skin_therapist: "Dr. Truong Mot Lan",
      price: 85.0,
      note: "Perfect for tired and stressed skin."
    },
    {
      id: 8,
      name: "Vitamin C Infusion Facial",
      description: "A brightening treatment infused with Vitamin C.",
      image: "/services/VitaminCInfusionFacial.jpg",
      time: "60 minutes",
      skin_therapist: "Dr. Tam Dep Trai",
      price: 75.0,
      note: "Enhances skin glow and evens skin tone."
    },
    {
      id: 9,
      name: "Microdermabrasion Treatment",
      description: "An exfoliating treatment for smoother, fresher skin.",
      image: "/services/MicrodermabrasionTreatment.jpg",
      time: "60 minutes",
      skin_therapist: "Dr. Nam Suoi Vang",
      price: 95.0,
      note: "Helps with uneven skin texture."
    },
    {
      id: 10,
      name: "Detox Facial",
      description: "A purifying treatment that removes toxins and impurities.",
      image: "/services/DetoxFacial.jpg",
      time: "75 minutes",
      skin_therapist: "Dr. Nam Suoi Vang",
      price: 85.0,
      note: "Ideal for city dwellers exposed to pollution."
    },
    {
      id: 11,
      name: "Sensitive Skin Facial",
      description: "A gentle treatment designed for sensitive skin types.",
      image: "/services/SensitiveSkinFacial.webp",
      time: "60 minutes",
      skin_therapist: "Dr. Tam Dep Trai",
      price: 70.0,
      note: "Calms redness and irritation."
    },
    {
      id: 12,
      name: "Gold Facial",
      description: "A luxurious 24K gold facial for ultimate skin rejuvenation.",
      image: "/services/GoldFacial.webp",
      time: "90 minutes",
      skin_therapist: "Dr. SNam Gay",
      price: 120.0,
      note: "Provides deep hydration and anti-aging benefits."
    }
  ]
  const ServiceCard = ({ service, onSelect, isSelected }) => (
    <div className="col-lg-6 mb-4">
      <div className={`card h-100 ${isSelected ? 'selected' : ''}`} 
        style={{ 
          borderRadius: '12px',
          backgroundColor: isSelected ? '#FCEEF3' : '#fff',
          border: '1px solid #dee2e6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
        <img 
          src={service.image} 
          className="card-img-top" 
          alt={service.name} 
          style={{ 
            height: "250px", 
            objectFit: "cover", 
            borderRadius: "12px 12px 0 0",
            padding: "10px"
          }} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-3" style={{ color: "#A10550", fontFamily: 'Playfair Display', fontWeight: 'bold' }}>
            {service.name}
          </h5>
          <p className="card-text fw-bold mb-2">
            ${service.price}.00 - {service.time}
          </p>
          <p className="card-text mb-4">
            {service.description}
          </p>
          <div className="mt-auto d-flex gap-2">
            <button 
              className="btn flex-grow-1" 
              style={{ 
                backgroundColor: "#A10550", 
                color: "#fff",
                fontWeight: 'bold'
              }} 
              onClick={() => onSelect(service)}>
              {isSelected ? 'Booked' : 'Book Now'}
            </button>
            <button 
              className="btn btn-outline-dark flex-grow-1" 
              style={{ fontWeight: 'bold' }}>
              Details
            </button>
          </div>
        </div>
      </div>
      <hr className="service-divider" />
    </div>
  );
  
  const SelectedServices = ({ selectedServices, clearServices }) => (
    <div className="selected-services">
      <h4>Number of services: {selectedServices.length}</h4>
      <ul>
        {selectedServices.map(service => <li key={service.id}>{service.name}</li>)}
      </ul>
      <button className="btn primary">Booking</button>
      <button className="btn secondary" onClick={clearServices}>Clear Services</button>
    </div>
  );
  
  const Services = () => {
    const [selectedServices, setSelectedServices] = useState([]);
  
    const handleSelect = (service) => {
      setSelectedServices((prev) =>
        prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
      );
    };
  
    const clearServices = () => {
      setSelectedServices([]);
    };
  
    return (
      <div className="services-page">
        {/* Breadcrumb */}
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-3">
              <li className="breadcrumb-item"><a href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</a></li>
              <li className="breadcrumb-item active" aria-current="page" style={{ color: '#A10550' }}>Services</li>
            </ol>
          </nav>
          <h2 className="mb-4" style={{ color: '#000' }}>Services</h2>
        </div>

        {/* Services Grid */}
        <div className="container" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <div className="row">
            {services.map(service => 
              <ServiceCard 
                key={service.id} 
                service={service} 
                onSelect={handleSelect} 
                isSelected={selectedServices.includes(service)} 
              />
            )}
          </div>
        </div>

        {/* Selected Services Box */}
        <div className="services-summary">
          <h4 className="services-summary-title">
            Number of services: {selectedServices.length}
          </h4>
          <ul className="services-list">
            {selectedServices.map(service => (
              <li key={service.id} className="services-list-item">
                {service.name}
              </li>
            ))}
          </ul>
          <button className="services-book-btn">Booking</button>
          <button className="services-clear-btn" onClick={clearServices}>
            Clear Services
          </button>
        </div>
      </div>
    );
  };
  
  export default Services;
