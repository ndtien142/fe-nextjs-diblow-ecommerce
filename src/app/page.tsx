"use client";
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import PopularProducts from "@/components/PopularProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";

const Home = () => {
  // Use the useProducts hook to fetch all products for general display
  const { products, loading, error, refetch } = useProducts({
    strategy: "all",
    per_page: 20,
    autoFetch: true,
  });

  console.log(
    "Products from useProducts hook:",
    products.length,
    "products loaded"
  );

  // Handle retry functionality
  const handleRetry = () => {
    console.log("Retrying to fetch products...");
    refetch();
  };

  return (
    <>
      <Navbar />
      <div className="m-0 font-futura-book">
        <div className="px-6 md:px-16 lg:px-32">
          <HeaderSlider />
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <div className="ml-4 text-lg text-gray-600 font-futura-book">
                Đang tải sản phẩm...
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="text-lg text-red-600 mb-4 font-futura-medium">
                Lỗi khi tải sản phẩm
              </div>
              <div className="text-sm text-gray-500 mb-4 font-futura-book">
                {error}
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
