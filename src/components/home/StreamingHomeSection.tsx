"use client";

import React, { Suspense } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import PopularProducts from "@/components/PopularProducts";
import ProductSlider from "@/components/product/ProductSlider";
import { useSlider } from "@/hooks/useSlider";

/**
 * Loading skeleton for product sections
 */
const ProductSectionSkeleton: React.FC<{ title: string }> = ({ title }) => (
  <div className="my-16">
    <h2 className="text-2xl md:text-3xl font-futura-medium text-center mb-8">
      {title}
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 animate-pulse rounded-lg h-64 w-full"
        >
          <div className="h-48 bg-gray-300 rounded-t-lg"></div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Loading skeleton for header slider
 */
const HeaderSliderSkeleton: React.FC = () => (
  <div className="w-full h-[400px] md:h-[500px] bg-gray-200 animate-pulse flex items-center justify-center">
    <div className="text-gray-400">Loading slider...</div>
  </div>
);

/**
 * Streaming components that fetch data and render progressively
 * These components show loading states while fetching data
 */
const StreamingHomeSection: React.FC = () => {
  // Fetch slider data
  const {
    slides,
    loading: slidersLoading,
    error: slidersError,
    refetch: refetchSliders,
  } = useSlider({
    autoFetch: true,
    per_page: 5,
  });

  // Handle retry functionality
  const handleRetry = () => {
    refetchSliders();
  };

  return (
    <>
      {/* Header Slider with loading state */}
      <Suspense fallback={<HeaderSliderSkeleton />}>
        {slidersLoading ? (
          <HeaderSliderSkeleton />
        ) : slidersError ? (
          <div className="w-full h-[400px] md:h-[500px] bg-red-50 flex flex-col items-center justify-center">
            <div className="text-lg text-red-600 mb-4 font-futura-medium">
              Lỗi khi tải dữ liệu slider
            </div>
            <div className="text-sm text-gray-500 mb-4 font-futura-book">
              {slidersError}
            </div>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-futura-medium"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <HeaderSlider
            slides={slides}
            loading={slidersLoading}
            error={slidersError}
          />
        )}
      </Suspense>

      <div className="container md:px-16 lg:px-32">
        {/* Trending Products Section */}
        <Suspense
          fallback={<ProductSectionSkeleton title="🔥 Sản phẩm xu hướng" />}
        >
          <PopularProducts
            title="🔥 Sản phẩm xu hướng"
            count={8}
            strategy="trending"
            className="my-16"
          />
        </Suspense>

        {/* Popular Products Section */}
        <Suspense
          fallback={
            <ProductSectionSkeleton title="⭐ Sản phẩm phổ biến nhất" />
          }
        >
          <PopularProducts
            title="⭐ Sản phẩm phổ biến nhất"
            count={4}
            strategy="popular"
            className="my-16"
          />
        </Suspense>
      </div>
    </>
  );
};

export default StreamingHomeSection;
