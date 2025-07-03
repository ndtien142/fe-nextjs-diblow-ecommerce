"use client";

import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import CartButton from "@/components/cart/CartButton";

interface UserActionsProps {
  className?: string;
  isMobile?: boolean;
}

const UserActions: React.FC<UserActionsProps> = ({
  className = "",
  isMobile = false,
}) => {
  const containerClass = isMobile
    ? `flex items-center gap-3 ${className}`
    : `hidden md:flex items-center gap-4 ${className}`;

  return (
    <div className={containerClass}>
      {!isMobile && (
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <Image
            className="w-4 h-4"
            src={assets.search_icon}
            alt="search icon"
          />
        </button>
      )}

      <button className="flex items-center gap-2 hover:text-gray-900 transition-all duration-200 hover:scale-105">
        <Image src={assets.user_icon} alt="user icon" width={20} height={20} />
        <span className={isMobile ? "text-sm" : ""}>Tài khoản</span>
      </button>

      {/* Cart Button */}
      <CartButton
        className="hover:text-gray-900 transition-all duration-200 hover:scale-105"
        showText={isMobile}
        iconSize={isMobile ? "sm" : "md"}
      />
    </div>
  );
};

export default UserActions;
