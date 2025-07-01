"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ApiCategory } from "@/types/categories.interface";
import { useCategoriesWithMockData } from "@/hooks/useCategories";

// Your provided API data
const mockApiData: ApiCategory[] = [
  {
    id: 50,
    name: "Áo",
    slug: "ao",
    parent: 0,
    description: "",
    display: "default",
    image: null,
    menu_order: 12,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
    },
  },
  {
    id: 56,
    name: "Áo Hoodie",
    slug: "ao-hoodie",
    parent: 50,
    description: "",
    display: "default",
    image: null,
    menu_order: 13,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/56",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
        },
      ],
    },
  },
  {
    id: 52,
    name: "Áo khoác hè",
    slug: "ao-khoac-he",
    parent: 50,
    description: "",
    display: "default",
    image: null,
    menu_order: 18,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/52",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
        },
      ],
    },
  },
  {
    id: 54,
    name: "Áo Polo",
    slug: "ao-polo",
    parent: 50,
    description: "",
    display: "default",
    image: null,
    menu_order: 14,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/54",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
        },
      ],
    },
  },
  {
    id: 53,
    name: "Áo sơ mi",
    slug: "ao-so-mi",
    parent: 50,
    description: "",
    display: "default",
    image: null,
    menu_order: 15,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/53",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
        },
      ],
    },
  },
  {
    id: 55,
    name: "Áo Sweater",
    slug: "ao-sweater",
    parent: 50,
    description: "",
    display: "default",
    image: null,
    menu_order: 16,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/55",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
        },
      ],
    },
  },
  {
    id: 51,
    name: "Áo thun - Ba lỗ",
    slug: "ao-thun-ba-lo",
    parent: 50,
    description: "",
    display: "default",
    image: null,
    menu_order: 17,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/51",
          targetHints: {
            allow: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          },
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/50",
        },
      ],
    },
  },
  // Adding missing parent categories to make the hierarchy work
  {
    id: 66,
    name: "Phụ kiện nam",
    slug: "phu-kien-nam",
    parent: 0,
    description: "",
    display: "default",
    image: null,
    menu_order: 0,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/66",
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
    },
  },
  {
    id: 67,
    name: "Balo - Túi xách - Ví",
    slug: "balo-tui-xach-vi",
    parent: 66,
    description: "",
    display: "default",
    image: null,
    menu_order: 0,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/67",
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/66",
        },
      ],
    },
  },
  {
    id: 71,
    name: "Phụ kiện nữ",
    slug: "phu-kien-nu",
    parent: 0,
    description: "",
    display: "default",
    image: null,
    menu_order: 0,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/71",
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
    },
  },
  {
    id: 74,
    name: "Balo - Túi xách - ví nữ",
    slug: "balo-tui-xach-vi-nu",
    parent: 71,
    description: "",
    display: "default",
    image: null,
    menu_order: 0,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/74",
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/71",
        },
      ],
    },
  },
  {
    id: 61,
    name: "Giày dép",
    slug: "giay-dep",
    parent: 0,
    description: "",
    display: "default",
    image: null,
    menu_order: 0,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/61",
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
    },
  },
  {
    id: 65,
    name: "Dép thể thao",
    slug: "dep-the-thao",
    parent: 61,
    description: "",
    display: "default",
    image: null,
    menu_order: 4,
    count: 0,
    _links: {
      self: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/65",
        },
      ],
      collection: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories",
        },
      ],
      up: [
        {
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/61",
        },
      ],
    },
  },
];

const ApiCategoriesDemo = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { categories, loading, error } = useCategoriesWithMockData(mockApiData);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("Selected category:", categoryId);
  };

  const getSelectedCategoryInfo = () => {
    if (selectedCategory === "all")
      return {
        name: "All Categories",
        info: "Showing all available categories",
      };

    const findCategory = (cats: any[], id: string): any => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subcategories) {
          const found = findCategory(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    const category = findCategory(categories, selectedCategory);
    return category
      ? {
          name: category.name,
          info: `Category ID: ${category.id}, Slug: ${category.slug}`,
        }
      : { name: "Unknown", info: "Category not found" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          API Categories Demo
        </h1>
        <p className="text-gray-600 mb-8">
          This demo shows how your WooCommerce API categories are transformed
          into a hierarchical sidebar.
        </p>

        <div
          className="flex border border-gray-300 rounded-lg overflow-hidden bg-white"
          style={{ height: "600px" }}
        >
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200">
            <Sidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              useApiCategories={false}
            />
          </div>

          {/* Demo Content */}
          <div className="flex-1 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {getSelectedCategoryInfo().name}
              </h2>
              <p className="text-gray-600">{getSelectedCategoryInfo().info}</p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading categories...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">Error: {error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  How it works:
                </h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>
                    • Parent categories (parent: 0) become main categories
                  </li>
                  <li>
                    • Child categories become subcategories under their parents
                  </li>
                  <li>• Categories are sorted alphabetically</li>
                  <li>• Click on categories to select them</li>
                  <li>
                    • Categories with subcategories can be expanded/collapsed
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Your API Categories Structure:
                </h3>
                <div className="text-green-800 text-sm">
                  <div className="font-medium">Main Categories:</div>
                  <ul className="ml-4 space-y-1">
                    <li>• Áo (ID: 50) - with 6 subcategories</li>
                    <li>• Phụ kiện nam (ID: 66) - with 1 subcategory</li>
                    <li>• Phụ kiện nữ (ID: 71) - with 1 subcategory</li>
                    <li>• Giày dép (ID: 61) - with 1 subcategory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiCategoriesDemo;
