"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { CartItem } from "@/types/product.interface";
import { Navbar } from "@/components/header";
import Footer from "@/components/Footer";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

const CartPage: React.FC = () => {
  const {
    cartItems,
    getCartCount,
    getCartAmount,
    updateCartQuantity,
    currency,
  } = useAppContext();

  const [cartItemsData, setCartItemsData] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  // Convert cart items from context to detailed cart items
  useEffect(() => {
    const convertCartItems = () => {
      const items: CartItem[] = [];

      for (const cartKey in cartItems) {
        const quantity = cartItems[cartKey];
        if (quantity > 0) {
          const [productId, variationId] = cartKey.split("-");

          // Get cached product and variation data
          const cachedData = (window as any).cartProductsCache?.[cartKey];
          if (!cachedData?.product) continue;

          const product = cachedData.product;
          const variation = cachedData.variation;

          if (product) {
            let price = parseFloat(product.price) || 0;
            let regularPrice = parseFloat(product.regular_price) || 0;
            let salePrice = parseFloat(product.sale_price) || 0;
            let isOnSale = product.on_sale || false;
            let image =
              product.images[0] ||
              ({
                id: 0,
                src: "/placeholder-image.jpg",
                alt: product.name,
              } as any);
            let variantText = "";

            // Use variation data if available
            if (variation) {
              // Use variation's price and image if available
              price = parseFloat(variation.price) || price;
              regularPrice =
                parseFloat(variation.regular_price) || regularPrice;
              salePrice = parseFloat(variation.sale_price) || salePrice;
              isOnSale =
                variation.on_sale ||
                (salePrice > 0 && salePrice < regularPrice);

              if (variation.image?.src) {
                image = variation.image;
              }

              // Build variant text from attributes
              if (variation.attributes && variation.attributes.length > 0) {
                variantText = variation.attributes
                  .map((attr: any) => `${attr.name}: ${attr.option}`)
                  .join(", ");
              } else if (variation.name) {
                variantText = variation.name;
              }
            }

            // Use sale price for calculation if on sale
            const finalPrice = isOnSale && salePrice > 0 ? salePrice : price;
            const total = (finalPrice * quantity).toFixed(2);

            const cartItem: CartItem = {
              id: parseInt(cartKey.replace("-", "")),
              product_id: product.id,
              variation_id: variationId ? parseInt(variationId) : undefined,
              name: product.name,
              price: finalPrice.toString(), // Use final price for calculations
              regular_price: regularPrice.toString(),
              sale_price: salePrice.toString(),
              on_sale: isOnSale,
              quantity: quantity,
              image: image,
              attributes: variationId ? product.attributes : undefined,
              total: total,
              variant: variantText,
            };

            items.push(cartItem);
          }
        }
      }

      setCartItemsData(items);
    };

    convertCartItems();
  }, [cartItems]);

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number,
    variationId?: number
  ) => {
    setIsLoading(true);
    await updateCartQuantity(productId, newQuantity, variationId);
    setIsLoading(false);
  };

  const handleRemoveItem = async (productId: number, variationId?: number) => {
    await handleQuantityChange(productId, 0, variationId);
  };

  const handleApplyPromoCode = () => {
    // Mock promo code logic - replace with actual API call
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(getCartAmount() * 0.1);
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(getCartAmount() * 0.2);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  const subtotal = getCartAmount();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal - discount + tax;

  if (cartItemsData.length === 0) {
    return (
      <>
        <Navbar />
        <div className="main-productPage min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/shop"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="main-productPage min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {getCartCount()} {getCartCount() === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Cart Items Header */}
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-900">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Total</div>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y">
                    {cartItemsData.map((item) => (
                      <div
                        key={`${item.product_id}-${item.variation_id || ""}`}
                        className="px-6 py-6"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Product Info */}
                          <div className="col-span-6 flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image.src || "/placeholder-image.jpg"}
                                alt={item.image.alt || item.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.variant}
                                </p>
                              )}
                              <button
                                onClick={() =>
                                  handleRemoveItem(
                                    item.product_id,
                                    item.variation_id
                                  )
                                }
                                disabled={isLoading}
                                className="text-red-600 hover:text-red-800 text-sm font-medium mt-2 disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 flex items-center justify-center">
                            <div className="flex items-center gap-2 border rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    item.quantity - 1,
                                    item.variation_id
                                  )
                                }
                                disabled={isLoading || item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>

                              <span className="w-12 text-center text-sm font-medium">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    item.quantity + 1,
                                    item.variation_id
                                  )
                                }
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-center">
                            {item.on_sale &&
                            item.sale_price &&
                            parseFloat(item.sale_price) > 0 ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-medium text-red-600">
                                  {formatPrice(
                                    parseFloat(item.sale_price).toFixed(2)
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(
                                    parseFloat(
                                      item.regular_price || item.price
                                    ).toFixed(2)
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-medium text-gray-900">
                                {formatPrice(parseFloat(item.price).toFixed(2))}
                              </span>
                            )}
                          </div>

                          {/* Total */}
                          <div className="col-span-2 text-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(item.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(subtotal.toFixed(2))}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatPrice(discount.toFixed(2))}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">
                        {formatPrice(tax.toFixed(2))}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(total.toFixed(2))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure checkout powered by SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
