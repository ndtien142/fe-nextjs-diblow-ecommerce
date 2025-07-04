import { useState, useEffect } from "react";
import { Product } from "@/types/product.interface";

interface UsePopularProductsOptions {
  per_page?: number;
  strategy?: "popular" | "trending";
}

interface UsePopularProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePopularProducts = (
  options: UsePopularProductsOptions = {}
): UsePopularProductsResult => {
  const { per_page = 8, strategy = "trending" } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint =
        strategy === "trending"
          ? `/api/products/trending?per_page=${per_page}`
          : `/api/products/popular?per_page=${per_page}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to fetch ${strategy} products`
        );
      }

      const data: Product[] = await response.json();

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
  };

  useEffect(() => {
    fetchPopularProducts();
  }, [per_page, strategy]);

  return {
    products,
    loading,
    error,
    refetch: fetchPopularProducts,
  };
};
