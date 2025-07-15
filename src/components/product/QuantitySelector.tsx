import { formatPrice } from "@/utils/formatPrice";
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  price: string;
  maxQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  price,
  maxQuantity = 99,
}) => {
  const handleDecrease = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(Math.min(maxQuantity, quantity + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    onQuantityChange(Math.max(1, Math.min(maxQuantity, value)));
  };

  return (
    <div className="">
      <label className="block text-sm font-helvetica-medium text-gray-700 mb-2">
        Số lượng
      </label>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <input
            // type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={handleInputChange}
            className="w-16 px-3 py-2 text-center border-0 focus:outline-none font-helvetica"
          />

          <button
            onClick={handleIncrease}
            disabled={quantity >= maxQuantity}
            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {quantity > 1 && (
          <span className="text-sm text-gray-600 font-helvetica">
            Tổng tiền:
            {formatPrice(parseFloat(price) * quantity)}
          </span>
        )}
      </div>
    </div>
  );
};

export default QuantitySelector;
