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
  UpsellCrosssell,
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

  // Adjust quantity when stock changes
  useEffect(() => {
    const availableStock = getAvailableStock();
    if (availableStock !== null && quantity > availableStock) {
      setQuantity(Math.max(1, availableStock));
    }
  }, [selectedVariation, productData, quantity]);

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

  // Handle image selection with automatic attribute selection for variations
  const handleImageSelect = (imageSrc: string, variationId?: number) => {
    setMainImage(imageSrc);

    // If this is a variation image, automatically select its attributes
    if (variationId) {
      const variation = variations.find((v) => v.id === variationId);
      if (variation && variation.attributes) {
        const newAttributes: Record<string, string> = {};

        variation.attributes.forEach((attr) => {
          if (attr.name && attr.option) {
            newAttributes[attr.name] = attr.option;
          }
        });

        setSelectedAttributes(newAttributes);
        setSelectedVariation(variationId);
        setQuantity(1); // Reset quantity when variation changes
      }
    }
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

      // Reset quantity to 1 when variation changes to avoid stock issues
      setQuantity(1);
    } else {
      setSelectedVariation(null);
      setQuantity(1);
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

  // Get price range for variable products
  const getPriceRange = () => {
    if (productData?.type !== "variable" || !variations.length) {
      return null;
    }

    const prices = variations
      .map((variation) => {
        const price =
          variation.sale_price && parseFloat(variation.sale_price) > 0
            ? parseFloat(variation.sale_price)
            : parseFloat(variation.price || "0");
        return price;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      min: minPrice.toString(),
      max: maxPrice.toString(),
    };
  };

  // Get current stock status and quantity
  const getCurrentStock = () => {
    if (selectedVariation) {
      const variation = variations.find((v) => v.id === selectedVariation);
      return {
        status: variation?.stock_status || "outofstock",
        quantity: variation?.stock_quantity || null,
        manageStock: variation?.manage_stock || false,
      };
    }

    // For variable products without selected variation, don't show stock info
    if (productData?.type === "variable") {
      return {
        status: "instock", // Default to in stock for variable products
        quantity: null,
        manageStock: false,
      };
    }

    // For simple products, use product-level stock
    return {
      status: productData?.stock_status || "outofstock",
      quantity: productData?.stock_quantity || null,
      manageStock: productData?.manage_stock || false,
    };
  };

  // Get available stock quantity
  const getAvailableStock = () => {
    const stockInfo = getCurrentStock();
    if (!stockInfo.manageStock) return null;
    return stockInfo.quantity;
  };

  // Check if requested quantity is available
  const isQuantityAvailable = (requestedQuantity: number) => {
    const stockInfo = getCurrentStock();

    // If stock is not managed, only check stock status
    if (!stockInfo.manageStock) {
      return stockInfo.status === "instock";
    }

    // If stock is managed, check both status and quantity
    if (stockInfo.status !== "instock") return false;
    if (!stockInfo.quantity || stockInfo.quantity <= 0) return false;

    return requestedQuantity <= stockInfo.quantity;
  };

  // Check if product can be added to cart
  const canAddToCart = () => {
    const attributesOk = areAllAttributesSelected();

    // For variable products, must have a variation selected
    if (productData?.type === "variable" && !selectedVariation) {
      return false;
    }

    const stockOk =
      getCurrentStock().status === "instock" && isQuantityAvailable(quantity);
    return stockOk && attributesOk;
  };

  // Handle add to cart with variation support
  const handleAddToCart = async () => {
    if (!productData) return;

    // Check if variable product has variation selected
    if (productData.type === "variable" && !selectedVariation) {
      setCartMessage({
        text: "Vui lòng chọn biến thể sản phẩm!",
        type: "error",
      });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    if (!canAddToCart()) {
      // Show specific error message for stock issues
      if (!isQuantityAvailable(quantity)) {
        const availableStock = getAvailableStock();
        setCartMessage({
          text: `Chỉ còn ${availableStock || 0} sản phẩm có sẵn!`,
          type: "error",
        });
        setTimeout(() => setCartMessage(null), 3000);
        return;
      }
      return;
    }

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
        text: `✓ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`,
        type: "success",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setCartMessage({
        text: "Không thể thêm vào giỏ hàng. Vui lòng thử lại.",
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
    if (!productData) return;

    // Check if variable product has variation selected
    if (productData.type === "variable" && !selectedVariation) {
      setCartMessage({
        text: "Vui lòng chọn biến thể sản phẩm!",
        type: "error",
      });
      setTimeout(() => setCartMessage(null), 3000);
      return;
    }

    if (!canAddToCart()) {
      // Show specific error message for stock issues
      if (!isQuantityAvailable(quantity)) {
        const availableStock = getAvailableStock();
        setCartMessage({
          text: `Chỉ còn ${availableStock || 0} sản phẩm có sẵn!`,
          type: "error",
        });
        setTimeout(() => setCartMessage(null), 3000);
        return;
      }
      return;
    }

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
        text: "Không thể thêm vào giỏ hàng. Vui lòng thử lại.",
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
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors mr-4"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Về trang chủ
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
      <div className="px-6 md:px-16 lg:px-32 pt-14 mb-20 space-y-10 container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Product Gallery - Takes up 3/5 of the space on large screens */}
          <div className="lg:col-span-3">
            <ProductGallery
              product={productData}
              variations={variations}
              images={productData.images || []}
              mainImage={
                mainImage ||
                productData.images?.[0]?.src ||
                "/placeholder-image.jpg"
              }
              productName={productData.name}
              onImageSelect={handleImageSelect}
            />
          </div>

          {/* Product Details - Takes up 2/5 of the space on large screens */}
          <div className="lg:col-span-2 flex flex-col">
            <ProductInfo product={productData} />

            <ProductDetailsTable
              product={productData}
              stockStatus={getCurrentStock().status}
              stockQuantity={getAvailableStock()}
              manageStock={getCurrentStock().manageStock}
              selectedVariation={selectedVariation}
              isVariableProduct={productData?.type === "variable"}
            />

            <PriceDisplay
              price={getCurrentPrice().price}
              regularPrice={getCurrentPrice().regular_price}
              salePrice={getCurrentPrice().sale_price}
              onSale={getCurrentPrice().on_sale}
              currency={currency || "$"}
              priceRange={getPriceRange()}
              showRange={
                productData?.type === "variable" &&
                !selectedVariation &&
                variations.length > 0
              }
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

            <div className="border-gray-600 my-6 border-t border-dashed w-full" />

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              price={getCurrentPrice().price}
              maxQuantity={getAvailableStock() || 99}
            />

            <AddToCartSection
              canAddToCart={canAddToCart()}
              isAddingToCart={isAddingToCart}
              isCartLoading={isCartLoading}
              stockStatus={getCurrentStock().status}
              areAllAttributesSelected={areAllAttributesSelected()}
              quantity={quantity}
              cartMessage={cartMessage}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewCart={() => router.push("/cart")}
            />

            <div className="overflow-auto mt-6">
              <div className="max-w-full">
                <h2 className="text-lg font-futura-medium text-gray-800">
                  Mô tả sản phẩm
                </h2>
              </div>
              {/* Description */}
              <div
                className="text-gray-600 mt-3"
                dangerouslySetInnerHTML={{
                  __html:
                    productData.short_description ||
                    productData.description ||
                    "No description available",
                }}
              />
            </div>
          </div>
        </div>

        {/* Upsell and Cross-sell Products */}
        {productData &&
          (productData.upsell_ids?.length > 0 ||
            productData.cross_sell_ids?.length > 0) && (
            <UpsellCrosssell
              upsellIds={productData.upsell_ids || []}
              crossSellIds={productData.cross_sell_ids || []}
              title="Sản phẩm liên quan"
              className="my-12"
            />
          )}

        {/* Related Products */}
        <RelatedProducts
          products={featuredProducts}
          onSeeMore={() => router.push("/")}
          title="Sản phẩm nổi bật"
        />
      </div>
      <Footer />
    </>
  );
};

export default Product;
