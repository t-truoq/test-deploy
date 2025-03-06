// import React from 'react'
// import { allBlogPosts } from "../../../../data/blog/blogListView"
// import { Link, useNavigate } from "react-router-dom";

// export default function BlogHome() {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/services");
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <section className="py-16">
//         <h2 className="text-3xl font-bold text-center mb-12">Our Blog</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto px-4">
//           {allBlogPosts.slice(0,3).map((post) => (
//             <Link
//               to={`/blog/${post.id}`}
//               onClick={handleClick}
//               key={post.id}
//               className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
//             >
//               <div className="relative h-64 w-full">
//                 <img
//                   src={post.image || "/placeholder.svg"}
//                   alt={post.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//               <div className="p-6 bg-pink-50">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
//                 <div className="text-sm text-gray-600 mb-3">
//                   {post.category} | {post.author} | {post.date}
//                 </div>
//                 <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>
//   )
// }
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function BlogHome() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy danh sách blog từ API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://fa9f-118-69-182-149.ngrok-free.app/api/blogs",
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("Fetch blogs response:", response.data);

        if (Array.isArray(response.data)) {
          // Format dữ liệu từ API để phù hợp với giao diện
          const formattedBlogs = response.data.map((blog) => ({
            id: blog.blogId,
            title: blog.title,
            excerpt: blog.content.length > 100 ? blog.content.substring(0, 100) + "..." : blog.content,
            author: blog.author.name,
            date: new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            image: blog.images && blog.images.length > 0 ? blog.images[0].url : "/placeholder.svg",
            category: "Blog", // Giá trị mặc định vì API không có category
          }));
          setBlogs(formattedBlogs);
        } else {
          throw new Error("Invalid response format: Expected an array of blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Status:", error.response.status);
          if (error.response.status === 404) {
            setError("No blogs found.");
          } else {
            setError(error.response.data.message || "Failed to load blogs. Please try again.");
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          setError("Unable to connect to server. CORS issue or server error. Please try again.");
        } else {
          setError(error.message || "Failed to load blogs. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleClick = (blogId) => {
    navigate(`/blog/${blogId}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading blogs...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto px-4">
        {blogs.slice(0, 3).map((post) => (
          <Link
            to={`/blog/${post.id}`}
            onClick={() => handleClick(post.id)}
            key={post.id}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          >
            <div className="relative h-64 w-full">
              <img
                src={post.image}
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
  );
}