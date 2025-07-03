"use client";

import React, { useState } from "react";
import { SidebarCategory } from "@/types/categories.interface";
import { useCategories } from "@/hooks/useCategories";
import SidebarContent from "./SidebarContent";
import MobileSidebarToggle from "./MobileSidebarToggle";
import MobileSidebar from "./MobileSidebar";

interface SidebarProps {
  categories?: SidebarCategory[];
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  className?: string;
  useApiCategories?: boolean;
}

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
      ) || []
    : categories?.filter(
        (category) => category.name.toLowerCase() !== "uncategorized"
      ) || [];
  const isLoading = useApiCategories ? apiCategories.loading : false;
  const error = useApiCategories ? apiCategories.error : null;

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
  };

  const handleRetry = () => {
    if (useApiCategories && apiCategories.refetch) {
      apiCategories.refetch();
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileSidebarToggle onClick={() => setIsMobileOpen(true)} />

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block w-64 h-full border-r border-gray-200 ${className}`}
      >
        <SidebarContent
          categories={displayCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onToggleCategory={toggleCategory}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        categories={displayCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onToggleCategory={toggleCategory}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      />
    </>
  );
};

export default Sidebar;
