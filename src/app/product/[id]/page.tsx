"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useProducts } from "@/hooks/useProducts";
import ColorSwatch from "@/components/ColorSwatch";
import { isColorAttribute } from "@/utils/colorUtils";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { currency, router, addToCart } = useAppContext();

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

  // Get all unique attribute options from variations
  const getAttributeOptions = () => {
    const attributeOptions: Record<string, Set<string>> = {};

    variations.forEach((variation) => {
      variation.attributes?.forEach((attr) => {
        if (!attributeOptions[attr.name]) {
          attributeOptions[attr.name] = new Set();
        }
        if (attr.option) {
          attributeOptions[attr.name].add(attr.option);
        }
      });
    });

    // Convert Sets to Arrays for easier rendering
    const result: Record<string, string[]> = {};
    Object.keys(attributeOptions).forEach((key) => {
      result[key] = Array.from(attributeOptions[key]).sort();
    });

    return result;
  };

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

    const attributeOptions = getAttributeOptions();
    const requiredAttributes = Object.keys(attributeOptions);

    return requiredAttributes.every((attr) => selectedAttributes[attr]);
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
  const handleAddToCart = () => {
    if (productData) {
      addToCart(productData.id, selectedVariation || undefined);
    }
  };

  const handleBuyNow = () => {
    if (productData) {
      addToCart(productData.id, selectedVariation || undefined);
      router.push("/cart");
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
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={
                  mainImage ||
                  productData.images?.[0]?.src ||
                  "/placeholder-image.jpg"
                }
                alt={productData.name || "Product image"}
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
                onError={() => setMainImage("/placeholder-image.jpg")}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image.src)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Product image ${index + 1}`}
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Image
                    key={index}
                    className="h-4 w-4"
                    src={
                      index <
                      Math.floor(parseFloat(productData.average_rating || "0"))
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="star_icon"
                  />
                ))}
              </div>
              <p>({productData.average_rating || "0"})</p>
              <p className="text-sm text-gray-500">
                ({productData.rating_count || 0} reviews)
              </p>
            </div>

            <div
              className="text-gray-600 mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  productData.short_description ||
                  productData.description ||
                  "No description available",
              }}
            />

            <div className="mt-6">
              {(() => {
                const currentPrice = getCurrentPrice();
                return currentPrice.on_sale ? (
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-medium text-green-600">
                      {currency}
                      {parseFloat(
                        currentPrice.sale_price || currentPrice.price
                      ).toLocaleString()}
                    </p>
                    <p className="text-base font-normal text-gray-800/60 line-through">
                      {currency}
                      {parseFloat(currentPrice.regular_price).toLocaleString()}
                    </p>
                    <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded">
                      SALE
                    </span>
                  </div>
                ) : (
                  <p className="text-3xl font-medium">
                    {currency}
                    {parseFloat(currentPrice.price).toLocaleString()}
                  </p>
                );
              })()}
            </div>

            {/* Attribute Selection for Variable Products */}
            {productData.type === "variable" && variations.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-futura-medium text-lg text-gray-800">
                  Select Options
                </h3>
                {Object.entries(getAttributeOptions()).map(
                  ([attributeName, options]) => (
                    <div key={attributeName} className="space-y-2">
                      <label className="block text-sm font-futura-medium text-gray-700">
                        {attributeName}
                        {!selectedAttributes[attributeName] && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div
                        className={`flex flex-wrap gap-2 ${
                          isColorAttribute(attributeName) ? "items-center" : ""
                        }`}
                      >
                        {isColorAttribute(attributeName) ? (
                          // Color swatches for color attributes
                          <div className="flex flex-wrap gap-3">
                            {options.map((option) => (
                              <div
                                key={option}
                                className="flex flex-col items-center gap-1"
                              >
                                <ColorSwatch
                                  colorName={option}
                                  selected={
                                    selectedAttributes[attributeName] === option
                                  }
                                  onClick={() =>
                                    handleAttributeChange(attributeName, option)
                                  }
                                  size="lg"
                                  showTooltip={true}
                                />
                                <span className="text-xs text-gray-600 font-futura-book max-w-16 text-center truncate">
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Regular buttons for non-color attributes
                          options.map((option) => (
                            <button
                              key={option}
                              onClick={() =>
                                handleAttributeChange(attributeName, option)
                              }
                              className={`px-4 py-2 border rounded-lg transition-all font-futura-book ${
                                selectedAttributes[attributeName] === option
                                  ? "border-orange-500 bg-orange-50 text-orange-700 font-futura-medium"
                                  : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {option}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )
                )}

                {!areAllAttributesSelected() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800 font-futura-book">
                      Please select all required options to add this product to
                      your cart.
                    </p>
                  </div>
                )}
              </div>
            )}

            <hr className="bg-gray-600 my-6" />

            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium py-1">SKU</td>
                    <td className="text-gray-800/50 py-1">
                      {productData.sku || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium py-1">Stock</td>
                    <td className="text-gray-800/50 py-1">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          getCurrentStock() === "instock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getCurrentStock() === "instock"
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                      {selectedVariation && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Selected variation)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium py-1">Category</td>
                    <td className="text-gray-800/50 py-1">
                      {productData.categories?.[0]?.name || "Uncategorized"}
                    </td>
                  </tr>
                  {productData.weight && (
                    <tr>
                      <td className="text-gray-600 font-medium py-1">Weight</td>
                      <td className="text-gray-800/50 py-1">
                        {productData.weight}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className={`w-full py-3.5 font-futura-medium transition ${
                  canAddToCart()
                    ? "bg-gray-100 text-gray-800/80 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                {getCurrentStock() !== "instock"
                  ? "Out of Stock"
                  : !areAllAttributesSelected()
                  ? "Select Options"
                  : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!canAddToCart()}
                className={`w-full py-3.5 font-futura-medium transition ${
                  canAddToCart()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-orange-300 text-orange-100 cursor-not-allowed"
                }`}
              >
                {getCurrentStock() !== "instock"
                  ? "Out of Stock"
                  : !areAllAttributesSelected()
                  ? "Select Options"
                  : "Buy Now"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {featuredProducts.slice(0, 5).map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
          >
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
