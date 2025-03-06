// "use client"
// import { useParams, Link } from "react-router-dom"
// import { ArrowLeft, Calendar, User, Tag } from "lucide-react"

// // Giả sử bạn đã import dữ liệu blogPosts từ một file khác
// import { blogPosts } from "../../../data/blog/blogListDetail"

// const BlogInfo = () => {
//   const { id } = useParams()
//   const blog = blogPosts.find((post) => post.id === parseInt(id))

//   console.log("ID from URL:", id) // Để debug
//   console.log("Found blog:", blog) // Để debug

//   if (!blog) {
//     return <div>Blog post not found</div>
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen pb-12">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <Link to="/blog" className="flex items-center text-[#A10550] hover:text-[#8a0443] transition-colors">
//               <ArrowLeft className="mr-2" size={20} />
//               <span className="font-medium">Back to Blog</span>
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
//         <article className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-64 object-cover" />

//           <div className="p-8">
//             <div className="flex items-center text-sm text-gray-500 mb-4">
//               <Calendar size={16} className="mr-2" />
//               <span>{blog.date}</span>
//               <User size={16} className="ml-4 mr-2" />
//               <span>{blog.author}</span>
//               <Tag size={16} className="ml-4 mr-2" />
//               <span>{blog.category}</span>
//             </div>

//             <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

//             <div className="prose max-w-none">
//               {blog.content.split("\n\n").map((paragraph, index) => (
//                 <p key={index} className="mb-4 text-gray-700 leading-relaxed">
//                   {paragraph}
//                 </p>
//               ))}
//             </div>
//           </div>
//         </article>
//       </main>
//     </div>
//   )
// }

// export default BlogInfo

"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://fa9f-118-69-182-149.ngrok-free.app/api/blogs/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined, // Gửi token nếu có
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
            },
          }
        );

        console.log("Fetch blog detail response:", response.data);

        // Format dữ liệu blog
        const formattedBlog = {
          id: response.data.blogId,
          title: response.data.title,
          content: response.data.content,
          author: response.data.author.name,
          date: new Date(response.data.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          image: response.data.images && response.data.images.length > 0 ? response.data.images[0].url : "/Placeholder.svg", // Lấy hình ảnh từ images[0].url hoặc dùng placeholder
          category: "Blog", // Giá trị mặc định vì API không có category
        };

        setBlog(formattedBlog);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Status:", error.response.status);
          if (error.response.status === 401) {
            setError("Unauthorized: Please login again.");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else if (error.response.status === 404) {
            setError("Blog post not found.");
          } else {
            setError(error.response.data.message || "Failed to load blog post. Please try again.");
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          setError("Unable to connect to server. CORS issue or server error. Please try again.");
        } else {
          setError(error.message || "Failed to load blog post. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading blog post...</div>;
  }

  if (error || !blog) {
    return (
      <div className="text-center py-8 text-red-600">
        {error || "Blog post not found"}
        <Link to="/blog" className="block mt-4 text-[#A10550] underline">
          Go back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/blog" className="flex items-center text-[#A10550] hover:text-[#8a0443] transition-colors">
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Back to Blog</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />

          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar size={16} className="mr-2" />
              <span>{blog.date}</span>
              <User size={16} className="ml-4 mr-2" />
              <span>{blog.author}</span>
              <Tag size={16} className="ml-4 mr-2" />
              <span>{blog.category}</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

            <div className="prose max-w-none">
              {blog.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;