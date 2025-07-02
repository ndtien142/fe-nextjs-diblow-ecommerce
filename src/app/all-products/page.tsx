"use client";
import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { getChildCategoryIds } from "@/utils/categoryUtils";

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Enhanced products fetching with proper category and pagination support
  const [productsData, setProductsData] = useState({
    products: [] as any[],
    loading: false,
    error: null as string | null,
    totalProducts: 0,
    totalPages: 0,
  });

  // Fetch products based on category and page
  const fetchProducts = async (categoryId: string, page: number) => {
    try {
      setProductsData((prev) => ({ ...prev, loading: true, error: null }));

      const { buildApiUrl, createFetchConfig, API_ENDPOINTS } = await import(
        "@/constant/api.constant"
      );

      // Build API URL with category and pagination parameters
      const params: Record<string, any> = {
        per_page: productsPerPage,
        page: page,
      };

      // Add category filter if not "all"
      if (categoryId !== "all") {
        params.category = categoryId;
      }

      const url = buildApiUrl(API_ENDPOINTS.PRODUCTS, params);
      const fetchConfig = createFetchConfig();

      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const products = await response.json();

      // Get pagination info from headers (handle case variations)
      const totalProducts = parseInt(
        response.headers.get("X-WP-Total") ||
          response.headers.get("x-wp-total") ||
          "0"
      );
      const totalPages = parseInt(
        response.headers.get("X-WP-TotalPages") ||
          response.headers.get("x-wp-totalpages") ||
          "1"
      );

      console.log("Pagination info:", {
        totalProducts,
        totalPages,
        currentPage: page,
      });

      setProductsData({
        products,
        loading: false,
        error: null,
        totalProducts,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      }));
    }
  };

  // Fetch products when category or page changes
  useEffect(() => {
    fetchProducts(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);

  // Get categories for sidebar
  const { categories: apiCategories, loading: categoriesLoading } =
    useCategories();

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get the display name for the selected category
  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") {
      return "All Products";
    }

    // Find the category in the API categories
    const findCategory = (cats: any[], id: string): any => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subcategories) {
          const found = findCategory(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    const category = findCategory(apiCategories, selectedCategory);
    return category
      ? category.name
      : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <>
      <Navbar />
      <div className="container min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            className="sticky top-16 h-screen overflow-y-auto"
          />

          {/* Main Content */}
          <div className="flex-1 md:ml-0">
            <div className="px-4 md:px-8 lg:px-12 py-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {getSelectedCategoryName()}
                    </h1>
                    <div className="w-20 h-1 bg-black rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {productsData.totalProducts} products found
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {productsData.loading || categoriesLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  <div className="ml-4 text-lg text-gray-600">
                    Loading products...
                  </div>
                </div>
              ) : productsData.error ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-red-500 text-lg font-medium mb-2">
                    Error loading products
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    {productsData.error}
                  </div>
                  <button
                    onClick={() => fetchProducts(selectedCategory, currentPage)}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : productsData.products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {productsData.products.map(
                      (product: any, index: number) => (
                        <ProductCard
                          key={`${product.id}-${index}`}
                          product={product}
                        />
                      )
                    )}
                  </div>

                  {/* Enhanced Pagination UI */}
                  {productsData.totalPages > 1 && (
                    <div className="flex flex-col items-center mt-12 space-y-4">
                      {/* Pagination Info */}
                      <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                        {Math.min(
                          currentPage * productsPerPage,
                          productsData.totalProducts
                        )}{" "}
                        of {productsData.totalProducts} products
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center justify-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
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
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {/* First Page */}
                          {currentPage > 3 && (
                            <>
                              <button
                                onClick={() => handlePageChange(1)}
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
                                onClick={() => handlePageChange(pageNum)}
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
                            if (pageNum > productsData.totalPages) return null;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-300"
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          {/* Last Page */}
                          {currentPage < productsData.totalPages - 2 && (
                            <>
                              <span className="px-2 text-gray-400">...</span>
                              <button
                                onClick={() =>
                                  handlePageChange(productsData.totalPages)
                                }
                                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-300"
                              >
                                {productsData.totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            handlePageChange(
                              Math.min(productsData.totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === productsData.totalPages}
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            currentPage === productsData.totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                          }`}
                        >
                          Next
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
                      {productsData.totalPages > 10 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Go to page:</span>
                          <input
                            type="number"
                            min="1"
                            max={productsData.totalPages}
                            value={currentPage}
                            onChange={(e) => {
                              const page = parseInt(e.target.value);
                              if (
                                page >= 1 &&
                                page <= productsData.totalPages
                              ) {
                                handlePageChange(page);
                              }
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                          <span className="text-gray-600">
                            of {productsData.totalPages}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
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
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    We couldn't find any products in this category. Try
                    selecting a different category or check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
