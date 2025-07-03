"use client";

import React from "react";
import { SidebarCategory } from "@/types/categories.interface";
import SidebarContent from "./SidebarContent";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: SidebarCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onToggleCategory: (categoryId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
  onToggleCategory,
  isLoading,
  error,
  onRetry,
}) => {
  if (!isOpen) return null;

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    onClose(); // Close mobile sidebar when category is selected
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative w-80 max-w-[80vw] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <SidebarContent
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onToggleCategory={onToggleCategory}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          onClose={onClose}
          showCloseButton={true}
        />
      </div>
    </div>
  );
};

export default MobileSidebar;
