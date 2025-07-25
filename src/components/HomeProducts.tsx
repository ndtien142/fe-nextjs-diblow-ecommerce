import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import { useProducts } from "@/hooks/useProducts";

const HomeProducts = () => {
  const { router } = useAppContext();

  // Fetch popular/featured products for the homepage
  const { products, loading, error } = useProducts({
    strategy: "popular",
    per_page: 10,
    featured: true,
  });

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          router.push("/all-products");
        }}
        className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
