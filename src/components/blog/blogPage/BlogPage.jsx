<<<<<<< HEAD
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
//           "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/blogs",
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
//                             src={`https://ui-avatars.comhttps://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/?name=${currentPosts[0].author}&background=random`}
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
//                             src={`https://ui-avatars.comhttps://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/?name=${post.author}&background=random`}
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

=======
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Calendar, User, ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import axios from "axios";

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const postsPerPage = 6;

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/blogs",
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          // Format blog data
          const formattedBlogs = response.data.map((blog) => ({
            id: blog.blogId,
            title: blog.title,
            content: blog.content,
<<<<<<< HEAD
            excerpt:
              blog.content.length > 100
                ? blog.content.substring(0, 100) + "..."
                : blog.content,
            author: blog.author.name,
=======
            excerpt: blog.content.length > 150 ? blog.content.substring(0, 150) + "..." : blog.content,
            author: blog.author.name,
            authorImage: `https://ui-avatars.com/api/?name=${blog.author.name}&background=A10550&color=fff`,
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
            date: new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
<<<<<<< HEAD
            image:
              blog.images && blog.images.length > 0
                ? blog.images[0].url
                : "/Placeholder.svg", // Lấy hình ảnh từ images[0].url hoặc dùng placeholder
            category: "Blog", // Giá trị mặc định vì API không có category
=======
            readTime: `${Math.max(Math.ceil(blog.content.length / 1000), 1)} min read`,
            image: blog.images && blog.images.length > 0
              ? blog.images[0].url
              : "/placeholder.svg?height=400&width=600",
            // Randomly assign categories for demo purposes
            category: ["Skincare", "Beauty Tips", "Wellness", "Treatments", "Lifestyle"][
              Math.floor(Math.random() * 5)
            ],
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
          }));
          
          setBlogs(formattedBlogs);
          setFilteredBlogs(formattedBlogs);
        } else {
          throw new Error(
            "Invalid response format: Expected an array of blogs"
          );
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
<<<<<<< HEAD
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
=======
        setError(
          error.response?.data?.message || 
          "Failed to load blogs. Please try again."
        );
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search term and category
  useEffect(() => {
    let results = blogs;
    
    if (searchTerm) {
      results = results.filter(
        blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      results = results.filter(blog => blog.category === selectedCategory);
    }
    
    setFilteredBlogs(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, blogs]);

  // Get unique categories from blogs
  const categories = ["All", ...new Set(blogs.map(blog => blog.category))];
  
  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFeaturedPost = () => {
    return filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  };

  if (loading) {
<<<<<<< HEAD
    return (
      <div className="text-center py-8 text-gray-600">Loading blogs...</div>
    );
  }

  if (error) {
=======
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
    return (
      <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#A10550] border-b-[#A10550] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  const featuredPost = getFeaturedPost();

  return (
<<<<<<< HEAD
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
                            src={`https://ui-avatars.comhttps://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/?name=${currentPosts[0].author}&background=random`}
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
                            src={`https://ui-avatars.comhttps://9358-2405-4802-8132-b860-515c-16f5-676c-488e.ngrok-free.app/api/?name=${post.author}&background=random`}
                            alt={post.author}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {post.author}
                          </p>
                          <p className="text-xs text-gray-500">{post.date}</p>
=======
    <div className="min-h-screen w-full h-auto bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-auto bg-[#A10550] text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D021E] to-[#A10550] opacity-90"></div>
        <div className="relative max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 md:mr-8 w-full md:w-auto">
              <Link
                to="/"
                className="inline-flex items-center text-white hover:text-pink-200 transition-colors mb-6"
              >
                <ArrowLeft className="mr-2" size={20} />
                <span className="font-medium">Back to Home</span>
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Beauty & Wellness Blog
              </h1>
              <p className="text-xl text-pink-100 max-w-2xl">
                Discover the latest skincare tips, beauty trends, and wellness advice from our experts
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 px-4 py-3 pl-12 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-pink-200 border border-pink-300/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search className="absolute left-4 top-3.5 text-pink-200" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b w-full h-auto">
        <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 mx-2 first:ml-0 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#A10550] text-white"
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
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No articles found</h2>
            <p className="text-gray-500 mb-8">Try adjusting your search or filter to find what you're looking for</p>
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
            {/* Featured Post */}
            {featuredPost && currentPage === 1 && (
              <div className="mb-16 w-full h-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Featured Article</h2>
                <Link to={`/blog/${featuredPost.id}`} className="block w-full h-auto">
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
                            <p className="font-medium text-gray-900">{featuredPost.author}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              <span className="mr-3">{featuredPost.date}</span>
                              <Clock size={14} className="mr-1" />
                              <span>{featuredPost.readTime}</span>
                            </div>
                          </div>
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Blog Grid */}
            <div className="mb-12 w-full h-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {selectedCategory === "All" ? "All Articles" : selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post, index) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full w-full"
                  >
<<<<<<< HEAD
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
=======
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#A10550]">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col w-full h-auto">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#A10550] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center mt-auto">
                        <img
                          src={post.authorImage || "/placeholder.svg"}
                          alt={post.author}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{post.author}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar size={12} className="mr-1" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
>>>>>>> 710d75bb43befc20ae257bed1defaf1e5a9f7379
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 w-full h-auto">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                      // Show current page, first, last, and adjacent pages
                      if (
                        number === 1 ||
                        number === totalPages ||
                        (number >= currentPage - 1 && number <= currentPage + 1)
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
                      
                      // Show ellipsis for gaps
                      if (
                        (number === 2 && currentPage > 3) ||
                        (number === totalPages - 1 && currentPage < totalPages - 2)
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
                    })}
                  </div>
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-[#3D021E] to-[#A10550] text-white py-16 w-full h-auto">
        <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive skincare tips, special offers, and the latest beauty trends
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full h-auto"
            />
            <button
              type="submit"
              className="bg-white text-[#A10550] px-6 py-3 rounded-lg font-medium hover:bg-pink-100 transition-colors w-full sm:w-auto h-auto"
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
