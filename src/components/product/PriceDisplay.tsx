import { formatPrice } from "@/utils/formatPrice";
import React from "react";

interface PriceDisplayProps {
  price: string;
  regularPrice: string;
  salePrice?: string;
  onSale: boolean;
  currency: string;
  priceRange?: {
    min: string;
    max: string;
  } | null;
  showRange?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  regularPrice,
  salePrice,
  onSale,
  currency,
  priceRange,
  showRange = false,
}) => {
  // Show price range for variable products when no variation is selected
  if (showRange && priceRange) {
    const minPrice = parseFloat(priceRange.min);
    const maxPrice = parseFloat(priceRange.max);

    if (minPrice === maxPrice) {
      // All variations have the same price
      return (
        <div className="mt-6">
          <p className="text-[18px] font-helvetica-bold">
            {formatPrice(minPrice)}
          </p>
        </div>
      );
    } else {
      // Show price range
      return (
        <div className="mt-6">
          <p className="text-[18px] font-helvetica-bold">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </p>
        </div>
      );
    }
  }

  // Standard price display for simple products or selected variations
  return (
    <div className="mt-6">
      {onSale ? (
        <div className="flex items-center gap-3">
          <p className="text-[18px] font-helvetica-bold">
            {formatPrice(parseFloat(salePrice || price))}
          </p>
          <p className="text-base font-helvetica text-gray-800/60 line-through">
            {formatPrice(parseFloat(regularPrice))}
          </p>
          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded font-helvetica">
            Giảm giá
          </span>
        </div>
      ) : (
        <p className="text-[18px] font-helvetica-bold">
          {formatPrice(parseFloat(price))}
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;
