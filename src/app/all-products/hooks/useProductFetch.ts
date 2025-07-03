import { useState, useEffect, useRef } from "react";

interface UseProductFetchResult {
  products: any[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  totalPages: number;
  refetch: () => void;
}

interface CachedData {
  products: any[];
  totalProducts: number;
  totalPages: number;
  timestamp: number;
}

interface UseProductFetchOptions {
  selectedCategory: string;
  currentPage: number;
  productsPerPage: number;
  cacheTimeout?: number; // Cache timeout in milliseconds (default: 5 minutes)
}

// Global cache to share between component instances
const productCache = new Map<string, CachedData>();

// Cache management utilities
export const clearProductCache = () => {
  productCache.clear();
  console.log("Product cache cleared");
};

export const clearCacheForCategory = (categoryId: string) => {
  const keysToDelete = Array.from(productCache.keys()).filter((key) =>
    key.startsWith(`${categoryId}-`)
  );
  keysToDelete.forEach((key) => productCache.delete(key));
  console.log(`Cache cleared for category: ${categoryId}`);
};

export const getCacheSize = () => productCache.size;

export const useProductFetch = ({
  selectedCategory,
  currentPage,
  productsPerPage,
  cacheTimeout = 5 * 60 * 1000, // 5 minutes default
}: UseProductFetchOptions): UseProductFetchResult => {
  const [productsData, setProductsData] = useState({
    products: [] as any[],
    loading: false,
    error: null as string | null,
    totalProducts: 0,
    totalPages: 0,
  });

  // Track ongoing requests to prevent duplicate API calls
  const ongoingRequestsRef = useRef(new Set<string>());

  // Generate cache key
  const getCacheKey = (categoryId: string, page: number) =>
    `${categoryId}-${page}-${productsPerPage}`;

  // Check if cached data is still valid
  const isCacheValid = (cachedData: CachedData) => {
    return Date.now() - cachedData.timestamp < cacheTimeout;
  };

  // Fetch products based on category and page
  const fetchProducts = async (
    categoryId: string,
    page: number,
    forceRefresh = false
  ) => {
    const cacheKey = getCacheKey(categoryId, page);

    // Check if request is already ongoing
    if (ongoingRequestsRef.current.has(cacheKey)) {
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = productCache.get(cacheKey);
      if (cachedData && isCacheValid(cachedData)) {
        console.log("Using cached data for:", cacheKey);
        setProductsData({
          products: cachedData.products,
          loading: false,
          error: null,
          totalProducts: cachedData.totalProducts,
          totalPages: cachedData.totalPages,
        });
        return;
      }
    }

    try {
      // Mark request as ongoing
      ongoingRequestsRef.current.add(cacheKey);
      setProductsData((prev) => ({ ...prev, loading: true, error: null }));

      const { buildApiUrl, createFetchConfig, API_ENDPOINTS } = await import(
        "@/constant/api.constant"
      );

      // Build API URL with category and pagination parameters
      const params: Record<string, any> = {
        per_page: productsPerPage,
        page: page,
      };

      // Add category filter if not "all"
      if (categoryId !== "all") {
        params.category = categoryId;
      }

      const url = buildApiUrl(API_ENDPOINTS.PRODUCTS, params);
      const fetchConfig = createFetchConfig();

      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const products = await response.json();

      // Get pagination info from headers (handle case variations)
      const totalProducts = parseInt(
        response.headers.get("X-WP-Total") ||
          response.headers.get("x-wp-total") ||
          "0"
      );
      const totalPages = parseInt(
        response.headers.get("X-WP-TotalPages") ||
          response.headers.get("x-wp-totalpages") ||
          "1"
      );

      console.log("Pagination info:", {
        totalProducts,
        totalPages,
        currentPage: page,
      });

      const newData = {
        products,
        loading: false,
        error: null,
        totalProducts,
        totalPages,
      };

      // Cache the data
      productCache.set(cacheKey, {
        products,
        totalProducts,
        totalPages,
        timestamp: Date.now(),
      });

      setProductsData(newData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsData((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      }));
    } finally {
      // Remove from ongoing requests
      ongoingRequestsRef.current.delete(cacheKey);
    }
  };

  // Fetch products when category or page changes
  useEffect(() => {
    fetchProducts(selectedCategory, currentPage);
  }, [selectedCategory, currentPage, productsPerPage]);

  return {
    ...productsData,
    refetch: () => fetchProducts(selectedCategory, currentPage, true), // Force refresh on manual refetch
  };
};
