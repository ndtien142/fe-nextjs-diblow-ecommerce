// Category links interface
export interface CategoryLinks {
  self: Array<{
    href: string;
    targetHints?: {
      allow: string[];
    };
  }>;
  collection: Array<{
    href: string;
  }>;
  up?: Array<{
    href: string;
  }>;
}

// API Category interface (matches WooCommerce API response)
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: string | null;
  menu_order: number;
  count: number;
  _links: CategoryLinks;
}

// Sidebar Category interface (simplified for UI)
export interface SidebarCategory {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  subcategories?: SidebarCategory[];
  count?: number;
  menu_order?: number;
}

// Categories API response
export interface CategoriesResponse {
  categories: ApiCategory[];
  total: number;
  totalPages: number;
}

// Category filter options
export interface CategoryFilter {
  parent?: number;
  hide_empty?: boolean;
  per_page?: number;
  page?: number;
  orderby?:
    | "name"
    | "slug"
    | "term_group"
    | "term_id"
    | "id"
    | "description"
    | "count";
  order?: "asc" | "desc";
}
