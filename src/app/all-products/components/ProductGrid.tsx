import React from "react";
import { Product } from "@/types/product.interface";
import ProductCard from "@/components/product/ProductCard";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {products.map((product: any, index: number) => (
        <ProductCard key={`${product.id}-${index}`} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
