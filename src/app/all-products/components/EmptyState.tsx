export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m-6 6V9a2 2 0 012-2h2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-helvetica-medium text-gray-900 mb-2">
        Không tìm thấy sản phẩm
      </h3>
      <p className="text-gray-500 text-center max-w-md font-helvetica">
        Chúng tôi không thể tìm thấy sản phẩm nào trong danh mục này. Hãy thử
        chọn một danh mục khác hoặc quay lại sau.
      </p>
    </div>
  );
}
