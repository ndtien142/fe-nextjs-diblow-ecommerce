import React, { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

const PopularProductsDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "popular" | "trending" | "bestsellers"
  >("popular");

  const { products, loading, error, refetch } = useProducts({
    strategy: activeTab,
    per_page: 8,
  });

  const tabs = [
    { id: "popular" as const, label: "Popular", icon: "🔥" },
    { id: "trending" as const, label: "Trending", icon: "📈" },
    { id: "bestsellers" as const, label: "Best Sellers", icon: "🏆" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-futura-medium text-center mb-6">
          WooCommerce Popular Products
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">API Endpoint:</h3>
          <code className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
            /api/products/{activeTab}?per_page=8
          </code>
          <p className="text-sm text-blue-600 mt-2">
            {activeTab === "popular" &&
              "Fetches products ordered by total sales (popularity)"}
            {activeTab === "trending" &&
              "Combines featured, popular, and top-rated products with scoring"}
            {activeTab === "bestsellers" &&
              "Fetches products with highest sales, ranked by sales volume"}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
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
              Error loading {activeTab} products
            </p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {products.length} {activeTab} products
            </p>
            <button
              onClick={refetch}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />

                {/* Show additional data for trending/bestsellers */}
                {activeTab === "trending" && product.popularity_score && (
                  <div className="absolute top-2 left-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Score: {product.popularity_score.toFixed(1)}
                  </div>
                )}

                {activeTab === "bestsellers" && product.sales_rank && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    #{product.sales_rank}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No {activeTab} products found</p>
        </div>
      )}

      {/* Debug Information */}
      <details className="mt-8 bg-gray-50 p-4 rounded-lg">
        <summary className="cursor-pointer font-medium text-gray-700 mb-2">
          Debug Information
        </summary>
        <div className="text-sm text-gray-600 space-y-2">
          <div>
            <strong>Active Strategy:</strong> {activeTab}
          </div>
          <div>
            <strong>Products Loaded:</strong> {products.length}
          </div>
          <div>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </div>
          <div>
            <strong>Error:</strong> {error || "None"}
          </div>
          <div>
            <strong>Sample Product Data:</strong>
          </div>
          {products.length > 0 && (
            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(
                {
                  id: products[0].id,
                  name: products[0].name,
                  price: products[0].price,
                  total_sales: products[0].total_sales,
                  featured: products[0].featured,
                  average_rating: products[0].average_rating,
                  popularity_score: products[0].popularity_score,
                  sales_rank: products[0].sales_rank,
                  is_bestseller: products[0].is_bestseller,
                },
                null,
                2
              )}
            </pre>
          )}
        </div>
      </details>
    </div>
  );
};

export default PopularProductsDemo;
