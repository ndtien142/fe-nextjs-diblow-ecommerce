"use client";
import React from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useCategories } from "@/hooks/useCategories";
import { SidebarCategory } from "@/types/categories.interface";

interface NavigationLinksProps {
  className?: string;
  isMobile?: boolean;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({
  className = "",
  isMobile = false,
}) => {
  const { isSeller, router } = useAppContext();
  const { categories, loading } = useCategories();

  // Get parent categories (categories that have subcategories)
  const parentCategories = categories.filter(
    (category) =>
      category.id !== "all" &&
      category.subcategories &&
      category.subcategories.length > 0
  );

  const renderCategoryDropdown = (category: SidebarCategory) => {
    if (isMobile) {
      return (
        <details
          key={category.id}
          className="group border-b border-gray-100 last:border-b-0"
          open={true}
        >
          <summary className="flex items-center justify-between w-full py-3 px-2 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer list-none rounded-lg">
            <span className="text-[15px] font-helvetica-medium text-gray-900 uppercase tracking-wide">
              {category.name}
            </span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-open:rotate-180 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          {category.subcategories && (
            <div className="pl-4 py-2 space-y-1 bg-gray-25 rounded-lg mt-1 mb-2">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/all-products?category=${subcategory.slug}`}
                  className="block py-2 px-3 text-[14px] text-gray-700 hover:text-gray-900 hover:bg-white rounded-md transition-colors duration-150"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          )}
        </details>
      );
    }

    return (
      <li key={category.id} className="relative h-full group">
        <Link
          href={`/all-products?category=${category.slug}`}
          className="flex items-center gap-1 hover:text-gray-900 transition-colors duration-200 focus:outline-none cursor-pointer"
        >
          <span className="text-[14px] uppercase leading-[70px] font-helvetica-bold">
            {category.name}
          </span>
        </Link>

        {category.subcategories && (
          <div
            className="absolute w-auto min-w-64 top-[93%] left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            style={{ transformOrigin: "top" }}
          >
            <div className="py-1">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/all-products?category=${subcategory.slug}`}
                  className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 uppercase font-helvetica-bold"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className={className}>
        {/* Loading skeleton for navigation */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={className}>
        {parentCategories.map((category) => renderCategoryDropdown(category))}
      </div>
    );
  }

  return (
    <nav
      className={`relative w-full min-h-[70px] flex items-center justify-center scrollbar-none`}
    >
      {/* Parent Categories with Subcategory Dropdowns */}
      <ul
        className={`${className} flex items-center gap-6 lg:gap-8 scrollbar-none`}
      >
        {parentCategories.map((category) => renderCategoryDropdown(category))}
      </ul>
    </nav>
  );
};

export default NavigationLinks;
