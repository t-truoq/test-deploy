"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { staticBlogs } from "../../../../data/blog/staticBlogs";

export default function BlogHome() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  // Sử dụng dữ liệu tĩnh từ staticBlogs.js
  useEffect(() => {
    // Đảm bảo dữ liệu từ staticBlogs đã được định dạng sẵn, không cần format lại
    setBlogs(staticBlogs);
  }, []);

  const handleClick = (blogId) => {
    navigate(`/blog/${blogId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
          Our Blog
        </h2>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Discover the latest skincare tips, trends, and insights from our
          beauty experts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {blogs.slice(0, 4).map((post) => (
            <Link
              to={`/blog/${post.id}`}
              onClick={() => handleClick(post.id)}
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 md:p-8 bg-pink-50 h-full flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#A10550] transition-colors">
                  {post.title}
                </h3>
                <div className="text-sm md:text-base text-gray-600 mb-4">
                  {post.category} | {post.author} | {post.date}
                </div>
                <p className="text-gray-600 text-base md:text-lg line-clamp-3 mb-4 flex-grow">
                  {post.excerpt}
                </p>
                <div className="text-[#A10550] font-medium group-hover:underline">
                  Read more
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-block border-2 border-[#A10550] text-[#A10550] hover:bg-[#A10550] hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}