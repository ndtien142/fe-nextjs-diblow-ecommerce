import React, { useState } from "react";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CheckoutData } from "../page";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { formatPrice } from "@/utils/formatPrice";

interface CartStepProps {
  checkoutData: CheckoutData;
  onNext: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

const CartStep: React.FC<CartStepProps> = ({
  checkoutData,
  onNext,
  onUpdateData,
}) => {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const { updateCartQuantity, isCartLoading } = useAppContext();

  const updateQuantity = async (
    cartKey: string,
    productId: number,
    newQuantity: number,
    variationId?: number
  ) => {
    if (newQuantity < 0) return;

    // Use AppContext to update cart
    await updateCartQuantity(productId, newQuantity, variationId);
  };

  const removeItem = async (
    cartKey: string,
    productId: number,
    variationId?: number
  ) => {
    // Use AppContext to remove item (set quantity to 0)
    await updateCartQuantity(productId, 0, variationId);
  };

  const applyDiscountCode = async () => {
    setIsApplyingDiscount(true);

    // Simulate discount code validation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let discount = 0;
    if (discountCode.toLowerCase() === "save10") {
      discount = checkoutData.subtotal * 0.1; // 10% discount
    } else if (discountCode.toLowerCase() === "save50") {
      discount = 50; // $50 flat discount
    }

    const tax = checkoutData.subtotal * 0.1;
    const total = checkoutData.subtotal - discount + tax;

    onUpdateData({
      discount,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
    setIsApplyingDiscount(false);
  };

  const isCartEmpty = checkoutData.cartItems.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Cart</h2>

        {isCartEmpty ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 8M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-8m-9 4h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500">
              Add some products to continue with checkout
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {checkoutData.cartItems.map((item) => (
                <div
                  key={item.cartKey || item.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="relative w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-500">{item.variant}</p>
                    )}
                    {item.on_sale &&
                    item.sale_price &&
                    parseFloat(item.sale_price) > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-red-600">
                          {formatPrice(parseFloat(item.sale_price).toFixed(2))}
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
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(parseFloat(item.price).toFixed(2))}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.cartKey || item.id.toString(),
                          item.id,
                          item.quantity - 1,
                          item.variationId
                        )
                      }
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={item.quantity <= 1 || isCartLoading}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>

                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.cartKey || item.id.toString(),
                          item.id,
                          item.quantity + 1,
                          item.variationId
                        )
                      }
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={isCartLoading}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice((item.price * item.quantity).toFixed(2))}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(
                        item.cartKey || item.id.toString(),
                        item.id,
                        item.variationId
                      )
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    disabled={isCartLoading}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Discount Code
              </h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter discount code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={applyDiscountCode}
                  disabled={!discountCode || isApplyingDiscount}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplyingDiscount ? "Applying..." : "Apply"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Try: "SAVE10" for 10% off or "SAVE50" for $50 off
              </p>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(checkoutData.subtotal.toFixed(2))}
                  </span>
                </div>

                {checkoutData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -{formatPrice(checkoutData.discount.toFixed(2))}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {formatPrice(checkoutData.tax.toFixed(2))}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(checkoutData.total.toFixed(2))}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <button
          onClick={onNext}
          disabled={isCartEmpty || isCartLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isCartLoading ? "Updating Cart..." : "Continue to Billing"}
        </button>
      </div>
    </div>
  );
};

export default CartStep;
