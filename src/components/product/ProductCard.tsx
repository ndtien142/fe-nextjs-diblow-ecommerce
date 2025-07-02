import { Product } from "@/types/product.interface";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";

interface IProductCardProps {
  product: Product;
}
const ProductCard = ({ product }: IProductCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div
      className="flex flex-col items-center relative gap-1.5 p-0 m-0 cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg group"
      onClick={handleCardClick}
    >
      <div className="sm:w-[184px] sm:h-[230px] md:w-[230px] md:h-[345px] lg:w-[275px] lg:h-[300px] flex-shrink-0 p-2 overflow-hidden object-cover group-hover:scale-105 transition-transform duration-300">
        <Image
          width={275}
          height={300}
          src={product?.images[0]?.src || ""}
          alt={product?.images[0]?.alt || "Product Image"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-2.5 py-3.5 flex flex-col items-center justify-center gap-1">
        <p className="text-sm group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </p>
        {product?.on_sale ? (
          <div className="flex items-center gap-2">
            <p className="text-sm line-through text-gray-500">
              {formatPrice(product.regular_price)}
            </p>
            <p className="text-sm font-semibold text-red-500 group-hover:text-red-600 transition-colors duration-300">
              {formatPrice(product.sale_price)}
            </p>
          </div>
        ) : (
          <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors duration-300">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
      {/* Discount badge */}
      {product?.on_sale && (
        <div className="absolute top-0 left-0 w-[50px] h-[50px] z-10 translate-y-2 translate-x-2 mx-auto">
          <div
            className="w-full py-1.5 text-sm text-[#333] bg-[#FDD464] rounded border-b-r-[1px] mx-auto
                      after:absolute after:content-[''] after-w-[25px] after:inline-block after-border after:border-solid after:border-t-[5px] after:bottom-[-10px] after:border-t-solid after:border-t-[#fdd464] after:border-l-[24px] after:border-r-[25px] after:border-l-transparent after:border-r-transparent after:border-r-solid after:border-l-solid"
            style={{
              borderBottomRightRadius: "1px",
              borderBottomLeftRadius: "1px",
            }}
          >
            <div className="mb-[0.5px] text-center py-0">
              <span className="text-lg font-futura-medium">38</span>
              <span className="text-[10px]">%</span>
            </div>
            <span className="block text-center text-[10px]">off</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
