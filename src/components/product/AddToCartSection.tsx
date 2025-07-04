import React from "react";

interface CartMessage {
  text: string;
  type: "success" | "error";
}

interface AddToCartSectionProps {
  canAddToCart: boolean;
  isAddingToCart: boolean;
  isCartLoading: boolean;
  stockStatus: string;
  areAllAttributesSelected: boolean;
  quantity: number;
  cartMessage: CartMessage | null;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onViewCart: () => void;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  canAddToCart,
  isAddingToCart,
  isCartLoading,
  stockStatus,
  areAllAttributesSelected,
  quantity,
  cartMessage,
  onAddToCart,
  onBuyNow,
  onViewCart,
}) => {
  const getButtonText = (isBuyNow = false) => {
    if (stockStatus !== "instock") {
      return "Hết hàng";
    }
    if (!areAllAttributesSelected) {
      return "Vui lòng chọn đầy đủ thuộc tính";
    }
    if (isBuyNow) {
      return "Mua ngay";
    }
    return `Thêm ${quantity > 1 ? `${quantity} ` : ""}vào giỏ hàng`;
  };

  const LoadingSpinner = ({ isWhite = false }) => (
    <svg
      className={`animate-spin h-4 w-4 ${isWhite ? "text-white" : ""}`}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <>
      {/* Cart Message */}
      {cartMessage && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            cartMessage.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{cartMessage.text}</p>
            {cartMessage.type === "success" && (
              <button
                onClick={onViewCart}
                className="text-sm text-green-700 hover:text-green-900 font-medium underline"
              >
                Xem giỏ hàng
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center mt-6 gap-4">
        <button
          onClick={onAddToCart}
          disabled={!canAddToCart || isAddingToCart || isCartLoading}
          className={`w-full rounded-sm py-3.5 font-futura-medium transition relative ${
            canAddToCart && !isAddingToCart && !isCartLoading
              ? "bg-gray-100 text-gray-800/80 hover:bg-gray-200"
              : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isAddingToCart || isCartLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
            </div>
          ) : (
            getButtonText()
          )}
        </button>

        <button
          onClick={onBuyNow}
          disabled={!canAddToCart || isAddingToCart || isCartLoading}
          className={`w-full rounded-sm py-3.5 font-futura-medium transition relative ${
            canAddToCart && !isAddingToCart && !isCartLoading
              ? "bg-black text-white hover:bg-gray-600"
              : "bg-gray-300 text-gray-100 cursor-not-allowed"
          }`}
        >
          {isAddingToCart || isCartLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner isWhite />
              Processing...
            </div>
          ) : (
            getButtonText(true)
          )}
        </button>
      </div>
    </>
  );
};

export default AddToCartSection;
