"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import CartWidget from "./CartWidget";

interface CartButtonProps {
  className?: string;
  showText?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

const CartButton: React.FC<CartButtonProps> = ({
  className = "",
  showText = false,
  iconSize = "md",
}) => {
  const { getCartCount } = useAppContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = getCartCount();

  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <button
        onClick={handleCartClick}
        className={`relative flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        aria-label={`Shopping cart with ${cartCount} items`}
      >
        <div className="relative">
          <ShoppingCartIcon className={iconSizeClasses[iconSize]} />

          {/* Cart Count Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-futura-heavy rounded-full min-w-[1rem] h-4 flex items-center justify-center px-1">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>

        {showText && (
          <span className="text-sm font-medium">
            Cart {cartCount > 0 && `(${cartCount})`}
          </span>
        )}
      </button>

      {/* Cart Widget */}
      <CartWidget isOpen={isCartOpen} onClose={handleCartClose} />
    </>
  );
};

export default CartButton;
