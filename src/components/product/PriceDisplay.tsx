import React from "react";

interface PriceDisplayProps {
  price: string;
  regularPrice: string;
  salePrice?: string;
  onSale: boolean;
  currency: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  regularPrice,
  salePrice,
  onSale,
  currency,
}) => {
  return (
    <div className="mt-6">
      {onSale ? (
        <div className="flex items-center gap-3">
          <p className="text-3xl font-medium text-green-600">
            {currency}
            {parseFloat(salePrice || price).toLocaleString()}
          </p>
          <p className="text-base font-normal text-gray-800/60 line-through">
            {currency}
            {parseFloat(regularPrice).toLocaleString()}
          </p>
          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded">
            SALE
          </span>
        </div>
      ) : (
        <p className="text-3xl font-medium">
          {currency}
          {parseFloat(price).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;
