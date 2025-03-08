// "use client";

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import axios from "axios";

// const BlogPage = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const postsPerPage = 7;

//   // Tính toán phân trang
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);
//   const totalPages = Math.ceil(blogs.length / postsPerPage);

//   // Lấy danh sách blog từ API
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await axios.get(
//           "https://6bc4-2405-4802-8132-b860-d454-d4f4-c346-cd13.ngrok-free.app/api/blogs",
//           {
//             headers: {
//               Authorization: token ? `Bearer ${token}` : undefined, // Gửi token nếu có
//               'ngrok-skip-browser-warning': 'true',
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log("Fetch blogs response:", response.data);

//         if (Array.isArray(response.data)) {
//           // Thêm các trường cần thiết (image, category, excerpt)
//           const formattedBlogs = response.data.map((blog) => ({
//             id: blog.blogId,
//             title: blog.title,
//             content: blog.content,
//             excerpt: blog.content.length > 100 ? blog.content.substring(0, 100) + "..." : blog.content,
//             author: blog.author.name,
//             date: new Date(blog.createdAt).toLocaleDateString('en-US', {
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric',
//             }),
//             image: blog.images && blog.images.length > 0 ? blog.images[0].url : "/Placeholder.svg", // Lấy hình ảnh từ images[0].url hoặc dùng placeholder
//             category: "Blog", // Giá trị mặc định vì API không có category
//           }));
//           setBlogs(formattedBlogs);
//         } else {
//           throw new Error("Invalid response format: Expected an array of blogs");
//         }
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//         if (error.response) {
//           console.log("Error response:", error.response.data);
//           console.log("Status:", error.response.status);
//           if (error.response.status === 401) {
//             setError("Unauthorized: Please login again.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 2000);
//           } else if (error.response.status === 404) {
//             setError("No blogs found.");
//           } else {
//             setError(error.response.data.message || "Failed to load blogs. Please try again.");
//           }
//         } else if (error.request) {
//           console.log("No response received:", error.request);
//           setError("Unable to connect to server. CORS issue or server error. Please try again.");
//         } else {
//           setError(error.message || "Failed to load blogs. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, [navigate]);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return <div className="text-center py-8 text-gray-600">Loading blogs...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-600">
//         {error}
//         <Link to="/" className="block mt-4 text-[#A10550] underline">
//           Go back to Home
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <Link to="/" className="flex items-center text-[#A10550] hover:text-[#8a0443] transition-colors">
//               <ArrowLeft className="mr-2" size={20} />
//               <span className="font-medium">Back to Home</span>
//             </Link>
//             <h1 className="text-3xl font-bold text-gray-900">Spa & Wellness Blog</h1>
//           </div>
//         </div>
//       </header>
//       <main>
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           {/* Featured Post */}
//           {currentPosts.length > 0 && (
//             <div className="px-4 py-6 sm:px-0">
//               <Link to={`/blog/${currentPosts[0].id}`} className="block">
//                 <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
//                   <div className="md:flex">
//                     <div className="md:flex-shrink-0">
//                       <img
//                         className="h-48 w-full object-cover md:w-48"
//                         src={currentPosts[0].image}
//                         alt={currentPosts[0].title}
//                       />
//                     </div>
//                     <div className="p-8">
//                       <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
//                         {currentPosts[0].category}
//                       </div>
//                       <h2 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
//                         {currentPosts[0].title}
//                       </h2>
//                       <p className="mt-2 text-gray-500">{currentPosts[0].excerpt}</p>
//                       <div className="mt-4 flex items-center">
//                         <div className="flex-shrink-0">
//                           <img
//                             className="h-10 w-10 rounded-full"
//                             src={`https://ui-avatars.com/api/?name=${currentPosts[0].author}&background=random`}
//                             alt={currentPosts[0].author}
//                           />
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-gray-900">{currentPosts[0].author}</p>
//                           <p className="text-sm text-gray-500">{currentPosts[0].date}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           )}

//           {/* Blog Post Grid */}
//           <div className="px-4 py-6 sm:px-0">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {currentPosts.slice(1).map((post) => (
//                 <Link key={post.id} to={`/blog/${post.id}`} className="block">
//                   <div className="bg-white overflow-hidden shadow-sm rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
//                     <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
//                     <div className="p-6">
//                       <div className="uppercase tracking-wide text-xs text-indigo-500 font-semibold">
//                         {post.category}
//                       </div>
//                       <h2 className="block mt-2 text-xl font-semibold text-gray-900 hover:underline">{post.title}</h2>
//                       <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
//                       <div className="mt-6 flex items-center">
//                         <div className="flex-shrink-0">
//                           <img
//                             className="h-8 w-8 rounded-full"
//                             src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
//                             alt={post.author}
//                           />
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-gray-900">{post.author}</p>
//                           <p className="text-xs text-gray-500">{post.date}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="px-4 py-6 sm:px-0">
//               <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
//                 <div className="w-0 flex-1 flex">
//                   <button
//                     onClick={() => paginate(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                 </div>
//                 <div className="hidden md:-mt-px md:flex">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`${
//                         currentPage === number
//                           ? "border-indigo-500 text-indigo-600"
//                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                       } border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium`}
//                     >
//                       {number}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="w-0 flex-1 flex justify-end">
//                   <button
//                     onClick={() => paginate(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </nav>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BlogPage;
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const postsPerPage = 7;

  // Tính toán phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  // Lấy danh sách blog từ API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://6bc4-2405-4802-8132-b860-d454-d4f4-c346-cd13.ngrok-free.app/api/blogs",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch blogs response:", response.data);

        if (Array.isArray(response.data)) {
          // Thêm các trường cần thiết (image, category, excerpt)
          const formattedBlogs = response.data.map((blog) => ({
            id: blog.blogId,
            title: blog.title,
            content: blog.content,
            excerpt:
              blog.content.length > 100
                ? blog.content.substring(0, 100) + "..."
                : blog.content,
            author: blog.author.name,
            date: new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            image:
              blog.images && blog.images.length > 0
                ? blog.images[0].url
                : "/Placeholder.svg", // Lấy hình ảnh từ images[0].url hoặc dùng placeholder
            category: "Blog", // Giá trị mặc định vì API không có category
          }));
          setBlogs(formattedBlogs);
        } else {
          throw new Error(
            "Invalid response format: Expected an array of blogs"
          );
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        if (error.response) {
          console.log("Error response:", error.response.data);
          console.log("Status:", error.response.status);
          if (error.response.status === 404) {
            setError("No blogs found.");
          } else {
            setError(
              error.response.data.message ||
                "Failed to load blogs. Please try again."
            );
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
          setError(
            "Unable to connect to server. CORS issue or server error. Please try again."
          );
        } else {
          setError(error.message || "Failed to load blogs. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Bỏ dependency navigate vì không cần xử lý lỗi 401

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading blogs...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <Link to="/" className="block mt-4 text-[#A10550] underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center text-[#A10550] hover:text-[#8a0443] transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Spa & Wellness Blog
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Featured Post */}
          {currentPosts.length > 0 && (
            <div className="px-4 py-6 sm:px-0">
              <Link to={`/blog/${currentPosts[0].id}`} className="block">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img
                        className="h-48 w-full object-cover md:w-48"
                        src={currentPosts[0].image}
                        alt={currentPosts[0].title}
                      />
                    </div>
                    <div className="p-8">
                      <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        {currentPosts[0].category}
                      </div>
                      <h2 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                        {currentPosts[0].title}
                      </h2>
                      <p className="mt-2 text-gray-500">
                        {currentPosts[0].excerpt}
                      </p>
                      <div className="mt-4 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${currentPosts[0].author}&background=random`}
                            alt={currentPosts[0].author}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {currentPosts[0].author}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentPosts[0].date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Blog Post Grid */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.slice(1).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="block">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                    <img
                      className="h-48 w-full object-cover"
                      src={post.image}
                      alt={post.title}
                    />
                    <div className="p-6">
                      <div className="uppercase tracking-wide text-xs text-indigo-500 font-semibold">
                        {post.category}
                      </div>
                      <h2 className="block mt-2 text-xl font-semibold text-gray-900 hover:underline">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-base text-gray-500">
                        {post.excerpt}
                      </p>
                      <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                            alt={post.author}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {post.author}
                          </p>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-6 sm:px-0">
              <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
                <div className="w-0 flex-1 flex">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                </div>
                <div className="hidden md:-mt-px md:flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`${
                          currentPage === number
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium`}
                      >
                        {number}
                      </button>
                    )
                  )}
                </div>
                <div className="w-0 flex-1 flex justify-end">
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
