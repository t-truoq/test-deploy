import React, { useState, useEffect } from "react";
import { X, Star, Phone, Mail, MapPin, Calendar, Clock, Heart } from 'lucide-react';

// Sample therapist data - in a real app, this would come from an API
const therapistsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Facial Specialist",
    image: "/therapists/sarah.jpg",
    rating: 4.9,
    reviews: 124,
    experience: "8 years",
    description: "Dr. Sarah specializes in advanced facial treatments and skin rejuvenation techniques. With over 8 years of experience, she has helped hundreds of clients achieve their skincare goals.",
    education: "Certified Dermatology Specialist, Beauty Institute of New York",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@beautya.com",
    location: "Main Branch, 123 Beauty Street",
    availability: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "10:00 AM - 6:00 PM" },
    ],
    treatments: ["Hydrafacial", "Microdermabrasion", "Chemical Peels", "Anti-Aging Treatments"]
  },
  {
    id: 2,
    name: "Emma Thompson",
    specialty: "Massage Therapist",
    image: "/therapists/emma.jpg",
    rating: 4.8,
    reviews: 98,
    experience: "6 years",
    description: "Emma is our senior massage therapist with expertise in various massage techniques including Swedish, deep tissue, and hot stone therapy. Her holistic approach focuses on both physical and mental wellbeing.",
    education: "Licensed Massage Therapist, Wellness Academy",
    phone: "+1 (555) 234-5678",
    email: "emma.thompson@beautya.com",
    location: "Downtown Branch, 456 Relaxation Avenue",
    availability: [
      { day: "Tuesday", hours: "10:00 AM - 7:00 PM" },
      { day: "Thursday", hours: "10:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 3:00 PM" },
    ],
    treatments: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Therapy", "Aromatherapy"]
  },
  {
    id: 3,
    name: "Michael Chen",
    specialty: "Skincare Expert",
    image: "/therapists/michael.jpg",
    rating: 4.7,
    reviews: 87,
    experience: "5 years",
    description: "Michael specializes in treating problematic skin conditions and creating personalized skincare routines. His expertise in Asian skincare techniques has made him a favorite among clients with sensitive skin.",
    education: "Certified Esthetician, International Skincare Academy",
    phone: "+1 (555) 345-6789",
    email: "michael.chen@beautya.com",
    location: "East Side Branch, 789 Glow Street",
    availability: [
      { day: "Monday", hours: "11:00 AM - 8:00 PM" },
      { day: "Thursday", hours: "11:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    ],
    treatments: ["Acne Treatment", "Sensitive Skin Care", "K-Beauty Facials", "Skin Analysis"]
  },
  {
    id: 4,
    name: "Olivia Martinez",
    specialty: "Nail Artist",
    image: "/therapists/olivia.jpg",
    rating: 4.9,
    reviews: 156,
    experience: "7 years",
    description: "Olivia is our premier nail artist with a passion for creative nail designs and impeccable manicures. Her attention to detail and steady hands ensure every client leaves with perfect nails.",
    education: "Certified Nail Technician, Beauty Arts College",
    phone: "+1 (555) 456-7890",
    email: "olivia.martinez@beautya.com",
    location: "Main Branch, 123 Beauty Street",
    availability: [
      { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Friday", hours: "9:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 3:00 PM" },
    ],
    treatments: ["Gel Manicure", "Nail Art", "Pedicure", "Nail Extensions"]
  },
  {
    id: 5,
    name: "David Wilson",
    specialty: "Hair Stylist",
    image: "/therapists/david.jpg",
    rating: 4.8,
    reviews: 112,
    experience: "9 years",
    description: "David is a master hair stylist with expertise in cutting-edge techniques and color treatments. His creative vision and technical skills have earned him a loyal client base and industry recognition.",
    education: "Master Stylist, Elite Hair Academy",
    phone: "+1 (555) 567-8901",
    email: "david.wilson@beautya.com",
    location: "Downtown Branch, 456 Relaxation Avenue",
    availability: [
      { day: "Monday", hours: "10:00 AM - 7:00 PM" },
      { day: "Wednesday", hours: "10:00 AM - 7:00 PM" },
      { day: "Friday", hours: "10:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
    ],
    treatments: ["Precision Cuts", "Color Treatments", "Balayage", "Hair Extensions"]
  },
  {
    id: 6,
    name: "Sophia Kim",
    specialty: "Makeup Artist",
    image: "/therapists/sophia.jpg",
    rating: 4.9,
    reviews: 143,
    experience: "6 years",
    description: "Sophia is our talented makeup artist with a flair for enhancing natural beauty. From everyday looks to special occasion glamour, she tailors each application to suit the client's features and preferences.",
    education: "Professional Makeup Artist, Glamour Institute",
    phone: "+1 (555) 678-9012",
    email: "sophia.kim@beautya.com",
    location: "East Side Branch, 789 Glow Street",
    availability: [
      { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 3:00 PM" },
    ],
    treatments: ["Bridal Makeup", "Special Occasion Makeup", "Makeup Lessons", "Lash Applications"]
  }
];

const TherapistCard = ({ therapist, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
      onClick={() => onClick(therapist)}
    >
      <div className="relative">
        <img 
          src={therapist.image || "/placeholder.svg?height=300&width=400"} 
          alt={therapist.name} 
          className="w-full h-auto object-cover aspect-[4/3]"
        />
        <div className="absolute top-0 right-0 m-2 p-1 bg-white rounded-full shadow">
          <Heart className="h-5 w-5 text-pink-500" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{therapist.name}</h3>
        <p className="text-pink-600 font-medium">{therapist.specialty}</p>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">{therapist.rating}</span>
          </div>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{therapist.reviews} reviews</span>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{therapist.experience} experience</span>
        </div>
      </div>
    </div>
  );
};

const TherapistDetail = ({ therapist, onClose }) => {
  if (!therapist) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md z-10"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
          
          <div className="md:flex">
            <div className="md:w-2/5">
              <img 
                src={therapist.image || "/placeholder.svg?height=400&width=300"} 
                alt={therapist.name} 
                className="w-full h-auto object-cover md:h-full"
              />
            </div>
            
            <div className="p-6 md:w-3/5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{therapist.name}</h2>
                  <p className="text-pink-600 font-medium">{therapist.specialty}</p>
                </div>
                
                <div className="flex items-center bg-pink-50 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-gray-700">{therapist.rating}</span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{therapist.reviews} reviews</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600">{therapist.description}</p>
              </div>
              
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-pink-500" />
                      {therapist.phone}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-pink-500" />
                      {therapist.email}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                      {therapist.location}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
                  <p className="text-gray-600">{therapist.education}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {therapist.availability.map((slot, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <p className="font-medium text-gray-700">{slot.day}</p>
                      <p className="text-sm text-gray-500">{slot.hours}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Treatments</h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.treatments.map((treatment, index) => (
                    <span 
                      key={index} 
                      className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm"
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <button className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TherapistPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");

  // Simulate API fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setTherapists(therapistsData);
      setLoading(false);
    }, 500);
  }, []);

  const handleTherapistClick = (therapist) => {
    setSelectedTherapist(therapist);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseDetail = () => {
    setSelectedTherapist(null);
    // Re-enable scrolling
    document.body.style.overflow = "auto";
  };

  // Get unique specialties for filter
  const specialties = [...new Set(therapistsData.map(t => t.specialty))];

  // Filter therapists based on search and specialty
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "" || therapist.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Expert Therapists</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our team of experienced beauty professionals dedicated to helping you look and feel your best.
            Book a session with one of our specialists today.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="w-full md:w-1/4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {filteredTherapists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No therapists found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTherapists.map((therapist) => (
                  <TherapistCard
                    key={therapist.id}
                    therapist={therapist}
                    onClick={handleTherapistClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Therapist Detail Modal */}
      {selectedTherapist && (
        <TherapistDetail 
          therapist={selectedTherapist} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
};

export default TherapistPage;
