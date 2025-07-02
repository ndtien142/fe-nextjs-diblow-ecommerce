"use client";

import { Product } from "@/types/product.interface";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface IProductSliderProps {
  //   products: Product[];
  loading?: boolean;
  error?: string | null;
  autoPlayInterval?: number;
}

const DUMMY_PRODUCTS = [
  {
    id: 1051,
    name: "Test tạo sản phẩm sale",
    slug: "test-tao-san-pham-sale",
    price: 250000,
    regular_price: 300000,
    sale_price: 250000,
    image:
      "https://ndtien142.xyz/wp-content/uploads/2022/01/jacobwithu-rWl3QFqMvJg-unsplash.jpg",
    on_sale: true,
    categories: ["Áo", "Áo khoác hè"],
    tags: ["áo khoác hè", "sản phẩm mới"],
  },
  {
    id: 18,
    name: "Dress Shirt / Forest Green",
    slug: "dress-shirt-forest-green",
    price: 140000,
    regular_price: "",
    sale_price: "",
    image: "https://ndtien142.xyz/wp-content/uploads/2019/01/shirt-green.jpg",
    on_sale: false,
    categories: ["Uncategorized"],
    tags: [],
  },
  {
    id: 12,
    name: "Jacket / Brown",
    slug: "jacket-brown",
    price: 18,
    regular_price: 18,
    sale_price: "",
    image:
      "https://ndtien142.xyz/wp-content/uploads/2022/01/vecteezy_beige-suit-hanging-with-wood-hanger__68.jpg",
    on_sale: false,
    categories: ["Uncategorized"],
    tags: [],
  },
];

const ProductSlider = ({
  //   products,
  autoPlayInterval,
  error,
  loading,
}: IProductSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || DUMMY_PRODUCTS.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DUMMY_PRODUCTS.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, DUMMY_PRODUCTS.length, isAutoPlaying, autoPlayInterval]);

  const goToPrevious = () => {
    const prevIndex =
      currentSlide === 0 ? DUMMY_PRODUCTS.length - 1 : currentSlide - 1;
    setCurrentSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (currentSlide + 1) % DUMMY_PRODUCTS.length;
    setCurrentSlide(nextIndex);
  };

  return (
    <div className="m-0 p-0 ">
      <div className="container">
        <div className="overflow-hidden relative w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out gap-1.5"
            // style={{
            //   transform: `translateX(-${currentSlide * 100}%)`,
            // }}
          >
            {DUMMY_PRODUCTS.map((product, index) => (
              <div
                className="flex flex-col items-center relative gap-1.5 p-0 m-0"
                key={index}
              >
                <div className="sm:w-[184px] sm:h-[230px] md:w-[230px] md:h-[345px] lg:w-[275px] lg:h-[300px] flex-shrink-0 p-2 overflow-hidden object-cover">
                  <Image
                    width={275}
                    height={300}
                    src={product.image || ""}
                    alt="test image"
                  />
                </div>
                <div className="px-2.5 py-3.5 flex flex-col items-center justify-center gap-1">
                  <p className="text-sm">{product.name}</p>
                  <p className="text-sm">{product.price}</p>
                </div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
