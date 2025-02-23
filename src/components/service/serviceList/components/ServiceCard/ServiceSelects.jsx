// import { Card } from './Card'
// import PropTypes from 'prop-types'

// export default function ServiceSelects({ selectedServices, clearServices }) {
//   return (
//     <div className="fixed bottom-5 right-5 bg-white rounded-xl shadow-lg p-5 w-[280px]">
//         <h4 className="text-[#A10550] font-playfair font-bold text-lg mb-4">
//           Selected Services: {selectedServices.length}
//         </h4>
//         <ul className="space-y-2 mb-4">
//           {selectedServices.map(service => (
//             <li key={service.id} className="bg-pink-50 p-3 rounded-lg text-left">
//               <Card
//                 id={service.id}
//                 name={service.name}
//                 description={service.description}
//                 image={service.image}
//                 time={service.time}
//                 price={service.price}
//               />
//             </li>
//           ))}
//         </ul>
//         <button className="w-full bg-[#A10550] text-white py-2.5 rounded-lg font-bold mb-2">
//           Booking
//         </button>
//         <button
//           className="w-full bg-gray-100 text-gray-800 py-2.5 rounded-lg font-bold"
//           onClick={clearServices}>
//           Clear Services
//         </button>
//       </div>
//   )
// }

// ServiceSelects.propTypes = {
//   selectedServices: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     image: PropTypes.string,
//     time: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired
//   })).isRequired,
//   clearServices: PropTypes.func.isRequired
// }
