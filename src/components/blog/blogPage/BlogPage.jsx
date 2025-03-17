// "use client";

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Search,
//   Calendar,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import axios from "axios";

// const BlogPage = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const postsPerPage = 6;

//   // Fetch blogs from API
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "https://9c6d-2405-4802-811e-11a0-9cec-41b0-ca2f-57a6.ngrok-free.app/api/blogs",
//           {
//             headers: {
//               "ngrok-skip-browser-warning": "true",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (Array.isArray(response.data)) {
//           // Format blog data
//           const formattedBlogs = response.data.map((blog) => ({
//             id: blog.blogId,
//             title: blog.title,
//             content: blog.content,
//             excerpt:
//               blog.content.length > 150
//                 ? blog.content.substring(0, 150) + "..."
//                 : blog.content,
//             author: blog.author?.name || "Unknown Author",
//             authorImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
//               blog.author?.name || "Unknown"
//             )}&background=A10550&color=fff`,
//             date: new Date(blog.createdAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             }),
//             image:
//               blog.images && blog.images.length > 0
//                 ? blog.images[0].url
//                 : "/placeholder.svg?height=400&width=600",
//             category:
//               blog.category ||
//               [
//                 "Skincare",
//                 "Beauty Tips",
//                 "Wellness",
//                 "Treatments",
//                 "Lifestyle",
//               ][Math.floor(Math.random() * 5)],
//             readTime: `${Math.max(
//               Math.ceil(blog.content.length / 1000),
//               1
//             )} min read`,
//           }));
//           setBlogs(formattedBlogs);
//           setFilteredBlogs(formattedBlogs);
//         } else {
//           throw new Error(
//             "Invalid response format: Expected an array of blogs"
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//         if (error.response) {
//           console.log("Error response:", error.response.data);
//           console.log("Status:", error.response.status);
//           if (error.response.status === 404) {
//             setError("No blogs found.");
//           } else {
//             setError(
//               error.response.data.message ||
//                 "Failed to load blogs. Please try again."
//             );
//           }
//         } else if (error.request) {
//           console.log("No response received:", error.request);
//           setError(
//             "Unable to connect to server. CORS issue or server error. Please try again."
//           );
//         } else {
//           setError(error.message || "Failed to load blogs. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   // Filter blogs based on search term and category
//   useEffect(() => {
//     let results = blogs;
//     if (searchTerm) {
//       results = results.filter(
//         (blog) =>
//           blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           blog.content.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (selectedCategory !== "All") {
//       results = results.filter((blog) => blog.category === selectedCategory);
//     }
//     setFilteredBlogs(results);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [searchTerm, selectedCategory, blogs]);

//   // Get unique categories from blogs
//   const categories = ["All", ...new Set(blogs.map((blog) => blog.category))];

//   // Pagination logic
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
//   const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const getFeaturedPost = () =>
//     filteredBlogs.length > 0 ? filteredBlogs[0] : null;

