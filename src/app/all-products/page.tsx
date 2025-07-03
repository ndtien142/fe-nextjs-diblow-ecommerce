"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/header/Navbar";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Get categories for sidebar
  const { categories: apiCategories, loading: categoriesLoading } =
    useCategories();

  // Helper function to handle both slug and ID for category filtering
  const getCategoryIdentifier = (
    categoryValue: string,
    categories: any[]
  ): string => {
    if (categoryValue === "all") return "all";

    // First try to find by ID (for backward compatibility)
    const findById = (cats: any[], id: string): any => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subcategories) {
          const found = findById(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    // Then try to find by slug
    const findBySlug = (cats: any[], slug: string): any => {
      for (const cat of cats) {
        if (cat.slug === slug) return cat;
        if (cat.subcategories) {
          const found = findBySlug(cat.subcategories, slug);
          if (found) return found;
        }
      }
      return null;
    };

    const categoryById = findById(categories, categoryValue);
    const categoryBySlug = findBySlug(categories, categoryValue);

    // Return the ID for API call (prefer slug match over ID match for new URLs)
    if (categoryBySlug) return categoryBySlug.id;
    if (categoryById) return categoryById.id;

    // Fallback to original value
    return categoryValue;
  };

  // Helper function to find category by slug
  const findCategoryBySlug = (cats: any[], slug: string): any => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.subcategories) {
        const found = findCategoryBySlug(cat.subcategories, slug);
        if (found) return found;
      }
    }
    return null;
  };

  // Update selected category based on URL params
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug && apiCategories.length > 0) {
      const category = findCategoryBySlug(apiCategories, categorySlug);
      if (category) {
        setSelectedCategory(category.id);
      } else {
        // If slug not found, default to "all"
        setSelectedCategory("all");
      }
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams, apiCategories]);

  // Use the custom hook for product fetching
  const { products, loading, error, totalProducts, totalPages, refetch } =
    useProductFetch({
      selectedCategory: getCategoryIdentifier(selectedCategory, apiCategories),
      currentPage,
      productsPerPage,
    });

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    // Find the category by ID to get its slug
    const findCategoryById = (cats: any[], id: string): any => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subcategories) {
          const found = findCategoryById(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    if (categoryId === "all") {
      // Navigate to all products without category parameter
      router.push("/all-products");
    } else {
      // Find the category and use its slug in the URL
      const category = findCategoryById(apiCategories, categoryId);
      if (category && category.slug) {
        router.push(`/all-products?category=${category.slug}`);
      } else {
        // Fallback to using the ID if slug is not found
        router.push(`/all-products?category=${categoryId}`);
      }
    }
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

    // Find the category by ID in the API categories
    const findCategoryById = (cats: any[], id: string): any => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subcategories) {
          const found = findCategoryById(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    const category = findCategoryById(apiCategories, selectedCategory);
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
