"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ShopPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to all-products page
    router.replace("/all-products");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
};

export default ShopPage;
