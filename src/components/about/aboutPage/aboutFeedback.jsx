// import { Star, MapPin } from "lucide-react"
// import { services } from "../../../data/about/feedbackServices"
// import { feedbacks } from "../../../data/about/feedbackFeedback"
// import { address } from "../../../data/about/feedbackAddress"

// const AboutFeedback = () => {
//   return (
//     <section className="py-16 px-4">
//       <div className="max-w-4xl mx-auto space-y-16">
//         {/* Services */}
//         <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//           <h2 className="text-3xl font-light text-gray-800 text-center">Professional Skincare Services</h2>
//           <div className="space-y-4">
//             {services.map((service, index) => (
//               <div key={index} className="flex items-start space-x-3 p-4 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//                 <Star className="w-5 h-5 text-yellow-400 mt-1" />
//                 <p className="text-gray-600">{service}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Feedback */}
//         <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-sm bg-[#F9FAFB] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//           <h2 className="text-3xl font-light text-gray-800 text-center">Customer Feedback</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {feedbacks.map((feedback, index) => (
//               <div key={index} className="space-y-4 p-4 border border-gray-100 rounded-lg bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//                 <div className="flex text-yellow-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-current" />
//                   ))}
//                 </div>
//                 <p className="text-gray-600 italic">"{feedback.content}"</p>
//                 <p className="text-sm text-gray-500">
//                   {feedback.name}, {feedback.age} years old
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Branches */}
//         <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//           <h2 className="text-3xl font-light text-gray-800 text-center">Our Locations</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {address.map((branch, index) => (
//               <div key={index} className="text-center space-y-2 p-4 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//                 <div className="flex justify-center">
//                   <MapPin className="w-6 h-6 text-gray-600" />
//                 </div>
//                 <h3 className="font-medium text-gray-800">Beautya {branch.city}</h3>
//                 <p className="text-gray-600 text-sm">{branch.address}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default AboutFeedback


import { Star, MapPin } from "lucide-react"
import { services } from "../../../data/about/feedbackServices"
import { feedbacks } from "../../../data/about/feedbackFeedback"
import { address } from "../../../data/about/feedbackAddress"

const AboutFeedback = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Services */}
        <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto">
          <h2 className="text-3xl font-light text-gray-800 text-center">Professional Skincare Services</h2>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
              >
                <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-gray-600">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-sm bg-[#F9FAFB] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto">
          <h2 className="text-3xl font-light text-gray-800 text-center">Customer Feedback</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border border-gray-100 rounded-lg bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
              >
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current flex-shrink-0" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{feedback.content}"</p>
                <p className="text-sm text-gray-500">
                  {feedback.name}, {feedback.age} years old
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Branches */}
        <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto">
          <h2 className="text-3xl font-light text-gray-800 text-center">Our Locations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {address.map((branch, index) => (
              <div
                key={index}
                className="text-center space-y-2 p-4 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-auto"
              >
                <div className="flex justify-center">
                  <MapPin className="w-6 h-6 text-gray-600 flex-shrink-0" />
                </div>
                <h3 className="font-medium text-gray-800">Beautya {branch.city}</h3>
                <p className="text-gray-600 text-sm">{branch.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutFeedback

