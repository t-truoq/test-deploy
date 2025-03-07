// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom'; // Thêm import Link
// import axios from 'axios';

// export default function ServiceHome() {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchServices = async () => {
//       if (!token) {
//         setError('Vui lòng đăng nhập để xem dịch vụ');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           'https://b64a-118-69-182-149.ngrok-free.app/api/services',
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//               'ngrok-skip-browser-warning': 'true', // Bỏ qua cảnh báo ngrok
//             },
//           }
//         );

//         console.log('API Response:', response.data);
//         if (Array.isArray(response.data)) {
//           setServices(response.data.slice(0, 4)); // Lấy 4 dịch vụ đầu tiên
//         } else {
//           throw new Error('Dữ liệu dịch vụ không hợp lệ từ server');
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching services:', err);
//         if (err.response?.status === 401) {
//           setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
//         } else if (err.response?.status === 403) {
//           setError('Bạn không có quyền truy cập danh sách dịch vụ.');
//         } else {
//           setError(err.response?.data?.message || 'Không thể tải danh sách dịch vụ');
//         }
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, [token]);

//   const handleBookNow = (serviceId) => {
//     navigate(`/services/${serviceId}`);
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   if (loading) {
//     return <div className="text-center py-8">Đang tải dịch vụ...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-600">
//         {error}{' '}
//         <Link to="/signin" className="text-[#A10550] underline">
//           Đăng nhập ngay
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {services.map((service) => (
//           <div
//             key={service.serviceId}
//             className="relative bg-pink-50 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
//           >
//             <img
//               src={service.image || '/placeholder.svg'}
//               alt={service.name}
//               className="w-full h-64 object-cover rounded-lg"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-bold text-[#A10550] mb-2">{service.name}</h3>
//               <p className="text-gray-700 mb-4">
//                 ${service.price.toFixed(2)} - {Math.round(service.duration / 60000)} min
//               </p>
//               <p className="text-sm text-gray-600 mb-4">{service.description}</p>
//               <button
//                 onClick={() => handleBookNow(service.serviceId)}
//                 className="bg-[#2D0A31] text-white px-6 py-2 rounded hover:bg-[#1a061d] transition-colors"
//               >
//                 Book Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ServiceHome() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          'https://b64a-118-69-182-149.ngrok-free.app/api/services',
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
              // Không cần gửi token vì API đã public
            },
          }
        );

        console.log('API Response:', response.data);
        if (Array.isArray(response.data)) {
          setServices(response.data.slice(0, 4)); // Lấy 4 dịch vụ đầu tiên
        } else {
          throw new Error('Dữ liệu dịch vụ không hợp lệ từ server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        if (err.response?.status === 404) {
          setError('Không tìm thấy dịch vụ.');
        } else {
          setError(err.response?.data?.message || 'Không thể tải danh sách dịch vụ');
        }
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Không cần phụ thuộc vào token nữa

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải dịch vụ...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.serviceId}
            className="relative bg-pink-50 rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <img
              src={service.image || '/placeholder.svg'}
              alt={service.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#A10550] mb-2">{service.name}</h3>
              <p className="text-gray-700 mb-4">
                ${service.price.toFixed(2)} - {service.duration} min
              </p>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <button
                onClick={() => handleBookNow(service.serviceId)}
                className="bg-[#2D0A31] text-white px-6 py-2 rounded hover:bg-[#1a061d] transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}