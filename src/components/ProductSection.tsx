import React from "react";
import {
  useProducts,
  usePopularProducts,
  useTrendingProducts,
  useBestsellerProducts,
} from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  type: "popular" | "trending" | "bestsellers";
  count?: number;
  className?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  type,
  count = 8,
  className = "",
}) => {
  // Choose the appropriate hook based on type
  const hookMap = {
    popular: usePopularProducts,
    trending: useTrendingProducts,
    bestsellers: useBestsellerProducts,
  };

  const { products, loading, error, refetch } = hookMap[type](count);

  if (loading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl md:text-3xl font-helvetica-medium text-center mb-8">
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

  if (error) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl md:text-3xl font-helvetica-medium text-center mb-8">
          {title}
        </h2>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">
              Failed to load {type} products
            </p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl md:text-3xl font-helvetica-medium text-center mb-8">
          {title}
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-600">No {type} products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-helvetica-medium">{title}</h2>
        {type === "trending" && (
          <div className="flex items-center text-sm text-orange-600 font-medium">
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
            Trending
          </div>
        )}
        {type === "bestsellers" && (
          <div className="flex items-center text-sm text-green-600 font-medium">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Best Sellers
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => console.log("Navigate to all products")}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            View All {title}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
