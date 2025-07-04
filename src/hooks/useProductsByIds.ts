import { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/types/product.interface";
import {
  API_ENDPOINTS,
  buildApiUrl,
  createFetchConfig,
} from "@/constant/api.constant";

interface UseProductsByIdsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductsByIds = (
  productIds: number[],
  autoFetch = true
): UseProductsByIdsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(autoFetch && productIds.length > 0);
  const [error, setError] = useState<string | null>(null);

  // Keep track of the last fetched IDs to avoid duplicate requests
  const lastFetchedIds = useRef<string>("");

  // Create a stable string representation of the IDs
  const idsString = productIds.sort((a, b) => a - b).join(",");

  const fetchProductsByIds = useCallback(async () => {
    if (!productIds.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // Skip if we've already fetched these exact IDs
    if (lastFetchedIds.current === idsString) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build URL with include parameter for specific product IDs
      const params = {
        include: productIds.join(","),
        per_page: productIds.length,
      };

      const url = buildApiUrl(API_ENDPOINTS.PRODUCTS, params);
      console.log("Fetching products by IDs from:", url);

      const fetchConfig = createFetchConfig();
      const response = await fetch(url, fetchConfig);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products by IDs");
      }

      const data: Product[] = await response.json();
      console.log("Products fetched by IDs:", data.length);

      setProducts(data);
      lastFetchedIds.current = idsString; // Update the last fetched IDs
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unknown error fetching products by IDs";
      console.error("Error fetching products by IDs:", err);
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [idsString, productIds]); // Use idsString instead of productIds.join(",")

  useEffect(() => {
    if (autoFetch && idsString !== lastFetchedIds.current) {
      fetchProductsByIds();
    }
  }, [idsString, autoFetch, fetchProductsByIds]);

  return {
    products,
    loading,
    error,
    refetch: fetchProductsByIds,
  };
};