//   const featuredPost = getFeaturedPost();

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-t-[#A10550] border-b-[#A10550] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading amazing content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
//           <div className="w-16 h-16 mx-auto mb-4 text-red-500">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-16 h-16"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <Link
//             to="/"
//             className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium"
//           >
//             Return to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full h-auto bg-gray-50">
//       {/* Hero Section */}
//       <div className="relative w-full h-auto bg-[#A10550] text-white">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#3D021E] to-[#A10550] opacity-90"></div>
//         <div className="relative max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-8 md:mb-0 md:mr-8 w-full md:w-auto">
//               <Link
//                 to="/"
//                 className="inline-flex items-center text-white hover:text-pink-200 transition-colors mb-6"
//               >
//                 <ArrowLeft className="mr-2" size={20} />
//                 <span className="font-medium">Back to Home</span>
//               </Link>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
//                 Beauty & Wellness Blog
//               </h1>
//               <p className="text-xl text-pink-100 max-w-2xl">
//                 Discover the latest skincare tips, beauty trends, and wellness
//                 advice from our experts
//               </p>
//             </div>
//             <div className="w-full md:w-auto">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search articles..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full md:w-80 px-4 py-3 pl-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-pink-200 border border-pink-300/30 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 />
//                 <Search
//                   className="absolute left-4 top-3.5 text-pink-200"
//                   size={18}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Category Filter */}
//       <div className="bg-white border-b w-full h-auto">
//         <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex overflow-x-auto py-4 scrollbar-hide">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`px-4 py-2 mx-2 first:ml-0 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
//                   selectedCategory === category
//                     ? "bg-[#A10550] text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <main className="max-w-[1920px] w-full h-auto mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {filteredBlogs.length === 0 ? (
//           <div className="text-center py-16 w-full h-auto">
//             <h2 className="text-2xl font-bold text-gray-700 mb-4">
//               No articles found
//             </h2>
//             <p className="text-gray-500 mb-8">
//               Try adjusting your search or filter to find what you're looking
//               for
//             </p>
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedCategory("All");
//               }}
//               className="px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Featured Post */}
//             {featuredPost && currentPage === 1 && (
//               <div className="mb-16 w-full h-auto">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-8">
//                   Featured Article
//                 </h2>
//                 <Link
//                   to={`/blog/${featuredPost.id}`}
//                   className="block w-full h-auto"
//                 >
//                   <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full h-auto">
//                     <div className="md:flex">
//                       <div className="md:w-1/2 h-64 md:h-auto">
//                         <img
//                           src={featuredPost.image || "/placeholder.svg"}
//                           alt={featuredPost.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
//                         <div>
//                           <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-[#A10550] mb-4">
//                             {featuredPost.category}
//                           </span>
//                           <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 hover:text-[#A10550] transition-colors">
//                             {featuredPost.title}
//                           </h3>
//                           <p className="text-gray-600 mb-6 line-clamp-3">
//                             {featuredPost.excerpt}
//                           </p>
//                         </div>
//                         <div className="flex items-center">
//                           <img
//                             src={featuredPost.authorImage || "/placeholder.svg"}
//                             alt={featuredPost.author}
//                             className="w-10 h-10 rounded-full mr-4"
//                           />
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {featuredPost.author}
//                             </p>
//                             <div className="flex items-center text-sm text-gray-500">
//                               <Calendar size={14} className="mr-1" />
//                               <span className="mr-3">{featuredPost.date}</span>
//                               <Clock size={14} className="mr-1" />
//                               <span>{featuredPost.readTime}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             )}

//             {/* Blog Grid */}
//             <div className="mb-12 w-full h-auto">
//               <h2 className="text-2xl font-bold text-gray-800 mb-8">
//                 {selectedCategory === "All" ? "All Articles" : selectedCategory}
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {currentPosts.map(
//                   (post, index) =>
//                     index > 0 && (
//                       <Link
//                         key={post.id}
//                         to={`/blog/${post.id}`}
//                         className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full w-full"
//                       >
//                         <div className="relative h-48 w-full overflow-hidden">
//                           <img
//                             src={post.image || "/placeholder.svg"}
//                             alt={post.title}
//                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                           />
//                           <div className="absolute top-4 left-4">
//                             <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#A10550]">
//                               {post.category}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="p-6 flex-grow flex flex-col w-full h-auto">
//                           <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#A10550] transition-colors">
//                             {post.title}
//                           </h3>
//                           <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
//                             {post.excerpt}
//                           </p>
//                           <div className="flex items-center mt-auto">
//                             <img
//                               src={post.authorImage || "/placeholder.svg"}
//                               alt={post.author}
//                               className="w-8 h-8 rounded-full mr-3"
//                             />
//                             <div>
//                               <p className="font-medium text-gray-900 text-sm">
//                                 {post.author}
//                               </p>
//                               <div className="flex items-center text-xs text-gray-500">
//                                 <Calendar size={12} className="mr-1" />
//                                 <span>{post.date}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </Link>
//                     )
//                 )}
//               </div>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-12 w-full h-auto">
//                 <nav className="flex items-center space-x-2">
//                   <button
//                     onClick={() => paginate(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <ChevronLeft size={20} />
//                   </button>
//                   <div className="flex space-x-1">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (number) => {
//                         if (
//                           number === 1 ||
//                           number === totalPages ||
//                           (number >= currentPage - 1 &&
//                             number <= currentPage + 1)
//                         ) {
//                           return (
//                             <button
//                               key={number}
//                               onClick={() => paginate(number)}
//                               className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
//                                 currentPage === number
//                                   ? "bg-[#A10550] text-white"
//                                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
//                               }`}
//                             >
//                               {number}
//                             </button>
//                           );
//                         }
//                         if (
//                           (number === 2 && currentPage > 3) ||
//                           (number === totalPages - 1 &&
//                             currentPage < totalPages - 2)
//                         ) {
//                           return (
//                             <span
//                               key={number}
//                               className="w-10 h-10 flex items-center justify-center text-gray-500"
//                             >
//                               ...
//                             </span>
//                           );
//                         }
//                         return null;
//                       }
//                     )}
//                   </div>
//                   <button
//                     onClick={() =>
//                       paginate(Math.min(totalPages, currentPage + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <ChevronRight size={20} />
//                   </button>
//                 </nav>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       {/* Newsletter Section */}
//       <section className="bg-gradient-to-r from-[#3D021E] to-[#A10550] text-white py-16 w-full h-auto">
//         <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
//           <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
//             Subscribe to our newsletter for exclusive skincare tips, special
//             offers, and the latest beauty trends
//           </p>
//           <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full h-auto"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-white text-[#A10550] px-6 py-3 rounded-lg font-medium hover:bg-pink-100 transition-colors w-full sm:w-auto h-auto"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default BlogPage;

"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { staticBlogs } from "../../../data/blog/staticBlogs";
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const postsPerPage = 7;

  // Khởi tạo dữ liệu tĩnh
  useEffect(() => {
    setBlogs(staticBlogs);
    setFilteredBlogs(staticBlogs);
  }, []);

  // Filter blogs based on search term and category
  useEffect(() => {
    let results = staticBlogs;
    if (searchTerm) {
      results = results.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.sections.some((section) =>
            section.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (selectedCategory !== "All") {
      results = results.filter((blog) => blog.category === selectedCategory);
    }
    setFilteredBlogs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory]);

  // Get unique categories from blogs
  const categories = [
    "All",
    ...new Set(staticBlogs.map((blog) => blog.category)),
  ];

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFeaturedPost = () =>
    filteredBlogs.length > 0 ? filteredBlogs[0] : null;

  const featuredPost = getFeaturedPost();

  if (error) {
    return (
      <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full h-auto bg-gray-50 font-sans">
      {/* Hero Section with Enhanced Design */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-[#3D021E] to-[#A10550] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/spa-hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex items-center">
          <div className="w-full md:w-2/3">
            <Link
              to="/"
              className="inline-flex items-center text-white hover:text-pink-200 transition-colors mb-6"
            >
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
              Spa & Wellness Blog
            </h1>
            <p className="text-xl text-pink-100 max-w-2xl leading-relaxed">
              Explore expert tips on spa treatments, skincare, and wellness to
              enhance your self-care routine.
            </p>
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search spa articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-3 pl-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-pink-200 border border-pink-300/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              />
              <Search
                className="absolute left-4 top-3.5 text-pink-200"
                size={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter with Improved Styling */}
      <div className="bg-white border-b w-full h-auto shadow-sm">
        <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-6 scrollbar-hide space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 mx-1 first:ml-0 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#A10550] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-[1920px] w-full h-auto mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 w-full h-auto">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              No articles found
            </h2>
            <p className="text-gray-500 mb-8">
              Try adjusting your search or filter to find what you're looking
              for
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post with Enhanced Design */}
            {featuredPost && currentPage === 1 && (
              <div className="mb-16 w-full h-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                  Featured Article
                </h2>
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="block w-full h-auto"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full h-auto">
                    <div className="md:flex">
                      <div className="md:w-1/2 h-64 md:h-auto">
                        <img
                          src={featuredPost.image || "/placeholder.svg"}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-[#A10550] mb-4">
                            {featuredPost.category}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 hover:text-[#A10550] transition-colors">
                            {featuredPost.title}
                          </h3>
                          <p className="text-gray-600 mb-6 line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <img
                            src={featuredPost.authorImage || "/placeholder.svg"}
                            alt={featuredPost.author}
                            className="w-10 h-10 rounded-full mr-4"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {featuredPost.author}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              <span className="mr-3">{featuredPost.date}</span>
                              <Clock size={14} className="mr-1" />
                              <span>{featuredPost.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Blog Grid with Enhanced Styling */}
            <div className="mb-12 w-full h-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-[#A10550] pb-2 w-fit">
                {selectedCategory === "All" ? "All Articles" : selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map(
                  (post, index) =>
                    index > 0 && (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
                            <span className="text-xs font-semibold text-[#A10550]">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#A10550] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center mt-auto">
                            <img
                              src={post.authorImage || "/placeholder.svg"}
                              alt={post.author}
                              className="w-8 h-8 rounded-full mr-3 border-2 border-[#A10550]"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {post.author}
                              </p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar size={12} className="mr-1" />
                                <span>{post.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                )}
              </div>
            </div>

            {/* Pagination with Enhanced Design */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 w-full h-auto">
                <nav className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => {
                        if (
                          number === 1 ||
                          number === totalPages ||
                          (number >= currentPage - 1 &&
                            number <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                currentPage === number
                                  ? "bg-[#A10550] text-white"
                                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                              }`}
                            >
                              {number}
                            </button>
                          );
                        }
                        if (
                          (number === 2 && currentPage > 3) ||
                          (number === totalPages - 1 &&
                            currentPage < totalPages - 2)
                        ) {
                          return (
                            <span
                              key={number}
                              className="w-10 h-10 flex items-center justify-center text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>
                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>

      {/* Newsletter Section with Enhanced Design */}
      <section className="bg-gradient-to-r from-[#3D021E] to-[#A10550] text-white py-16 w-full h-auto">
        <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">
            Stay Updated
          </h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our newsletter for exclusive spa tips, special offers,
            and the latest wellness trends.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 text-white placeholder-pink-200 border border-pink-300/30 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="bg-white text-[#A10550] px-6 py-3 rounded-lg font-medium hover:bg-pink-100 transition-colors shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
