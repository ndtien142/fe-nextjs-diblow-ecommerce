interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  totalProducts,
  productsPerPage,
  onPageChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * productsPerPage + 1;
  const endItem = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="flex flex-col items-center mt-12 space-y-4">
      {/* Pagination Info */}
      <div className="text-sm text-gray-600">
        {startItem} đến {endItem} của {totalProducts} sản phẩm
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
          }`}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Trước
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-300"
              >
                1
              </button>
              <span className="px-2 text-gray-400">...</span>
            </>
          )}

          {/* Previous Pages */}
          {[...Array(2)].map((_, i) => {
            const pageNum = currentPage - 2 + i;
            if (pageNum < 1) return null;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-300"
              >
                {pageNum}
              </button>
            );
          })}

          {/* Current Page */}
          <button className="px-4 py-2 rounded-lg bg-black text-white font-semibold shadow-md cursor-default">
            {currentPage}
          </button>

          {/* Next Pages */}
          {[...Array(2)].map((_, i) => {
            const pageNum = currentPage + 1 + i;
            if (pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-300"
              >
                {pageNum}
              </button>
            );
          })}

          {/* Last Page */}
          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-400">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-300"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
          }`}
        >
          Sau
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Quick Jump to Page (for large page counts) */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <span className="text-gray-600">of {totalPages}</span>
        </div>
      )}
    </div>
  );
}
