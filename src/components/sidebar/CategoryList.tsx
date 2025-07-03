"use client";

import React from "react";
import { SidebarCategory } from "@/types/categories.interface";
import CategoryItem from "./CategoryItem";

interface CategoryListProps {
  categories: SidebarCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onToggleCategory: (categoryId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onToggleCategory,
  isLoading,
  error,
  onRetry,
}) => {
  // Helper function to check if a category has a selected child
  const hasSelectedChild = (category: SidebarCategory): boolean => {
    if (!category.subcategories) return false;

    return category.subcategories.some((subcategory) => {
      if (subcategory.id === selectedCategory) return true;
      return hasSelectedChild(subcategory);
    });
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 text-sm mb-2">Failed to load categories</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-black text-sm hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full pb-20 overflow-visible">
      {Array.isArray(categories) &&
        categories.map((category: SidebarCategory) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            isExpanded={true} // Always expanded
            onSelect={onCategorySelect}
            onToggle={onToggleCategory}
            hasSelectedChild={hasSelectedChild(category)}
            selectedCategory={selectedCategory}
          />
        ))}
    </div>
  );
};

export default CategoryList;
