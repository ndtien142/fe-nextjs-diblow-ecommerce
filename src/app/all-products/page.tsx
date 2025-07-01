"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import { useCategories } from "@/hooks/useCategories";
import { getChildCategoryIds } from "@/utils/categoryUtils";

const AllProducts = () => {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { categories: apiCategories } = useCategories();

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    // Get all child category IDs for hierarchical filtering
    const categoryIds = getChildCategoryIds(apiCategories, selectedCategory);

    // Filter products based on categories
    return products.filter((product) => {
      // Check if product has categories and if any category matches the selected category hierarchy
      if (product.categories && product.categories.length > 0) {
        return product.categories.some((category) => {
          const categoryId = category.id.toString();
          const categoryName = category.name.toLowerCase();
          const categorySlug = category.slug.toLowerCase();
          const selectedLower = selectedCategory.toLowerCase();

          // Check if category ID is in the selected hierarchy
          if (categoryIds.includes(categoryId)) {
            return true;
          }

          // Fallback to name/slug matching for better compatibility
          return (
            categoryName.includes(selectedLower) ||
            selectedLower.includes(categoryName) ||
            categorySlug.includes(selectedLower) ||
            selectedLower.includes(categorySlug)
          );
        });
      }
      return false;
    });
  }, [products, selectedCategory, apiCategories]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
      <div className="min-h-screen bg-gray-50">
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
                    <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredProducts.length} products found
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
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
