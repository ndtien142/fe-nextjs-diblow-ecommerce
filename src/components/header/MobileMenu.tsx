"use client";

import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavigationLinks from "./NavigationLinks";
import UserActions from "./UserActions";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="px-6 py-4 space-y-4">
            {/* Navigation with Categories */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Navigation</h3>
              <NavigationLinks className="space-y-2" isMobile={true} />
            </div>

            {/* User Actions */}
            <div className="pt-4 border-t border-gray-200">
              <UserActions isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
