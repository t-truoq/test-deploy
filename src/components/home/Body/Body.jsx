"use client"

import { useNavigate, Link } from "react-router-dom"
import Slider from "./componentsHome/Slider"
import ServiceHome from "./componentsHome/ServiceHome"
import { allBlogPosts } from "../../../data/blog/blogListView"

export default function Home() {
  const navigate = useNavigate()

  const handleBookNow = (serviceId) => {
    navigate(`/services/${serviceId}`)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const handleClick = () => {
    navigate('/services');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <Slider />

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Skincare Services</h2>
          <ServiceHome />
          <div className="text-center mt-12">
            <button
              onClick={handleClick}
              className="inline-block bg-[#A10550] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a0443] transition-colors"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>



        {/* Skin Analysis Banner */}
        <section className="bg-[#3D021E] rounded-2xl overflow-hidden mx-4 lg:mx-auto max-w-6xl h-[280px]">
          <div className="flex h-full">
            <div className="w-[50%] p-8 flex flex-col justify-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                NEW Virtual Skincare Analysis
              </h2>
              <p className="text-sm lg:text-base text-white/90 mb-4 leading-snug">
                Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool Evaluates Your Skin And
                Provides The Most Personalized Recommendations.
              </p>
              <div className="space-y-2">
                <p className="text-white/90 text-sm">Scan With Your Phone To Get Started</p>
                <p className="text-white/90 text-sm">Or</p>
                <button className="border border-white/20 text-white px-6 py-1.5 rounded text-sm hover:bg-white/10 transition-colors">
                  Answer A Few Questions
                </button>
              </div>
            </div>
            <div className="w-[50%] relative">
              <img
                src="./home/newVisual/newVisual.jpg"
                alt="Diverse faces showcasing skincare"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* Treatment Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <img
              src="./home/treatment/treatment.jpg"
              alt="Treatment"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </section>

      {/* Blog View */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto px-4">
          {allBlogPosts.slice(0,3).map((post) => (
            <Link
              to={`/blog/${post.id}`}
              onClick={handleClick}
              key={post.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative h-64 w-full">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 bg-pink-50">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  {post.category} | {post.author} | {post.date}
                </div>
                <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* OUR BRAND */}
      <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Brand</h2>
      <div className="overflow-hidden rounded-3xl bg-[#3D021E] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[60fr,40fr]">
          {/* Text Content */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            <h2 className="mb-4 text-4xl font-bold text-white">Our Brand</h2>
            <p className="mb-6 text-xl leading-relaxed text-white/90 max-w">
              We Believe That Beauty Thrives In Diversity And Discovery. Our Purpose Is To Expand The Way The World Sees
              Beauty By Empowering The Extraordinary In Each Of Us.
            </p>
            <div>
              <button 
                onClick={() => {
                  navigate('/about');
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}
                className="inline-flex border border-white/20 px-6 py-2 text-sm text-white transition-colors hover:bg-white/10"
              >
                Discover More
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[250px] md:h-[330px]">
            <img
              src="./home/brand/ourBrand.webp"
              alt="Diverse beauty representation"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
    </div>
    
  )
}

