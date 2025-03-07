// import { UserIcon } from "lucide-react"
// import { doctors } from "../../../data/about/aboutDoctor"
// const AboutDoctor = () => {

//   return (
//     <section className="py-16 px-4 bg-gray-50">
//       <div className="max-w-4xl mx-auto space-y-12">
//         <div className="text-center space-y-4">
//           <h2 className="text-3xl font-light text-gray-800">Meet Beautya's Skincare Experts</h2>
//           <p className="text-gray-600">
//             Beautiful skin doesn't just require good products; it also needs expert hands with extensive experience.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {doctors.map((doctor, index) => (
//             <div key={index} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
//               <div className="flex items-center space-x-4">
//                 <div className="w-16 h-16 rounded-full overflow-hidden">
//                   <img 
//                     src={doctor.image} 
//                     alt={doctor.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-medium text-gray-800">{doctor.name}</h3>
//                   <p className="text-gray-600">{doctor.role}</p>
//                 </div>
//               </div>
//               <p className="text-gray-600">{doctor.description}</p>
//               <p className="text-sm text-gray-500">Experience: {doctor.experience}</p>
//               <p className="italic text-gray-600">"{doctor.quote}"</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default AboutDoctor

import { doctors } from "../../../data/about/aboutDoctor"

const AboutDoctor = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-gray-800">Meet Beautya's Skincare Experts</h2>
          <p className="text-gray-600">
            Beautiful skin doesn't just require good products; it also needs expert hands with extensive experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm space-y-4 h-auto">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{doctor.description}</p>
              <p className="text-sm text-gray-500">Experience: {doctor.experience}</p>
              <p className="italic text-gray-600">"{doctor.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutDoctor

