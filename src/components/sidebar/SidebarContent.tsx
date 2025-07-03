"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarCategory } from "@/types/categories.interface";
import CategoryList from "./CategoryList";

interface SidebarContentProps {
  categories: SidebarCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onToggleCategory: (categoryId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onToggleCategory,
  isLoading,
  error,
  onRetry,
  onClose,
  showCloseButton = false,
}) => {
  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        onToggleCategory={onToggleCategory}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />
    </div>
  );
};

export default SidebarContent;
