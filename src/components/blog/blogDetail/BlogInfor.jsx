// import { useState, useEffect, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Calendar,
//   User,
//   Clock,
//   Share2,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Link2,
//   ChevronUp,
//   MessageCircle,
//   Heart,
//   Bookmark,
// } from "lucide-react";
// import axios from "axios";

// const BlogDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [showShareOptions, setShowShareOptions] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const contentRef = useRef(null);

//   useEffect(() => {
//     const fetchBlogDetail = async () => {
//       try {
//         setLoading(true);
//         // const token = localStorage.getItem("token");
//         const headers = {
//           "ngrok-skip-browser-warning": "true",
//           "Content-Type": "application/json",
//           // Authorization: token ? `Bearer ${token}` : undefined,
//         };

//         const response = await axios.get(
//           `https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/blogs/${id}`,
//           { headers }
//         );

//         const blogData = response.data;
//         const formattedBlog = {
//           id: blogData.blogId,
//           title: blogData.title,
//           content: blogData.content,
//           author: blogData.author.name,
//           authorRole: "Beauty Expert",
//           authorImage: `https://ui-avatars.com/api/?name=${blogData.author.name}&background=A10550&color=fff`,
//           date: new Date(blogData.createdAt).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }),
//           image:
//             blogData.images && blogData.images.length > 0
//               ? blogData.images[0].url
//               : "/placeholder.svg?height=600&width=1200",
//           category: [
//             "Skincare",
//             "Beauty Tips",
//             "Wellness",
//             "Treatments",
//             "Lifestyle",
//           ][Math.floor(Math.random() * 5)],
//           readTime: `${Math.max(
//             Math.ceil(blogData.content.length / 1000),
//             1
//           )} min read`,
//         };

