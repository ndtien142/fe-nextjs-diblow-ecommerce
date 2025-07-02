"use client";

import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { SidebarCategory } from "@/types/categories.interface";
import { useCategories } from "@/hooks/useCategories";

interface SidebarProps {
  categories?: SidebarCategory[];
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  className?: string;
  useApiCategories?: boolean;
}

const CategoryItem: React.FC<{
  category: SidebarCategory;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (categoryId: string) => void;
  onToggle: (categoryId: string) => void;
  level?: number;
  hasSelectedChild?: boolean;
  selectedCategory?: string;
}> = ({
  category,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
  level = 0,
  hasSelectedChild = false,
  selectedCategory,
}) => {
  const hasSubcategories =
    category.subcategories && category.subcategories.length > 0;
  const paddingLeft = level * 16 + 12;

  return (
    <div className="category-item">
      <div
        className={`flex items-center justify-between py-3 px-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
          isSelected
            ? "bg-gray-100 text-black border-r-2 border-black"
            : hasSelectedChild
            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-300"
            : "text-gray-700"
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => onSelect(category.id)}
      >
        <div className="flex items-center gap-2">
          {hasSelectedChild && !isSelected && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
          <span className="font-medium text-sm">{category.name}</span>
        </div>
        {hasSubcategories && (
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Always show subcategories (auto-expanded) */}
      {hasSubcategories && (
        <div className="subcategories">
          {category.subcategories!.map((subcategory: SidebarCategory) => {
            // Helper function to check if this subcategory has selected child
            const hasSubcategorySelectedChild = (
              subcat: SidebarCategory
            ): boolean => {
              if (!subcat.subcategories) return false;
              return subcat.subcategories.some((child) => {
                if (child.id === selectedCategory) return true;
                return hasSubcategorySelectedChild(child);
              });
            };

            return (
              <CategoryItem
                key={subcategory.id}
                category={subcategory}
                isSelected={subcategory.id === selectedCategory}
                isExpanded={true}
                onSelect={onSelect}
                onToggle={onToggle}
                level={level + 1}
                hasSelectedChild={hasSubcategorySelectedChild(subcategory)}
                selectedCategory={selectedCategory}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  onCategorySelect = () => {},
  selectedCategory = "all",
  className = "",
  useApiCategories = true,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Use API categories if enabled, otherwise use provided categories or default
  const apiCategories = useCategories();
  const displayCategories = useApiCategories
    ? apiCategories.categories?.filter(
        (category) => category.name.toLowerCase() !== "uncategorized"
      )
    : categories?.filter(
        (category) => category.name.toLowerCase() !== "uncategorized"
      );
  const isLoading = useApiCategories ? apiCategories.loading : false;
  const error = useApiCategories ? apiCategories.error : null;

  // Helper function to check if a category has a selected child
  const hasSelectedChild = (category: SidebarCategory): boolean => {
    if (!category.subcategories) return false;

    return category.subcategories.some((subcategory) => {
      if (subcategory.id === selectedCategory) return true;
      return hasSelectedChild(subcategory);
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    // Close mobile sidebar when category is selected
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Categories */}
      <div className="overflow-y-auto h-full pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-600 text-sm mb-2">
              Failed to load categories
            </p>
            <button
              onClick={() => apiCategories.refetch()}
              className="text-black text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          Array.isArray(displayCategories) &&
          displayCategories.map((category: SidebarCategory) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              isExpanded={true} // Always expanded
              onSelect={handleCategorySelect}
              onToggle={toggleCategory}
              hasSelectedChild={hasSelectedChild(category)}
              selectedCategory={selectedCategory}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-20 left-4 z-40 bg-white border border-gray-300 rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block w-64 h-full border-r border-gray-200 ${className}`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-80 max-w-[80vw] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
