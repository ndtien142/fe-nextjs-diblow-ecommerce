// Product dimension interface
export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}

// Product category interface
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

// Product image interface
export interface ProductImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

// Product attribute interface
export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options?: string[];
  option?: string; // For variation attributes
}

// Product meta data interface
export interface ProductMetaData {
  id: number;
  key: string;
  value: string;
}

// Product links interface
export interface ProductLinks {
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

// Main product interface
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: "draft" | "pending" | "private" | "publish";
  featured: boolean;
  catalog_visibility: "visible" | "catalog" | "search" | "hidden";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: ProductDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: ProductCategory[];
  tags: any[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  default_attributes: any[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: ProductMetaData[];
  stock_status: "instock" | "outofstock" | "onbackorder";
  has_options: boolean;
  post_password: string;
  global_unique_id: string;
  brands: any[];
  _links: ProductLinks;
  popularity_score?: number; // Added for trending/popular products
  sales_rank?: number; // Added for bestseller ranking
  is_bestseller?: boolean; // Added for bestseller marking
}

// Product variation interface
export interface ProductVariation {
  id: number;
  type: "variation";
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  global_unique_id: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  status: "draft" | "pending" | "private" | "publish";
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  weight: string;
  dimensions: ProductDimensions;
  shipping_class: string;
  shipping_class_id: number;
  image: ProductImage;
  attributes: ProductAttribute[];
  menu_order: number;
  meta_data: ProductMetaData[];
  name: string;
  parent_id: number;
  _links: ProductLinks;
}

// Combined product with variations
export interface ProductWithVariations {
  product: Product;
  variations: ProductVariation[];
}

// For API responses
export interface ProductResponse {
  product: Product;
  variations?: ProductVariation[];
}

// For shopping cart items
export interface CartItem {
  id: number;
  product_id: number;
  variation_id?: number;
  name: string;
  price: string;
  quantity: number;
  image: ProductImage;
  attributes?: ProductAttribute[];
  variant?: string; // Formatted variation attributes like "Color: Black, Size: XL"
  total: string;
}

// For product search/filter
export interface ProductFilter {
  category?: string;
  tag?: string;
  search?: string;
  price_min?: number;
  price_max?: number;
  on_sale?: boolean;
  featured?: boolean;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  orderby?: "date" | "title" | "menu_order" | "popularity" | "rating" | "price";
  order?: "asc" | "desc";
}

// User interface for the app
export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl?: string;
  cartItems: Record<string, number>;
}

// Address interface
export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
}

// Order item interface
export interface OrderItem {
  product: Product;
  variation?: ProductVariation;
  quantity: number;
  id: string;
}

// Order interface
export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  amount: number;
  address: Address;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

// Context types
export interface AppContextType {
  currency: string | undefined;
  router: any;
  isSeller: boolean;
  setIsSeller: (value: boolean) => void;
  userData: User | false;
  fetchUserData: () => Promise<void>;
  products: Product[];
  fetchProductData: () => Promise<void>;
  cartItems: Record<string, number>;
  setCartItems: (items: Record<string, number>) => void;
  addToCart: (itemId: number, variationId?: number) => Promise<void>;
  updateCartQuantity: (
    itemId: number,
    quantity: number,
    variationId?: number
  ) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
  clearCart: () => Promise<void>;
  isCartLoading: boolean;
}
