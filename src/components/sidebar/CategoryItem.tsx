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
  const paddingLeft = level * 16 + 22;

  // Helper function to check if this subcategory has selected child
  const hasSubcategorySelectedChild = (subcat: SidebarCategory): boolean => {
    if (!subcat.subcategories) return false;
    return subcat.subcategories.some((child) => {
      if (child.id === selectedCategory) return true;
      return hasSubcategorySelectedChild(child);
    });
  };

  return (
    <div className="category-item overflow-visible">
      <div
        className={`relative flex items-center py-1.5 cursor-pointer group uppercase`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => onSelect(category.id)}
      >
        <div
          className={`flex items-center group-hover:before:opacity-100 gap-2 before:absolute before:opacity-0 before:bg-transparent before:height-0 before:border-t-[5px] before:border-solid before:border-t-transparent before:border-b-[5px] before:border-b-transparent before:border-l-[10px] before:left-[-5px]:border-l-black before:transition-all before:translate-y-[-50%] before:top-1/2 border:z-50 ${
            level === 0 ? "before:left-[0px]" : "before:left-[16px]"
          } ${isSelected || hasSelectedChild ? "before:opacity-100" : ""}`}
        >
          <span
            className={`font-helvetica-medium ${
              level === 0 ? "text-[16px] font-helvetica-bold" : "text-sm"
            }`}
          >
            {category.name}
          </span>
        </div>
      </div>
      {hasSubcategories && (
        <div className="subcategories relative">
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
