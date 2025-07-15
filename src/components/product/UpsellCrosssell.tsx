"use client";

import React, { useMemo } from "react";
import { Product } from "@/types/product.interface";
import { useProductsByIds } from "@/hooks/useProductsByIds";
import ProductCard from "./ProductCard";

interface UpsellCrosssellProps {
  upsellIds: number[];
  crossSellIds: number[];
  title?: string;
  className?: string;
}

const UpsellCrosssell: React.FC<UpsellCrosssellProps> = ({
  upsellIds,
  crossSellIds,
  title,
  className = "",
}) => {
  // Memoize the filtered IDs to prevent unnecessary re-computations
  const validUpsellIds = useMemo(
    () => (upsellIds || []).filter((id) => id && id > 0),
    [upsellIds]
  );

  const validCrossSellIds = useMemo(
    () => (crossSellIds || []).filter((id) => id && id > 0),
    [crossSellIds]
  );

  // Combine upsell and cross-sell IDs
  const allProductIds = useMemo(
    () => [...validUpsellIds, ...validCrossSellIds],
    [validUpsellIds, validCrossSellIds]
  );

  // Fetch products using the combined IDs
  const { products: relatedProducts, loading } = useProductsByIds(
    allProductIds.length > 0 ? allProductIds : []
  );

  // Memoize the separated products to prevent unnecessary filtering
  const upsellProducts = useMemo(
    () =>
      relatedProducts.filter((product: Product) =>
        validUpsellIds.includes(product.id)
      ),
    [relatedProducts, validUpsellIds]
  );

  const crossSellProducts = useMemo(
    () =>
      relatedProducts.filter((product: Product) =>
        validCrossSellIds.includes(product.id)
      ),
    [relatedProducts, validCrossSellIds]
  );

  // Don't render if no products
  if (
    allProductIds.length === 0 ||
    (!upsellProducts.length && !crossSellProducts.length)
  ) {
    return null;
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Upsell Products */}
      {upsellProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-helvetica-bold uppercase text-gray-900">
              Bạn có thể quan tâm
            </h3>
            <span className="text-sm text-gray-500 font-helvetica">
              {upsellProducts.length} sản phẩm
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {upsellProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cross-sell Products */}
      {crossSellProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-helvetica-bold uppercase text-gray-900">
              Thường mua cùng nhau
            </h3>
            <span className="text-sm text-gray-500 font-helvetica">
              {crossSellProducts.length} sản phẩm
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {crossSellProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpsellCrosssell;
