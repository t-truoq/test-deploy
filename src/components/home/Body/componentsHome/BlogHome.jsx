import React from 'react'
import { allBlogPosts } from "../../../../data/blog/blogListView"
import { Link, useNavigate } from "react-router-dom";

export default function BlogHome() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/services");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
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
  )
}
