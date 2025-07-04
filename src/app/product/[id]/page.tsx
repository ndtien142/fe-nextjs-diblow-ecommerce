"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useProducts } from "@/hooks/useProducts";
import React from "react";
import {
  ProductGallery,
  ProductInfo,
  PriceDisplay,
  ProductAttributes,
  ProductDetailsTable,
  QuantitySelector,
  AddToCartSection,
  RelatedProducts,
} from "@/components/product";

const Product = () => {
  const { id } = useParams();
  const { currency, router, addToCart, isCartLoading } = useAppContext();

  // Fetch product details from WooCommerce API
  const {
    product: productData,
    variations,
    loading,
    error,
    refetch,
  } = useProductDetail(id as string, {
    fetchVariations: true,
  });

  // Fetch related/featured products
  const { products: featuredProducts } = useProducts({
    strategy: "all",
    per_page: 5,
    featured: true,
  });

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    null
  );
  const [availableVariations, setAvailableVariations] = useState<
    typeof variations
  >([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Cart message type
  interface CartMessage {
    text: string;
    type: "success" | "error";
  }
  const [cartMessage, setCartMessage] = useState<CartMessage | null>(null);

  // Set main image when product data loads
  useEffect(() => {
    if (productData?.images && productData.images.length > 0) {
      setMainImage(productData.images[0].src);
    }
  }, [productData]);

  // Update available variations when product loads
  useEffect(() => {
    if (variations.length > 0) {
      setAvailableVariations(variations);
    }
  }, [variations]);

  // Find matching variation based on selected attributes
  const findMatchingVariation = (attributes: Record<string, string>) => {
    return variations.find((variation) => {
      if (!variation.attributes) return false;

      // Check if all selected attributes match this variation
      return Object.keys(attributes).every((attrName) => {
        const selectedValue = attributes[attrName];
        const variationAttr = variation.attributes?.find(
          (attr) => attr.name === attrName
        );
        return variationAttr?.option === selectedValue;
      });
    });
  };

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variation
    const matchingVariation = findMatchingVariation(newAttributes);
    if (matchingVariation) {
      setSelectedVariation(matchingVariation.id);

      // Update main image if variation has an image
      if (matchingVariation.image?.src) {
        setMainImage(matchingVariation.image.src);
      }
    } else {
      setSelectedVariation(null);
    }
  };

  // Check if all required attributes are selected
  const areAllAttributesSelected = () => {
    if (productData?.type !== "variable" || !variations.length) return true;

    // Get all unique attribute names from variations
    const requiredAttributes = new Set<string>();
    variations.forEach((variation) => {
      variation.attributes?.forEach((attr) => {
        if (attr.name) {
          requiredAttributes.add(attr.name);
        }
      });
    });

    return Array.from(requiredAttributes).every(
      (attr) => selectedAttributes[attr]
    );
  };

  // Get current price based on selected variation or main product
  const getCurrentPrice = () => {
    if (selectedVariation) {
      const variation = variations.find((v) => v.id === selectedVariation);
      if (variation) {
        return {
          price: variation.price,
          regular_price: variation.regular_price || variation.price,
          sale_price: variation.sale_price,
          on_sale:
            variation.on_sale || parseFloat(variation.sale_price || "0") > 0,
        };
      }
    }

    if (!productData) {
      return {
        price: "0",
        regular_price: "0",
        sale_price: "",
        on_sale: false,
      };
    }

    return {
      price: productData.price,
      regular_price: productData.regular_price,
      sale_price: productData.sale_price,
      on_sale: productData.on_sale,
    };
  };

  // Get current stock status
  const getCurrentStock = () => {
    if (selectedVariation) {
      const variation = variations.find((v) => v.id === selectedVariation);
      return variation?.stock_status || "outofstock";
    }
    return productData?.stock_status || "outofstock";
  };

  // Check if product can be added to cart
  const canAddToCart = () => {
    const stockOk = getCurrentStock() === "instock";
    const attributesOk = areAllAttributesSelected();
    return stockOk && attributesOk;
  };

  // Handle add to cart with variation support
  const handleAddToCart = async () => {
    if (!productData || !canAddToCart()) return;

    setIsAddingToCart(true);
    setCartMessage(null);

    try {
      // Get variation data if a variation is selected
      const variationData = selectedVariation
        ? variations.find((v) => v.id === selectedVariation)
        : undefined;

      // Add items to cart based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart(
          productData.id,
          selectedVariation || undefined,
          productData,
          variationData
        );
      }

      setCartMessage({
        text: `✓ ${quantity} item${quantity > 1 ? "s" : ""} added to cart!`,
        type: "success",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setCartMessage({
        text: "Failed to add to cart. Please try again.",
        type: "error",
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setCartMessage(null);
      }, 5000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!productData || !canAddToCart()) return;

    setIsAddingToCart(true);

    try {
      const currentVariation = selectedVariation
        ? variations.find((v) => v.id === selectedVariation)
        : undefined;

      // Add items to cart based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart(
          productData.id,
          selectedVariation || undefined,
          productData,
          currentVariation
        );
      }

      router.push("/cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setCartMessage({
        text: "Failed to add to cart. Please try again.",
        type: "error",
      });
      setIsAddingToCart(false);

      // Clear error message after 5 seconds
      setTimeout(() => {
        setCartMessage(null);
      }, 5000);
    }
  };

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">Product not found</p>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors mr-4"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // No product found
  if (!productData) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Gallery */}
          <ProductGallery
            images={productData.images || []}
            mainImage={
              mainImage ||
              productData.images?.[0]?.src ||
              "/placeholder-image.jpg"
            }
            productName={productData.name}
            onImageSelect={setMainImage}
          />

          {/* Product Details */}
          <div className="flex flex-col">
            <ProductInfo product={productData} />

            <PriceDisplay
              price={getCurrentPrice().price}
              regularPrice={getCurrentPrice().regular_price}
              salePrice={getCurrentPrice().sale_price}
              onSale={getCurrentPrice().on_sale}
              currency={currency || "$"}
            />

            {/* Product Attributes */}
            {productData.type === "variable" && variations.length > 0 && (
              <ProductAttributes
                variations={variations}
                selectedAttributes={selectedAttributes}
                onAttributeChange={handleAttributeChange}
                areAllAttributesSelected={areAllAttributesSelected()}
              />
            )}

            <hr className="bg-gray-600 my-6" />

            <ProductDetailsTable
              product={productData}
              stockStatus={getCurrentStock()}
              selectedVariation={selectedVariation}
            />

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              currency={currency || "$"}
              price={getCurrentPrice().price}
            />

            <AddToCartSection
              canAddToCart={canAddToCart()}
              isAddingToCart={isAddingToCart}
              isCartLoading={isCartLoading}
              stockStatus={getCurrentStock()}
              areAllAttributesSelected={areAllAttributesSelected()}
              quantity={quantity}
              cartMessage={cartMessage}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewCart={() => router.push("/cart")}
            />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          products={featuredProducts}
          onSeeMore={() => router.push("/")}
          title="Featured Products"
        />
      </div>
      <Footer />
    </>
  );
};

export default Product;
