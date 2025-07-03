"use client";
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import PopularProducts from "@/components/PopularProducts";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useSlider } from "@/hooks/useSlider";
import ProductSlider from "@/components/product/ProductSlider";

const Home = () => {
  // Fetch products for general display
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({
    strategy: "all",
    per_page: 20,
    autoFetch: true,
  });

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

  console.log(
    "Products from useProducts hook:",
    products.length,
    "products loaded"
  );

  console.log("Slides from useSlider hook:", slides.length, "slides loaded");

  // Handle retry functionality
  const handleRetry = () => {
    console.log("Retrying to fetch data...");
    refetchProducts();
    refetchSliders();
  };

  // Show loading state if either products or sliders are loading
  const isLoading = productsLoading || slidersLoading;
  const hasError = productsError || slidersError;
  const errorMessage = productsError || slidersError;

  return (
    <>
      <Navbar />
      <div className="m-0 font-futura-book">
        {/* Pass slider data to HeaderSlider */}
        <HeaderSlider
          slides={slides}
          loading={slidersLoading}
          error={slidersError}
        />
        <ProductSlider />

        <div className="container md:px-16 lg:px-32">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <div className="ml-4 text-lg text-gray-600 font-futura-book">
                Đang tải dữ liệu...
              </div>
            </div>
          ) : hasError ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="text-lg text-red-600 mb-4 font-futura-medium">
                Lỗi khi tải dữ liệu
              </div>
              <div className="text-sm text-gray-500 mb-4 font-futura-book">
                {errorMessage}
              </div>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-futura-medium"
              >
                Thử lại
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              <HomeProducts />
              <PopularProducts
                title="🔥 Sản phẩm xu hướng"
                count={8}
                strategy="trending"
                className="my-16"
              />
              <FeaturedProduct />
              <PopularProducts
                title="⭐ Sản phẩm phổ biến nhất"
                count={4}
                strategy="popular"
                className="my-16"
              />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="text-lg text-gray-600 mb-4 font-futura-book">
                Không tìm thấy sản phẩm
              </div>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-futura-medium"
              >
                Làm mới
              </button>
            </div>
          )}
          <Banner />
          <NewsLetter />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
