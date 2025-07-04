import { useState, useEffect } from "react";
import { Product, ProductVariation } from "@/types/product.interface";

interface UseProductDetailOptions {
  autoFetch?: boolean;
  fetchVariations?: boolean;
}

interface UseProductDetailResult {
  product: Product | null;
  variations: ProductVariation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductDetail = (
  productId: string | number | undefined,
  options: UseProductDetailOptions = {}
): UseProductDetailResult => {
  const { autoFetch = true, fetchVariations = false } = options;

  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = async () => {
    if (!productId) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch product details
      const productResponse = await fetch(`/api/products/${productId}`);

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(
          errorData.error || `Failed to fetch product ${productId}`
        );
      }

      const productData: Product = await productResponse.json();

      setProduct(productData);

      // Fetch variations if requested and product is variable
      if (
        fetchVariations &&
        productData.type === "variable" &&
        productData.variations.length > 0
      ) {
        try {
          const variationsResponse = await fetch(
            `/api/products/${productId}/variations`
          );

          if (variationsResponse.ok) {
            const variationsData: ProductVariation[] =
              await variationsResponse.json();
            setVariations(variationsData);
          } else {
            console.warn("Failed to fetch variations, continuing without them");
            setVariations([]);
          }
        } catch (variationError) {
          console.warn("Error fetching variations:", variationError);
          setVariations([]);
        }
      } else {
        setVariations([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Unknown error fetching product ${productId}`;
      console.error(`Error fetching product ${productId}:`, err);
      setError(errorMessage);
      setProduct(null);
      setVariations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && productId) {
      fetchProductDetail();
    }
  }, [productId, autoFetch]);

  return {
    product,
    variations,
    loading,
    error,
    refetch: fetchProductDetail,
  };
};
