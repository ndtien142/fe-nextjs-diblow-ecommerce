import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product.interface";

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

  const buildApiUrl = useCallback(() => {
    let baseUrl = "/api/products";

    // Choose the correct endpoint based on strategy
    switch (strategy) {
      case "popular":
        baseUrl = "/api/products/popular";
        break;
      case "trending":
        baseUrl = "/api/products/trending";
        break;
      case "bestsellers":
        baseUrl = "/api/products/bestsellers";
        break;
      default:
        baseUrl = "/api/products";
        break;
    }

    const params = new URLSearchParams();

    if (per_page) params.append("per_page", per_page.toString());
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (orderby) params.append("orderby", orderby);
    if (order) params.append("order", order);
    if (featured !== undefined) params.append("featured", featured.toString());
    if (on_sale !== undefined) params.append("on_sale", on_sale.toString());

    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
  }, [strategy, per_page, category, search, orderby, order, featured, on_sale]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = buildApiUrl();
      console.log(`Fetching ${strategy} products from:`, url);

      const response = await fetch(url);

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
  }, [buildApiUrl, strategy]);

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
