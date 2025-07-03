"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useCategories } from "@/hooks/useCategories";
import { SidebarCategory } from "@/types/categories.interface";
import Link from "next/link";

interface CategoriesDropdownProps {
  onCategorySelect?: (categoryId: string) => void;
  className?: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  onCategorySelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categories, loading, error } = useCategories();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category: SidebarCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category.id);
    }
    setIsOpen(false);
  };

  const renderCategoryItem = (category: SidebarCategory, level = 0) => {
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;
    const paddingLeft = level * 16;

    return (
      <div key={category.id}>
        <Link
          href={
            category.id === "all"
              ? "/all-products"
              : `/all-products?category=${category.slug}`
          }
          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150`}
          style={{ paddingLeft: `${16 + paddingLeft}px` }}
          onClick={() => handleCategoryClick(category)}
        >
          {category.name}
        </Link>
        {hasSubcategories && (
          <div className="bg-gray-50">
            {category.subcategories!.map((subcategory) =>
              renderCategoryItem(subcategory, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8">
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="px-4 py-4 text-center">
              <p className="text-red-600 text-sm">Failed to load categories</p>
            </div>
          ) : (
            <div className="py-1">
              {categories.map((category) => renderCategoryItem(category))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;
