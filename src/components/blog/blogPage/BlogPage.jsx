"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { blogPosts } from "../../../data/blog/blogListDetail"

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 7
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center text-[#A10550] hover:text-[#8a0443] transition-colors">
              <ArrowLeft className="mr-2" size={20} />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Spa & Wellness Blog</h1>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Featured Post */}
          <div className="px-4 py-6 sm:px-0">
            <Link to={`/blog/${currentPosts[0].id}`} className="block">
              <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:w-48"
                      src={currentPosts[0].image || "/placeholder.svg"}
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
                    <p className="mt-2 text-gray-500">{currentPosts[0].excerpt}</p>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${currentPosts[0].author}&background=random`}
                          alt={currentPosts[0].author}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{currentPosts[0].author}</p>
                        <p className="text-sm text-gray-500">{currentPosts[0].date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Blog Post Grid */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.slice(1).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="block">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                    <img className="h-48 w-full object-cover" src={post.image || "/placeholder.svg"} alt={post.title} />
                    <div className="p-6">
                      <div className="uppercase tracking-wide text-xs text-indigo-500 font-semibold">
                        {post.category}
                      </div>
                      <h2 className="block mt-2 text-xl font-semibold text-gray-900 hover:underline">{post.title}</h2>
                      <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                      <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                            alt={post.author}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{post.author}</p>
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
          <div className="px-4 py-6 sm:px-0">
            <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
              <div className="w-0 flex-1 flex">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Previous
                </button>
              </div>
              <div className="hidden md:-mt-px md:flex">
                {[1, 2].map((number) => (
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
                ))}
              </div>
              <div className="w-0 flex-1 flex justify-end">
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === 2}
                  className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Next
                </button>
              </div>
            </nav>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogPage

