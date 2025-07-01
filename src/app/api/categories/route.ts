import { NextRequest, NextResponse } from "next/server";
import { ApiCategory } from "@/types/categories.interface";

// Mock data based on your provided API response
const mockCategories: ApiCategory[] = [
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
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/66",
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
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/71",
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
          href: "https://ndtien142.xyz/wp-json/wc/v3/products/categories/61",
        },
      ],
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    // You can replace this with actual API call to your WooCommerce endpoint
    // const response = await fetch('https://ndtien142.xyz/wp-json/wc/v3/products/categories');
    // const categories = await response.json();

    // For now, return mock data
    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
