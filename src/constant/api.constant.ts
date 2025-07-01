// API Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const WC_BASE_URL =
  process.env.NEXT_PUBLIC_WC_BASE_URL || "https://ndtien142.xyz/wp-json/wc/v3";

// WooCommerce API Credentials
export const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "";
export const WC_CONSUMER_SECRET =
  process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "";

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: "/products",
  PRODUCTS_POPULAR: "/products/popular",
  PRODUCTS_TRENDING: "/products/trending",
  PRODUCTS_BESTSELLERS: "/products/bestsellers",
  PRODUCTS_FEATURED: "/products/featured",
  PRODUCTS_ON_SALE: "/products/on-sale",

  // Categories
  CATEGORIES: "/products/categories",

  // Single product
  PRODUCT_BY_ID: (id: number | string) => `/products/${id}`,

  // Search
  SEARCH_PRODUCTS: "/products/search",
} as const;

// WooCommerce API Endpoints
export const WC_ENDPOINTS = {
  PRODUCTS: `${WC_BASE_URL}/products`,
  CATEGORIES: `${WC_BASE_URL}/products/categories`,
  ORDERS: `${WC_BASE_URL}/orders`,
  CUSTOMERS: `${WC_BASE_URL}/customers`,
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Auth Headers Generator
export const getWCAuthHeaders = () => {
  const credentials = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };
};

// Fetch Configuration Helper
export const createFetchConfig = (options: RequestInit = {}): RequestInit => {
  return {
    method: "GET",
    headers: {
      ...getWCAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };
};

// Build API URL Helper
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const baseUrl = endpoint.startsWith("/api") ? API_BASE_URL : WC_BASE_URL;
  let url = endpoint.startsWith("/")
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}/${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};
