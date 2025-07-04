"use client";

import React from "react";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";

/**
 * Static components that render immediately without data fetching
 * These components provide instant visual feedback to users
 */
const StaticHomeSection: React.FC = () => {
  return (
    <>
      {/* Static promotional banner with pre-defined content */}
      <FeaturedProduct />

      {/* Static banner section */}
      <Banner />

      {/* Newsletter signup - static form */}
      <NewsLetter />
    </>
  );
};

export default StaticHomeSection;
