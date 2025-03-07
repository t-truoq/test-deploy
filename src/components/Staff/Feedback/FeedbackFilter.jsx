import PropTypes from "prop-types";

export default function FeedbackFilter({ currentFilter, onFilterChange }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">Lọc phản hồi</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Đánh giá sao</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="all"
                name="rating"
                value="0"
                checked={currentFilter === 0}
                onChange={() => onFilterChange(0)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="all" className="text-sm">
                Tất cả đánh giá
              </label>
            </div>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  value={rating}
                  checked={currentFilter === rating}
                  onChange={() => onFilterChange(rating)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm flex items-center"
                >
                  {rating} sao
                  {Array(rating)
                    .fill()
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

FeedbackFilter.propTypes = {
  currentFilter: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
