"use client";
import { Product } from "@/types/product.interface";
import Image from "next/image";
import React, { useState } from "react";
import { formatPrice } from "@/utils/formatPrice";
import ModelQuickViewProduct from "./ModelQuickViewProduct";
import { useAppContext } from "@/context/AppContext";

interface IProductCardProps {
  product: Product;
}
const ProductCard = ({ product }: IProductCardProps) => {
  const { router } = useAppContext();
  const [showQuickView, setShowQuickView] = useState(false);

  // Calculate sale percentage
  const calculateSalePercentage = (): number => {
    if (!product?.on_sale || !product.regular_price || !product.sale_price) {
      return 0;
    }

    const regularPrice = parseFloat(product.regular_price.toString());
    const salePrice = parseFloat(product.sale_price.toString());

    if (regularPrice <= 0 || salePrice <= 0) {
      return 0;
    }

    const discount = regularPrice - salePrice;
    const percentage = Math.round((discount / regularPrice) * 100);

    return percentage;
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowQuickView(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    router.push(`/product/${product.id}`);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
  };

  return (
    <div>
      <div className="flex flex-col items-center relative gap-1.5 p-0 m-0 cursor-pointer duration-300 rounded-lg group">
        <div className="flex-shrink-0 overflow-hidden object-cover transition-transform duration-300 relative h-[210px] sm:h-[230px] md:h-[220px] lg:h-[230px] w-full">
          <div onClick={handleAddToCart}>
            <Image
              width={275}
              height={300}
              src={product?.images[0]?.src || ""}
              alt={product?.images[0]?.alt || "Product Image"}
              className="w-full h-full object-cover duration-1000 group-hover:scale-125"
              style={{
                transition: ".5s ease all",
                objectFit: "cover",
              }}
            />
          </div>
          {/* Hover buttons overlay */}
          <div className="absolute bottom-0 translate-y-[100%] group-hover:translate-y-[0%] hover:translate-y-[-2%] transition-opacity duration-300 flex items-end justify-center w-full gap-0 p-0 m-0 z-30">
            <div className="flex gap-2 w-full bg-black">
              <button
                onClick={handleQuickView}
                className="text-white pl-5 py-2 rounded-md text-sm font-medium  transition-colors cursor-pointer duration-200 gap-2 flex items-center w-[50%]"
              >
                <span className="text-[12px] text-nowrap">Xem nhanh</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                onClick={handleAddToCart}
                className="text-white py-2 pr-5 rounded-md text-sm font-medium  transition-colors cursor-pointer duration-200 flex items-center gap-2 w-[50%] justify-end"
              >
                <span className="text-[12px] text-nowrap">Mua ngay</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          onClick={handleAddToCart}
          className="py-3.5 flex flex-col items-center justify-center gap-1 w-full"
        >
          <p className="text-sm group-hover:text-neutral-500 transition-colors duration-300">
            {product.name}
          </p>
          {product?.on_sale ? (
            <div className="flex items-center gap-2">
              <p className="text-[14px] line-through text-gray-500">
                {formatPrice(product.regular_price)}
              </p>
              <p className="text-[14px] font-futura-heavy text-black group-hover:text-neutral-500 transition-colors duration-300">
                {formatPrice(product.sale_price)}
              </p>
            </div>
          ) : (
            <p className="text-[14px] font-futura-heavy group-hover:text-neutral-500 transition-colors duration-300">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
        {/* Discount badge */}
        {product?.on_sale && calculateSalePercentage() > 0 && (
          <div className="absolute top-0 left-0 w-[50px] h-[50px] z-10">
            <div
              className="w-full py-1.5 text-sm text-[#333] bg-[#FDD464] rounded border-b-r-[1px] mx-auto
                      after:absolute after:content-[''] after-w-[25px] after:inline-block after-border after:border-solid after:border-t-[5px] after:bottom-[-2px]  sm:after:bottom-[-10px] after:border-t-solid after:border-t-[#FDD464] after:border-l-[24px] after:border-r-[25px] after:border-l-transparent after:border-r-transparent after:border-r-solid after:border-l-solid"
              style={{
                borderBottomRightRadius: "1px",
                borderBottomLeftRadius: "1px",
              }}
            >
              <div className="mb-[0.5px] text-center py-0">
                <span className="text-sm sm:text-lg font-futura-medium">
                  {calculateSalePercentage()}
                </span>
                <span className="text-[10px]">%</span>
              </div>
              <span className="block text-center text-[10px]">off</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ModelQuickViewProduct
        product={product}
        isOpen={showQuickView}
        onClose={closeQuickView}
      />
    </div>
  );
};

export default ProductCard;
