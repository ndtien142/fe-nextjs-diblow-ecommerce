"use client";
import React, { useEffect, useState } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import PopularProducts from "@/components/PopularProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product.interface";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      console.log("Fetching products from API...");
      const response = await fetch("/api/products");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorData.error}`
        );
      }

      const data: Product[] = await response.json();
      console.log("WooCommerce Products:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set some fallback data or show error state
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <div className="ml-4 text-lg text-gray-600">
              Loading products...
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <HomeProducts />
            <PopularProducts
              title="🔥 Trending Products"
              count={8}
              strategy="trending"
              className="my-16"
            />
            <FeaturedProduct />
            <PopularProducts
              title="⭐ Most Popular"
              count={4}
              strategy="popular"
              className="my-16"
            />
          </>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-gray-600">No products found</div>
          </div>
        )}
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
