"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product.interface";
import { formatPrice } from "@/utils/formatPrice";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";

interface ModelQuickViewProductProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ModelQuickViewProduct = ({
  product,
  isOpen,
  onClose,
}: ModelQuickViewProductProps) => {
  const { addToCart, router } = useAppContext();
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    null
  );

  // Fetch product details with variations
  const {
    product: productData,
    variations,
    loading,
  } = useProductDetail(product.id.toString(), {
    fetchVariations: true,
  });

  // Initialize main image
  useEffect(() => {
    if (productData?.images && productData.images.length > 0) {
      setMainImage(productData.images[0].src);
    } else if (product.images && product.images.length > 0) {
      setMainImage(product.images[0].src);
    }
  }, [productData, product]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedAttributes({});
      setSelectedVariation(null);
    }
  }, [isOpen]);

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

    const matchingVariation = findMatchingVariation(newAttributes);
    if (matchingVariation) {
      setSelectedVariation(matchingVariation.id);
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

    const currentProduct = productData || product;
    return {
      price: currentProduct.price,
      regular_price: currentProduct.regular_price || currentProduct.price,
      sale_price: currentProduct.sale_price,
      on_sale: currentProduct.on_sale,
    };
  };

  // Get current stock status
  const getCurrentStock = () => {
    if (selectedVariation) {
      const variation = variations.find((v) => v.id === selectedVariation);
      return variation?.stock_status || "outofstock";
    }
    return productData?.stock_status || product.stock_status || "instock";
  };

  // Check if product can be added to cart
  const canAddToCart = () => {
    const stockOk = getCurrentStock() === "instock";
    const attributesOk = areAllAttributesSelected();
    return stockOk && attributesOk;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (canAddToCart()) {
      const currentProduct = productData || product;
      const currentVariation = selectedVariation
        ? variations.find((v) => v.id === selectedVariation)
        : undefined;

      addToCart(
        product.id,
        selectedVariation || undefined,
        currentProduct,
        currentVariation
      );
      onClose();
    }
  };

  // Handle view product
  const handleViewProduct = () => {
    router.push(`/product/${product.id}`);
    onClose();
  };

  // Calculate sale percentage
  const calculateSalePercentage = (): number => {
    const currentPrice = getCurrentPrice();
    if (
      !currentPrice.on_sale ||
      !currentPrice.regular_price ||
      !currentPrice.sale_price
    ) {
      return 0;
    }

    const regularPrice = parseFloat(currentPrice.regular_price.toString());
    const salePrice = parseFloat(currentPrice.sale_price.toString());

    if (regularPrice <= 0 || salePrice <= 0) {
      return 0;
    }

    const discount = regularPrice - salePrice;
    const percentage = Math.round((discount / regularPrice) * 100);

    return percentage;
  };

  if (!isOpen) return null;

  const currentProduct = productData || product;
  const currentPrice = getCurrentPrice();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[]80"
        onClick={onClose}
      />
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto z-[9999]">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={
                      mainImage ||
                      currentProduct.images?.[0]?.src ||
                      "/placeholder-image.jpg"
                    }
                    alt={currentProduct.name}
                    fill
                    className="object-cover"
                    onError={() => setMainImage("/placeholder-image.jpg")}
                  />
                  {/* Sale Badge */}
                  {currentPrice.on_sale && calculateSalePercentage() > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{calculateSalePercentage()}%
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {currentProduct.images && currentProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {currentProduct.images.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setMainImage(image.src)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                          mainImage === image.src
                            ? "border-blue-500"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt || `Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Product Name */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {currentProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Image
                        key={index}
                        className="h-4 w-4"
                        src={
                          index <
                          Math.floor(
                            parseFloat(currentProduct.average_rating || "0")
                          )
                            ? assets.star_icon
                            : assets.star_dull_icon
                        }
                        alt="star_icon"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({currentProduct.average_rating || "0"}) •{" "}
                    {currentProduct.rating_count || 0} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  {currentPrice.on_sale ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(
                          currentPrice.sale_price || currentPrice.price
                        )}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(currentPrice.regular_price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-800">
                      {formatPrice(currentPrice.price)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      getCurrentStock() === "instock"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getCurrentStock() === "instock"
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Short Description */}
                {currentProduct.short_description && (
                  <div className="text-sm text-gray-600">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentProduct.short_description,
                      }}
                    />
                  </div>
                )}

                {/* Attributes Section */}
                {currentProduct.attributes &&
                  currentProduct.attributes.length > 0 && (
                    <div className="space-y-4">
                      {currentProduct.type === "variable" &&
                      variations.length > 0 ? (
                        // Variable product - show attribute selection
                        <>
                          <h3 className="font-medium text-gray-800">
                            Select Options
                          </h3>
                          {Object.entries(getAttributeOptions()).map(
                            ([attributeName, options]) => (
                              <div key={attributeName} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {attributeName}
                                  {!selectedAttributes[attributeName] && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {options.map((option) => (
                                    <button
                                      key={option}
                                      onClick={() =>
                                        handleAttributeChange(
                                          attributeName,
                                          option
                                        )
                                      }
                                      className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                                        selectedAttributes[attributeName] ===
                                        option
                                          ? "border-blue-500 bg-blue-50 text-blue-700"
                                          : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          )}

                          {!areAllAttributesSelected() && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <p className="text-sm text-amber-800">
                                Please select all required options to add this
                                product to your cart.
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        // Simple product - show attributes as informational
                        <>
                          <h3 className="font-medium text-gray-800">
                            Product Attributes
                          </h3>
                          <div className="space-y-3">
                            {currentProduct.attributes
                              .filter((attr) => attr.visible !== false)
                              .map((attribute, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-start"
                                >
                                  <span className="text-sm font-medium text-gray-700 capitalize">
                                    {attribute.name}:
                                  </span>
                                  <span className="text-sm text-gray-600 text-right max-w-[60%]">
                                    {attribute.options &&
                                    attribute.options.length > 0
                                      ? attribute.options.join(", ")
                                      : attribute.option || "N/A"}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                {/* Product Meta */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="text-gray-800">
                      {currentProduct.sku || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-800">
                      {currentProduct.categories?.[0]?.name || "Uncategorized"}
                    </span>
                  </div>
                  {currentProduct.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="text-gray-800">
                        {currentProduct.weight}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart()}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                      canAddToCart()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {getCurrentStock() !== "instock"
                      ? "Out of Stock"
                      : !areAllAttributesSelected()
                      ? "Select Options"
                      : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleViewProduct}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelQuickViewProduct;
