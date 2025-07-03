"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Product, CartItem } from "@/types/product.interface";
import {
  ShoppingCartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartWidget: React.FC<CartWidgetProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    products,
    getCartCount,
    getCartAmount,
    updateCartQuantity,
    currency,
  } = useAppContext();
  const [cartItemsData, setCartItemsData] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Convert cart items from context to detailed cart items
  useEffect(() => {
    const convertCartItems = () => {
      const items: CartItem[] = [];

      for (const cartKey in cartItems) {
        const quantity = cartItems[cartKey];
        if (quantity > 0) {
          const [productId, variationId] = cartKey.split("-");
          const product = products.find((p) => p.id === parseInt(productId));

          if (product) {
            let price = parseFloat(product.price) || 0;
            let image =
              product.images[0] ||
              ({
                id: 0,
                src: "/placeholder-image.jpg",
                alt: product.name,
              } as any);
            let variantText = "";

            // Get variation data if available
            if (variationId && (window as any).productVariations) {
              const variation = (window as any).productVariations.find(
                (v: any) => v.id === parseInt(variationId)
              );
              if (variation) {
                // Use variation's price and image if available
                price = parseFloat(variation.price) || price;
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
            }

            const total = (price * quantity).toFixed(2);

            const cartItem: CartItem = {
              id: parseInt(cartKey.replace("-", "")), // Unique cart item ID
              product_id: product.id,
              variation_id: variationId ? parseInt(variationId) : undefined,
              name: product.name,
              price: price.toString(),
              quantity: quantity,
              image: image,
              attributes: variationId ? product.attributes : undefined,
              variant: variantText,
              total: total,
            };

            items.push(cartItem);
          }
        }
      }

      setCartItemsData(items);
    };

    convertCartItems();
  }, [cartItems, products]);

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

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Cart Widget */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {getCartCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {getCartCount()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {cartItemsData.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Start shopping to add items to your cart
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItemsData.map((item) => (
                  <div
                    key={`${item.product_id}-${item.variation_id || ""}`}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image.src || "/placeholder-image.jpg"}
                        alt={item.image.alt || item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>

                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.variant}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {currency}
                          {parseFloat(item.price).toFixed(2)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity - 1,
                                item.variation_id
                              )
                            }
                            disabled={isLoading || item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-50"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>

                          <span className="w-8 text-center text-sm font-medium">
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
                            className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-50"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.product_id,
                                item.variation_id
                              )
                            }
                            disabled={isLoading}
                            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded disabled:opacity-50 ml-2"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right mt-1">
                        <span className="text-sm font-semibold text-gray-900">
                          Total: {currency}
                          {item.total}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary & Actions */}
              <div className="border-t p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Subtotal:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {currency}
                    {getCartAmount().toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleViewCart}
                    className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    View Cart
                  </button>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartWidget;
