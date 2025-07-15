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
      <h1 className="text-xl uppercase font-helvetica-bold text-gray-800/90 mb-4">
        {product.name}
      </h1>
    </div>
  );
};

export default ProductInfo;
