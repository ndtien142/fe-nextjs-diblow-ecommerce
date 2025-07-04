import React from "react";
import { usePopularProducts } from "@/hooks/usePopularProducts";
import ProductCardHome from "./product/ProductCardHome";

interface PopularProductsProps {
  title?: string;
  count?: number;
  strategy?: "popular" | "trending";
  className?: string;
}

const PopularProducts: React.FC<PopularProductsProps> = ({
  title = "Sản phẩm nổi bật",
  count = 8,
  strategy = "trending",
  className = "",
}) => {
  const { products, loading, error, refetch } = usePopularProducts({
    per_page: count,
    strategy,
  });

  if (loading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl md:text-3xl font-futura-medium text-center mb-8 margin-0-auto">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg h-64 w-full"
            >
              <div className="h-48 bg-gray-300 rounded-t-lg"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl md:text-3xl font-futura-medium uppercase">
          {title}
        </h2>
        {/* {strategy === "trending" && (
          <div className="flex items-center text-sm text-black font-futura-medium">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            Xu hướng
          </div>
        )} */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xm:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCardHome key={product.id} product={product} />
        ))}
      </div>

      {products.length >= count && 0 > 1 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              /* Navigate to all products page */
            }}
            className="text-black hover:text-gray-600 font-futura-medium border-b border-black hover:border-gray-600 transition-colors"
          >
            Xem tất cả {title}
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularProducts;
