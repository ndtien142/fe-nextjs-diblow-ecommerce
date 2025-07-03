"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { SidebarCategory } from "@/types/categories.interface";

interface CategoryItemProps {
  category: SidebarCategory;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (categoryId: string) => void;
  onToggle: (categoryId: string) => void;
  level?: number;
  hasSelectedChild?: boolean;
  selectedCategory?: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
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

  // Helper function to check if this subcategory has selected child
  const hasSubcategorySelectedChild = (subcat: SidebarCategory): boolean => {
    if (!subcat.subcategories) return false;
    return subcat.subcategories.some((child) => {
      if (child.id === selectedCategory) return true;
      return hasSubcategorySelectedChild(child);
    });
  };

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
          {category.subcategories!.map((subcategory: SidebarCategory) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
