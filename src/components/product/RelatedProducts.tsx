import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product.interface";

interface RelatedProductsProps {
  products: Product[];
  onSeeMore: () => void;
  title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  onSeeMore,
  title = "Featured Products",
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-4 mt-16">
        <p className="text-3xl font-medium">
          {title.split(" ")[0]}{" "}
          <span className="font-medium text-orange-600">
            {title.split(" ").slice(1).join(" ")}
          </span>
        </p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        {products.slice(0, 5).map((product, index) => (
          <ProductCard key={product.id || index} product={product} />
        ))}
      </div>

      <button
        onClick={onSeeMore}
        className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        See more
      </button>
    </div>
  );
};

export default RelatedProducts;
