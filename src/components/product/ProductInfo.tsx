import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

interface ProductInfoProps {
  product: {
    name: string;
    average_rating?: string;
    rating_count?: number;
    short_description?: string;
    description?: string;
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div>
      {/* Product Title */}
      <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              className="h-4 w-4"
              src={
                index < Math.floor(parseFloat(product.average_rating || "0"))
                  ? assets.star_icon
                  : assets.star_dull_icon
              }
              alt="star_icon"
            />
          ))}
        </div>
        <p>({product.average_rating || "0"})</p>
        <p className="text-sm text-gray-500">
          ({product.rating_count || 0} reviews)
        </p>
      </div>

      {/* Description */}
      <div
        className="text-gray-600 mt-3"
        dangerouslySetInnerHTML={{
          __html:
            product.short_description ||
            product.description ||
            "No description available",
        }}
      />
    </div>
  );
};

export default ProductInfo;
