import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product.interface";
import {
  API_ENDPOINTS,
  buildApiUrl,
  createFetchConfig,
} from "@/constant/api.constant";

export type ProductStrategy =
  | "all"
  | "popular"
  | "trending"
  | "bestsellers"
  | "featured"
  | "on-sale";

interface UseProductsOptions {
  strategy?: ProductStrategy;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: "date" | "title" | "menu_order" | "popularity" | "rating" | "price";
  order?: "asc" | "desc";
  featured?: boolean;
  on_sale?: boolean;
  autoFetch?: boolean;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore?: boolean;
  loadMore?: () => Promise<void>;
}

export const useProducts = (
  options: UseProductsOptions = {}
): UseProductsResult => {
  const {
    strategy = "all",
    per_page = 10,
    category,
    search,
    orderby,
    order,
    featured,
    on_sale,
    autoFetch = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const buildProductsUrl = useCallback(() => {
    // Choose the correct endpoint based on strategy
    let endpoint: string;
    switch (strategy) {
      case "popular":
        endpoint = API_ENDPOINTS.PRODUCTS_POPULAR;
        break;
      case "trending":
        endpoint = API_ENDPOINTS.PRODUCTS_TRENDING;
        break;
      case "bestsellers":
        endpoint = API_ENDPOINTS.PRODUCTS_BESTSELLERS;
        break;
      case "featured":
        endpoint = API_ENDPOINTS.PRODUCTS_FEATURED;
        break;
      case "on-sale":
        endpoint = API_ENDPOINTS.PRODUCTS_ON_SALE;
        break;
      default:
        endpoint = API_ENDPOINTS.PRODUCTS;
        break;
    }

    // Build query parameters
    const params: Record<string, any> = {};
    if (per_page) params.per_page = per_page;
    if (category) params.category = category;
    if (search) params.search = search;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;
    if (featured !== undefined) params.featured = featured;
    if (on_sale !== undefined) params.on_sale = on_sale;

    return buildApiUrl(endpoint, params);
  }, [strategy, per_page, category, search, orderby, order, featured, on_sale]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = buildProductsUrl();
      console.log(`Fetching ${strategy} products from:`, url);

      // Use the fetch configuration helper
      const fetchConfig = createFetchConfig();
      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to fetch ${strategy} products`
        );
      }

      const data: Product[] = await response.json();
      console.log(`${strategy} products fetched:`, data.length);

      setProducts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Unknown error fetching ${strategy} products`;
      console.error(`Error fetching ${strategy} products:`, err);
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [buildProductsUrl, strategy]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

// Specific hooks for common use cases
export const usePopularProducts = (per_page = 8) =>
  useProducts({ strategy: "popular", per_page });

export const useTrendingProducts = (per_page = 8) =>
  useProducts({ strategy: "trending", per_page });

export const useBestsellerProducts = (per_page = 8) =>
  useProducts({ strategy: "bestsellers", per_page });

export const useFeaturedProducts = (per_page = 8) =>
  useProducts({ strategy: "all", per_page, featured: true });

export const useOnSaleProducts = (per_page = 8) =>
  useProducts({ strategy: "all", per_page, on_sale: true });
