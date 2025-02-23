// import { Link } from "react-router-dom"
// import { Clock, DollarSign } from "lucide-react"
// import PropTypes from 'prop-types'

// export function Card({ id, name, description, image, time, price }) {
//   return (
//     <Link
//       to={`/services/${id}`}
//       className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
//     >
//       <div className="relative h-48">
//         <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//           <h2 className="text-xl font-bold text-white">{name}</h2>
//         </div>
//       </div>
//       <div className="p-4 flex-grow">
//         <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
//         <div className="flex justify-between items-center text-sm">
//           <div className="flex items-center text-gray-500">
//             <Clock size={16} className="mr-1" />
//             <span>{time}</span>
//           </div>
//           <div className="flex items-center font-bold text-[#A10550]">
//             <DollarSign size={16} className="mr-1" />
//             <span>{price}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }

// Card.propTypes = {
//   id: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   image: PropTypes.string,
//   time: PropTypes.string.isRequired,
//   price: PropTypes.number.isRequired
// }

