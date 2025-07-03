"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import { useCategories } from "@/hooks/useCategories";
import { useProductFetch } from "./hooks/useProductFetch";
import ProductHeader from "./components/ProductHeader";
import ProductGrid from "./components/ProductGrid";
import ProductPagination from "./components/ProductPagination";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import CardLoadingSkeleton from "./components/CardLoadingSkeleton";

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Use the custom hook for product fetching
  const { products, loading, error, totalProducts, totalPages, refetch } =
    useProductFetch({
      selectedCategory,
      currentPage,
      productsPerPage,
    });

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
      <div className="main-productPage min-h-screen">
        <div className="container grid items-baseline grid-cols-12">
          {/* Sidebar */}
          <div className="overflow-visible sm:col-span-2 sm:block">
            <Sidebar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              className="mt-8"
            />
          </div>

          {/* Main Content */}
          <div className="col-12 md:ml-0 sm:col-span-10 pl-8">
            <div className="px-4">
              {/* Header */}
              <ProductHeader
                categoryName={getSelectedCategoryName()}
                totalProducts={totalProducts}
              />
              <div className="grid">
                {/* Content based on state */}
                {loading || categoriesLoading ? (
                  <CardLoadingSkeleton />
                ) : error ? (
                  <div className="grid grid-cols-1 gap-6">
                    <ErrorState error={error} onRetry={refetch} />
                  </div>
                ) : products.length > 0 ? (
                  <div>
                    <ProductGrid products={products} />

                    {totalPages > 1 && (
                      <ProductPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalProducts={totalProducts}
                        productsPerPage={productsPerPage}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