//         setBlog(formattedBlog);
//         setLikeCount(Math.floor(Math.random() * 50) + 10);
//         fetchRelatedPosts();
//       } catch (error) {
//         console.error("Error fetching blog detail:", error);
//         if (error.response) {
//           console.log("Error response:", error.response.data);
//           console.log("Status:", error.response.status);
//           if (error.response.status === 401) {
//             setError("Unauthorized: Please login again.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 2000);
//           } else if (error.response.status === 404) {
//             setError("Blog post not found.");
//           } else {
//             setError(
//               error.response.data.message ||
//                 "Failed to load blog post. Please try again."
//             );
//           }
//         } else if (error.request) {
//           console.log("No response received:", error.request);
//           setError(
//             "Unable to connect to server. CORS issue or server error. Please try again."
//           );
//         } else {
//           setError(
//             error.message || "Failed to load blog post. Please try again."
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchRelatedPosts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const headers = {
//           "ngrok-skip-browser-warning": "true",
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : undefined,
//         };

//         const response = await axios.get(
//           "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/blogs",
//           { headers }
//         );

//         if (Array.isArray(response.data)) {
//           const otherPosts = response.data
//             .filter((post) => post.blogId.toString() !== id)
//             .slice(0, 3);
//           const formattedPosts = otherPosts.map((post) => ({
//             id: post.blogId,
//             title: post.title,
//             excerpt:
//               post.content.length > 100
//                 ? post.content.substring(0, 100) + "..."
//                 : post.content,
//             author: post.author.name,
//             date: new Date(post.createdAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             }),
//             image:
//               post.images && post.images.length > 0
//                 ? post.images[0].url
//                 : "/placeholder.svg?height=200&width=300",
//             category: [
//               "Skincare",
//               "Beauty Tips",
//               "Wellness",
//               "Treatments",
//               "Lifestyle",
//             ][Math.floor(Math.random() * 5)],
//           }));
//           setRelatedPosts(formattedPosts);
//         }
//       } catch (error) {
//         console.error("Error fetching related posts:", error);
//       }
//     };

//     fetchBlogDetail();
//     window.scrollTo(0, 0);
//   }, [id, navigate]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 300);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleShare = (platform) => {
//     const url = window.location.href;
//     const title = blog?.title || "Check out this blog post";
//     let shareUrl;

//     switch (platform) {
//       case "facebook":
//         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//           url
//         )}`;
//         break;
//       case "twitter":
//         shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
//           url
//         )}&text=${encodeURIComponent(title)}`;
//         break;
//       case "linkedin":
//         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
//           url
//         )}`;
//         break;
//       case "copy":
//         navigator.clipboard.writeText(url);
//         alert("Link copied to clipboard!");
//         return;
//       default:
//         return;
//     }

//     window.open(shareUrl, "_blank", "width=600,height=400");
//   };

//   const handleLike = () => {
//     setLiked(!liked);
//     setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
//   };

//   const formatContent = (content) => {
//     if (!content) return [];
//     const paragraphs = content.split("\n\n");
//     return paragraphs.map((paragraph, index) => {
//       if (index > 0 && index % 3 === 0 && paragraph.length < 100) {
//         return { type: "heading", content: paragraph };
//       }
//       return { type: "paragraph", content: paragraph };
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-t-[#A10550] border-b-[#A10550] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading article...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="min-h-screen w-full h-auto bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
//           <div className="w-16 h-16 mx-auto mb-4 text-red-500">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <p className="text-gray-600 mb-6">{error || "Blog post not found"}</p>
//           <Link
//             to="/blog"
//             className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium"
//           >
//             Back to Blog
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const formattedContent = formatContent(blog.content);

//   return (
//     <div className="bg-gray-100 min-h-screen pb-12">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <Link
//               to="/blog"
//               className="flex items-center text-[#A10550] hover:text-[#8a0443] transition-colors"
//             >
//               <ArrowLeft className="mr-2" size={20} />
//               <span className="font-medium">Back to Blog</span>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <div className="relative w-full h-[50vh] md:h-[60vh]">
//         <div className="absolute inset-0">
//           <img
//             src={blog.image || "/placeholder.svg"}
//             alt={blog.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
//         </div>

//         <div className="relative h-full max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
//           <Link
//             to="/blog"
//             className="inline-flex items-center text-white hover:text-pink-200 transition-colors mb-6"
//           >
//             <ArrowLeft className="mr-2" size={20} />
//             <span className="font-medium">Back to Blog</span>
//           </Link>

//           <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white mb-4 w-fit">
//             {blog.category}
//           </span>

//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl">
//             {blog.title}
//           </h1>

//           <div className="flex items-center">
//             <img
//               src={blog.authorImage || "/placeholder.svg"}
//               alt={blog.author}
//               className="w-12 h-12 rounded-full mr-4 border-2 border-white"
//             />
//             <div className="text-white">
//               <p className="font-medium">{blog.author}</p>
//               <div className="flex items-center text-sm text-white/80">
//                 <Calendar size={14} className="mr-1" />
//                 <span className="mr-3">{blog.date}</span>
//                 <Clock size={14} className="mr-1" />
//                 <span>{blog.readTime}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* Article Content */}
//           <div className="lg:col-span-2">
//             <div
//               className="bg-white rounded-2xl shadow-md p-8 md:p-12 w-full h-auto"
//               ref={contentRef}
//             >
//               {/* Social Sharing */}
//               <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100 w-full">
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={handleLike}
//                     className={`flex items-center space-x-1 ${
//                       liked ? "text-[#A10550]" : "text-gray-500"
//                     } hover:text-[#A10550] transition-colors`}
//                   >
//                     <Heart
//                       className={liked ? "fill-[#A10550]" : ""}
//                       size={20}
//                     />
//                     <span>{likeCount}</span>
//                   </button>
//                   <button className="flex items-center space-x-1 text-gray-500 hover:text-[#A10550] transition-colors">
//                     <MessageCircle size={20} />
//                     <span>Comments</span>
//                   </button>
//                 </div>

//                 <div className="relative">
//                   <button
//                     onClick={() => setShowShareOptions(!showShareOptions)}
//                     className="flex items-center space-x-1 text-gray-500 hover:text-[#A10550] transition-colors"
//                   >
//                     <Share2 size={20} />
//                     <span>Share</span>
//                   </button>

//                   {showShareOptions && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
//                       <button
//                         onClick={() => handleShare("facebook")}
//                         className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
//                       >
//                         <Facebook size={18} className="mr-2 text-blue-600" />
//                         <span>Facebook</span>
//                       </button>
//                       <button
//                         onClick={() => handleShare("twitter")}
//                         className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
//                       >
//                         <Twitter size={18} className="mr-2 text-blue-400" />
//                         <span>Twitter</span>
//                       </button>
//                       <button
//                         onClick={() => handleShare("linkedin")}
//                         className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
//                       >
//                         <Linkedin size={18} className="mr-2 text-blue-700" />
//                         <span>LinkedIn</span>
//                       </button>
//                       <button
//                         onClick={() => handleShare("copy")}
//                         className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
//                       >
//                         <Link2 size={18} className="mr-2 text-gray-600" />
//                         <span>Copy Link</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Article Body */}
//               <div className="prose prose-lg max-w-none w-full h-auto">
//                 {formattedContent.map((item, index) => {
//                   if (item.type === "heading") {
//                     return (
//                       <h2
//                         key={index}
//                         className="text-2xl font-bold text-gray-800 mt-8 mb-4"
//                       >
//                         {item.content}
//                       </h2>
//                     );
//                   } else {
//                     return (
//                       <p
//                         key={index}
//                         className="mb-6 text-gray-700 leading-relaxed"
//                       >
//                         {item.content}
//                       </p>
//                     );
//                   }
//                 })}
//               </div>

//               {/* Tags */}
//               <div className="mt-12 pt-8 border-t border-gray-100 w-full h-auto">
//                 <div className="flex flex-wrap gap-2">
//                   <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//                     {blog.category}
//                   </span>
//                   <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//                     Beauty
//                   </span>
//                   <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//                     Skincare
//                   </span>
//                 </div>
//               </div>

//               {/* Author Bio */}
//               <div className="mt-12 p-6 bg-gray-50 rounded-xl w-full h-auto">
//                 <div className="flex items-start">
//                   <img
//                     src={blog.authorImage || "/placeholder.svg"}
//                     alt={blog.author}
//                     className="w-16 h-16 rounded-full mr-6"
//                   />
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-1">
//                       {blog.author}
//                     </h3>
//                     <p className="text-gray-600 mb-4">{blog.authorRole}</p>
//                     <p className="text-gray-700">
//                       A passionate beauty expert with years of experience in the
//                       skincare industry. Dedicated to helping clients achieve
//                       their best skin through personalized treatments and
//                       advice.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Comments Section */}
//             <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mt-8 w-full h-auto">
//               <h3 className="text-2xl font-bold text-gray-800 mb-6">
//                 Comments
//               </h3>

//               {/* Comment Form */}
//               <div className="mb-8 w-full h-auto">
//                 <textarea
//                   placeholder="Leave a comment..."
//                   className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A10550] focus:border-transparent"
//                   rows={4}
//                 ></textarea>
//                 <button className="mt-4 px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors">
//                   Post Comment
//                 </button>
//               </div>

//               {/* Sample Comments */}
//               <div className="space-y-6 w-full h-auto">
//                 <div className="border-b border-gray-100 pb-6">
//                   <div className="flex items-start">
//                     <img
//                       src="https://ui-avatars.com/api/?name=Jane+Doe&background=A10550&color=fff"
//                       alt="Jane Doe"
//                       className="w-10 h-10 rounded-full mr-4"
//                     />
//                     <div>
//                       <div className="flex items-center mb-1">
//                         <h4 className="font-bold text-gray-800 mr-2">
//                           Jane Doe
//                         </h4>
//                         <span className="text-sm text-gray-500">
//                           2 days ago
//                         </span>
//                       </div>
//                       <p className="text-gray-700">
//                         This article was so helpful! I've been struggling with
//                         my skincare routine and these tips are exactly what I
//                         needed.
//                       </p>
//                       <div className="mt-2 flex items-center space-x-4">
//                         <button className="text-sm text-gray-500 hover:text-[#A10550]">
//                           Reply
//                         </button>
//                         <button className="text-sm text-gray-500 hover:text-[#A10550] flex items-center">
//                           <Heart size={14} className="mr-1" /> 3
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-start">
//                     <img
//                       src="https://ui-avatars.com/api/?name=John+Smith&background=A10550&color=fff"
//                       alt="John Smith"
//                       className="w-10 h-10 rounded-full mr-4"
//                     />
//                     <div>
//                       <div className="flex items-center mb-1">
//                         <h4 className="font-bold text-gray-800 mr-2">
//                           John Smith
//                         </h4>
//                         <span className="text-sm text-gray-500">
//                           1 week ago
//                         </span>
//                       </div>
//                       <p className="text-gray-700">
//                         I've been using these products for a month now and have
//                         seen amazing results. Would recommend to anyone!
//                       </p>
//                       <div className="mt-2 flex items-center space-x-4">
//                         <button className="text-sm text-gray-500 hover:text-[#A10550]">
//                           Reply
//                         </button>
//                         <button className="text-sm text-gray-500 hover:text-[#A10550] flex items-center">
//                           <Heart size={14} className="mr-1" /> 5
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             {/* Bookmark Button */}
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full h-auto">
//               <button
//                 onClick={() => setBookmarked(!bookmarked)}
//                 className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-[#A10550] rounded-lg font-medium transition-colors"
//                 style={{
//                   backgroundColor: bookmarked ? "#A10550" : "white",
//                   color: bookmarked ? "white" : "#A10550",
//                 }}
//               >
//                 <Bookmark
//                   className={bookmarked ? "fill-white" : ""}
//                   size={18}
//                 />
//                 <span>
//                   {bookmarked ? "Bookmarked" : "Bookmark This Article"}
//                 </span>
//               </button>
//             </div>

//             {/* Related Posts */}
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full h-auto">
//               <h3 className="text-xl font-bold text-gray-800 mb-6">
//                 Related Articles
//               </h3>
//               <div className="space-y-6">
//                 {relatedPosts.map((post) => (
//                   <Link
//                     key={post.id}
//                     to={`/blog/${post.id}`}
//                     className="block group"
//                   >
//                     <div className="flex items-start">
//                       <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-4">
//                         <img
//                           src={post.image || "/placeholder.svg"}
//                           alt={post.title}
//                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                         />
//                       </div>
//                       <div>
//                         <h4 className="font-medium text-gray-800 group-hover:text-[#A10550] transition-colors line-clamp-2">
//                           {post.title}
//                         </h4>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {post.date}
//                         </p>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Categories */}
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full h-auto">
//               <h3 className="text-xl font-bold text-gray-800 mb-6">
//                 Categories
//               </h3>
//               <div className="space-y-2">
//                 <Link
//                   to="/blog?category=Skincare"
//                   className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
//                 >
//                   Skincare
//                 </Link>
//                 <Link
//                   to="/blog?category=Beauty Tips"
//                   className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
//                 >
//                   Beauty Tips
//                 </Link>
//                 <Link
//                   to="/blog?category=Wellness"
//                   className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
//                 >
//                   Wellness
//                 </Link>
//                 <Link
//                   to="/blog?category=Treatments"
//                   className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
//                 >
//                   Treatments
//                 </Link>
//                 <Link
//                   to="/blog?category=Lifestyle"
//                   className="block py-2 px-4 hover:bg-gray-50 rounded-lg"
//                 >
//                   Lifestyle
//                 </Link>
//               </div>
//             </div>

//             {/* Newsletter */}
//             <div className="bg-gradient-to-r from-[#3D021E] to-[#A10550] text-white rounded-xl shadow-md p-6 w-full h-auto">
//               <h3 className="text-xl font-bold mb-4">
//                 Subscribe to Our Newsletter
//               </h3>
//               <p className="text-white/90 mb-6">
//                 Get the latest beauty tips and exclusive offers delivered to
//                 your inbox
//               </p>
//               <form>
//                 <input
//                   type="email"
//                   placeholder="Your email address"
//                   className="w-full px-4 py-3 rounded-lg mb-4 focus:outline-none"
//                 />
//                 <button
//                   type="submit"
//                   className="w-full bg-white text-[#A10550] px-4 py-3 rounded-lg font-medium hover:bg-pink-100 transition-colors"
//                 >
//                   Subscribe
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Scroll to Top Button */}
//       {showScrollTop && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-8 right-8 bg-[#A10550] text-white p-3 rounded-full shadow-lg hover:bg-[#8a0443] transition-colors"
//           aria-label="Scroll to top"
//         >
//           <ChevronUp size={24} />
//         </button>
//       )}
//     </div>
//   );
// };

// export default BlogDetail;

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { staticBlogs } from "../../../data/blog/staticBlogs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ChevronUp,
  MessageCircle,
  Heart,
  Bookmark,
} from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchBlogDetail = () => {
      setLoading(true);
      const foundBlog = staticBlogs.find((b) => b.id === parseInt(id));
      if (foundBlog) {
        setBlog(foundBlog);
        setLikeCount(Math.floor(Math.random() * 50) + 10);
        setRelatedPosts(
          staticBlogs.filter((b) => b.id !== parseInt(id)).slice(0, 3)
        );
      } else {
        setError("Blog post not found.");
      }
      setLoading(false);
    };

    fetchBlogDetail();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || "Check out this blog post";
    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#A10550] border-b-[#A10550] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="relative w-16 h-16 mx-auto mb-4 overflow-hidden">
            <img
              src={staticBlogs[0]?.image || "/placeholder.svg"} // Sử dụng hình ảnh từ bài viết đầu tiên
              alt="Error"
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <p className="text-gray-600 mb-6">{error || "Blog post not found"}</p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-[#A10550] text-white rounded-lg hover:bg-[#8a0443] transition-colors duration-300 font-medium"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-12 font-sans">
      {/* Header Section */}
      <header className="bg-[#1C2526] text-white shadow-md fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-[#F06292] font-bold text-xl">
            BEAUTYA
          </Link>
          <nav className="flex space-x-6">
            <Link to="/" className="hover:text-[#F06292] transition-colors">
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-[#F06292] transition-colors"
            >
              About
            </Link>
            <Link to="/blog" className="hover:text-[#F06292] transition-colors">
              Blog
            </Link>
            <Link
              to="/specialist"
              className="hover:text-[#F06292] transition-colors"
            >
              Specialist
            </Link>
            <Link
              to="/services"
              className="hover:text-[#F06292] transition-colors"
            >
              Services
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] mt-16">
        <div className="absolute inset-0">
          <img
            src={blog.image} // Lấy trực tiếp từ blog.image
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 text-white">
          <Link
            to="/blog"
            className="inline-flex items-center hover:text-pink-200 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2" size={20} />
            <span className="font-medium">Back to Blog</span>
          </Link>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm mb-4">
            {blog.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl">
            {blog.content.h1}
          </h1>
          <div className="flex items-center">
            <img
              src={blog.authorImage || "/placeholder.svg"}
              alt={blog.author}
              className="w-12 h-12 rounded-full mr-4 border-2 border-white"
            />
            <div>
              <p className="font-medium">{blog.author}</p>
              <div className="flex items-center text-sm text-white/80">
                <Calendar size={14} className="mr-1" />
                <span className="mr-3">{blog.date}</span>
                <Clock size={14} className="mr-1" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-2xl shadow-md p-8 md:p-12"
              ref={contentRef}
            >
              {/* Social Sharing Section */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 ${
                      liked ? "text-[#F06292]" : "text-gray-500"
                    } hover:text-[#F06292] transition-colors`}
                  >
                    <Heart
                      className={liked ? "fill-[#F06292]" : ""}
                      size={20}
                    />
                    <span>{likeCount}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-[#F06292] transition-colors">
                    <MessageCircle size={20} />
                    <span>Comments</span>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-[#F06292] transition-colors"
                  >
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Facebook size={18} className="mr-2 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Twitter size={18} className="mr-2 text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Linkedin size={18} className="mr-2 text-blue-700" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                      >
                        <Link2 size={18} className="mr-2 text-gray-600" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none text-gray-700">
                {blog.content.sections.map((section, index) => (
                  <div key={index}>
                    {section.h2 && (
                      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                        {section.h2}
                      </h2>
                    )}
                    {section.h3 && (
                      <h3
                        className={`text-lg font-semibold mt-4 mb-2 ${
                          section.h3 === "Customized Experience"
                            ? "text-[#F06292] before:content-['EJ'] before:inline-block before:w-6 before:h-6 before:bg-[#F06292] before:text-white before:rounded-full before:text-center before:mr-2 before:leading-6"
                            : "text-gray-700"
                        }`}
                      >
                        {section.h3}
                      </h3>
                    )}
                    <p className="mb-6 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {blog.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    Spa
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    Wellness
                  </span>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-start">
                  <img
                    src={blog.authorImage || "/placeholder.svg"}
                    alt={blog.author}
                    className="w-16 h-16 rounded-full mr-6"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {blog.author}
                    </h3>
                    <p className="text-gray-600 mb-4">Spa Expert</p>
                    <p className="text-gray-700">
                      A dedicated spa professional with years of experience in
                      wellness therapies, passionate about helping clients
                      achieve relaxation and rejuvenation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Comments
              </h3>
              <div className="mb-8">
                <textarea
                  placeholder="Leave a comment..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292]"
                  rows={4}
                ></textarea>
                <button className="mt-4 px-6 py-3 bg-[#F06292] text-white rounded-lg hover:bg-[#d05078] transition-colors">
                  Post Comment
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-start">
                    <img
                      src="https://ui-avatars.com/api/?name=Jane+Doe&background=F06292&color=fff"
                      alt="Jane Doe"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-bold text-gray-800 mr-2">
                          Jane Doe
                        </h4>
                        <span className="text-sm text-gray-500">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-gray-700">
                        This article was amazing! I feel so relaxed after trying
                        the massage.
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <button className="text-sm text-gray-500 hover:text-[#F06292]">
                          Reply
                        </button>
                        <button className="text-sm text-gray-500 hover:text-[#F06292] flex items-center">
                          <Heart size={14} className="mr-1" /> 3
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-[#F06292] rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: bookmarked ? "#F06292" : "white",
                  color: bookmarked ? "white" : "#F06292",
                }}
              >
                <Bookmark
                  className={bookmarked ? "fill-white" : ""}
                  size={18}
                />
                <span>
                  {bookmarked ? "Bookmarked" : "Bookmark This Article"}
                </span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Related Articles
              </h3>
              <div className="space-y-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="block group"
                  >
                    <div className="flex items-start">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                        <img
                          src={post.image} // Lấy trực tiếp từ post.image
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 group-hover:text-[#F06292] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {post.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Categories
              </h3>
              <div className="space-y-2">
                {["Skincare", "Treatments", "Wellness", "Lifestyle"].map(
                  (cat) => (
                    <Link
                      key={cat}
                      to={`/blog?category=${cat}`}
                      className="block py-2 px-4 hover:bg-gray-50 rounded-lg text-gray-700 hover:text-[#F06292] transition-colors"
                    >
                      {cat}
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#1C2526] to-[#F06292] text-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-white/90 mb-6">
                Get the latest spa tips and exclusive offers delivered to your
                inbox
              </p>
              <form>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg mb-4 focus:outline-none bg-white/20 text-white placeholder-white/70"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-[#F06292] px-4 py-3 rounded-lg font-medium hover:bg-pink-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#F06292] text-white p-3 rounded-full shadow-lg hover:bg-[#d05078] transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
