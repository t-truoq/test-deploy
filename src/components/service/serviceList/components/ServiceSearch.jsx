import { useState } from "react"
import { Search } from "lucide-react"

const ServiceSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A10550] focus:border-transparent"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-[#A10550]"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ServiceSearch

