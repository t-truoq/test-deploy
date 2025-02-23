"use client"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"

// Giả sử bạn đã import dữ liệu blogPosts từ một file khác
import { blogPosts } from "../../../data/blog/blogListDetail"

const BlogInfo = () => {
  const { id } = useParams()
  const blog = blogPosts.find((post) => post.id === parseInt(id))

  console.log("ID from URL:", id) // Để debug
  console.log("Found blog:", blog) // Để debug

  if (!blog) {
    return <div>Blog post not found</div>
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
          <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-64 object-cover" />

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
  )
}

export default BlogInfo

