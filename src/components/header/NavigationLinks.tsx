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
        <details key={category.id} className="py-1 group">
          <summary className="flex items-center justify-between w-full py-2 text-left hover:text-gray-900 transition cursor-pointer list-none">
            <span className="text-[14px]">{category.name}</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
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
            <div className="pl-4 py-1 space-y-1 bg-gray-50 rounded">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/all-products?category=${subcategory.slug}`}
                  className="block py-1 text-[14px] text-gray-600 hover:text-gray-900 transition"
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
          <span className="text-[14px] uppercase leading-[70px] font-futura-heavy">
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
                  className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 uppercase font-futura-heavy"
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

  return (
    <nav
      className={`relative w-full min-h-[70px] flex items-center justify-center`}
    >
      {/* Parent Categories with Subcategory Dropdowns */}
      <ul className={`${className} flex items-center gap-6 lg:gap-8`}>
        {parentCategories.map((category) => renderCategoryDropdown(category))}
      </ul>
    </nav>
  );
};

export default NavigationLinks;
