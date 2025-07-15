"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { CartItem } from "@/types/product.interface";
import {
  ShoppingCartIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";

interface CartWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartWidget: React.FC<CartWidgetProps> = ({ isOpen, onClose }) => {
  const { cartItems, getCartCount, getCartAmount, updateCartQuantity } =
    useAppContext();
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
          const [variationId] = cartKey.split("-");

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
              id: parseInt(cartKey.replace("-", "")), // Unique cart item ID
              product_id: product.id,
              variation_id: variationId ? parseInt(variationId) : undefined,
              name: product.name,
              price: finalPrice.toString(), // Use final price for calculations
              quantity: quantity,
              image: image,
              attributes: variationId ? product.attributes : undefined,
              variant: variantText,
              total: total,
              regular_price: regularPrice.toString(),
              sale_price: salePrice.toString(),
              on_sale: isOnSale,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-50 z-[]80"
        onClick={onClose}
      />
      {/* Cart Widget */}
      <div className="fixed top-0 right-0 h-[100vh] w-[320px] md:w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out pl-5 pr-5 pt-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <ShoppingCartIcon className="w-6 h-6" /> */}
            <h2 className="text-lg uppercase font-helvetica-heavy">Giỏ hàng</h2>
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
        <div className="flex flex-col h-full mt-12">
          {cartItemsData.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-500 mb-6">
                Bắt đầu mua sắm để thêm sản phẩm vào giỏ hàng
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="">
                {cartItemsData.map((item) => (
                  <div
                    key={`${item.product_id}-${item.variation_id || ""}`}
                    className="flex gap-3 p-3 "
                  >
                    {/* Product Image */}
                    <div className="w-20 h-auto max-h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

                      <div className="flex flex-col items-start gap-2 justify-between mt-2">
                        {/* Price Display */}
                        <div className="flex items-center gap-2">
                          {item.on_sale &&
                          item.sale_price &&
                          parseFloat(item.sale_price) > 0 ? (
                            <>
                              <span className="text-sm font-helvetica-heavy text-red-600">
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
                            </>
                          ) : (
                            <span className="text-sm font-helvetica-heavy text-gray-900">
                              {formatPrice(parseFloat(item.price).toFixed(2))}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
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
                          </div>

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
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="float-left w-full border-t border-t-[#000] my-3 border-dashed"></div>

              {/* Cart Summary & Actions */}
              <div className="p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-helvetica-heavy text-gray-900">
                    Tổng tiền:
                  </span>
                  <span className="text-lg font-helvetica-heavy text-gray-900">
                    {formatPrice(getCartAmount().toFixed(2))}
                  </span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Phí vận chuyển và thuế sẽ được tính tại trang thanh toán
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleViewCart}
                    className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Xem giỏ hàng
                  </button>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartWidget;
